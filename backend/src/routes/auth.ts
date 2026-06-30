import express, { Router, Request, Response } from 'express';
import AuthService from '../services/authService.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await AuthService.register(email, username, password);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refresh token' });
    }

    const result = await AuthService.refreshToken(refreshToken);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/logout', auth, (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
