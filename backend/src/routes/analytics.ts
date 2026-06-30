import express, { Router, Request, Response } from 'express';
import AnalyticsService from '../services/analyticsService.js';

const router = Router();

router.get('/:profileId', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.getAnalytics(req.params.profileId);
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/track-visit', async (req: Request, res: Response) => {
  try {
    const { profileId, visitorIp } = req.body;
    await AnalyticsService.trackVisit(profileId, visitorIp);
    res.json({ message: 'Visit tracked' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/track-click', async (req: Request, res: Response) => {
  try {
    const { profileId } = req.body;
    await AnalyticsService.trackClick(profileId);
    res.json({ message: 'Click tracked' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
