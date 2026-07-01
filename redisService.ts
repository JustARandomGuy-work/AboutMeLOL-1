import express, { Router, Request, Response } from 'express';
import { db } from '../index.js';
import { profiles, links } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import auth, { AuthRequest } from '../middleware/auth.js';
import ProfileService from '../services/profileService.js';
import BunnyService from '../services/bunnyService.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/@:username', async (req: Request, res: Response) => {
  try {
    const profile = await ProfileService.getProfileByUsername(req.params.username);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/:profileId', async (req: Request, res: Response) => {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, req.params.profileId)
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profileLinks = await db.query.links.findMany({
      where: eq(links.profileId, profile.id)
    });

    res.json({ ...profile, links: profileLinks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/@:username', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { bio, themeColor, badgeTextGlow, badgeAnimation } = req.body;
    const updated = await ProfileService.updateProfile(req.userId!, {
      bio,
      themeColor,
      badgeTextGlow,
      badgeAnimation,
      updatedAt: new Date()
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/@:username/avatar', auth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileName = BunnyService.generateFileName(req.userId!, 'jpg');
    const url = await BunnyService.uploadFile(fileName, req.file.buffer, 'avatars');

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, req.params.profileId || '')
    });

    if (profile) {
      await db.update(profiles).set({ avatarUrl: url }).where(eq(profiles.id, profile.id));
    }

    res.json({ url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:profileId/links', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, url, iconType } = req.body;
    const link = await ProfileService.addLink(req.params.profileId, title, url, iconType);
    res.status(201).json(link);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:profileId/links/:linkId', auth, async (req: AuthRequest, res: Response) => {
  try {
    await ProfileService.deleteLink(req.params.linkId);
    res.json({ message: 'Link deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
