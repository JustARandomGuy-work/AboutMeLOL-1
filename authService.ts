import express, { Router, Request, Response } from 'express';
import auth from '../middleware/auth';

const router = Router();

router.post('/upload', auth, async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Upload endpoint' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:mediaId', auth, async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Media deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
