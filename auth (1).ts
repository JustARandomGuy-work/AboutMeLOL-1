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

router.get('/supabase-config', (req: Request, res: Response) => {
  let url = process.env.SUPABASE_URL || '';
  let key = process.env.SUPABASE_KEY || '';

  // Fallback: extract url from DATABASE_URL if not directly set
  if (!url && process.env.DATABASE_URL) {
    const match = process.env.DATABASE_URL.match(/@([^:/]+)/);
    if (match && match[1]) {
      const host = match[1];
      if (host.includes('supabase')) {
        const userMatch = process.env.DATABASE_URL.match(/postgres\.([^:]+):/);
        if (userMatch && userMatch[1]) {
          url = `https://${userMatch[1]}.supabase.co`;
        }
      }
    }
  }

  // Sanitization of string representations of undefined/null or empty
  if (url === 'undefined' || url === 'null' || !url.trim()) url = '';
  if (key === 'undefined' || key === 'null' || !key.trim()) key = '';

  res.json({
    supabaseUrl: url,
    supabaseKey: key
  });
});

router.post('/social-login', async (req: Request, res: Response) => {
  try {
    const { email, username } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    const fallbackUsername = username || email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');

    const result = await AuthService.socialLogin(email, fallbackUsername);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', auth, (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
