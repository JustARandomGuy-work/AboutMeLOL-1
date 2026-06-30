<<<<<<< HEAD
import express, { Router, Request, Response } from 'express';
import { db } from '../index.js';
import { users, profiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import auth, { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.userId!)
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.params.userId)
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/check-username/:username', async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, req.params.username)
    });

    res.json({ available: !user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:userId', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { email } = req.body;

    if (email) {
      const existing = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (existing && existing.id !== req.userId) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updated = await db.update(users)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(users.id, req.userId))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
=======
import express, { Router, Request, Response } from 'express';
import { db } from '../index.js';
import { users, profiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import auth, { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.userId!)
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.params.userId)
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/check-username/:username', async (req: Request, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, req.params.username)
    });

    res.json({ available: !user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:userId', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { email } = req.body;

    if (email) {
      const existing = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (existing && existing.id !== req.userId) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updated = await db.update(users)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(users.id, req.userId))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
>>>>>>> aee9477181ceb519ab7930d588f6fed3b340e70c
