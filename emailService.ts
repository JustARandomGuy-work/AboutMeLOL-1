import express, { Router, Request, Response } from 'express';
import { db } from '../index';
import { cosmetics, userCosmetics } from '../db/schema';
import { eq } from 'drizzle-orm';
import auth, { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/shop', async (req: Request, res: Response) => {
  try {
    const allCosmetics = await db.query.cosmetics.findMany();
    res.json(allCosmetics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userCosms = await db.query.userCosmetics.findMany({
      where: eq(userCosmetics.userId, req.params.userId)
    });

    const cosmeticIds = userCosms.map(uc => uc.cosmeticId);
    const userCosmeticsList = await Promise.all(
      cosmeticIds.map(id => db.query.cosmetics.findFirst({ where: eq(cosmetics.id, id!) }))
    );

    res.json({ cosmetics: userCosmeticsList.filter(Boolean) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cosmeticId/apply', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { profileId } = req.body;
    // Apply cosmetic logic here
    res.json({ message: 'Cosmetic applied' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
