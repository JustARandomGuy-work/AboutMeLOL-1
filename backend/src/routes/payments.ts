import express, { Router, Request, Response } from 'express';
import auth, { AuthRequest } from '../middleware/auth.js';
import PaymentService from '../services/paymentService.js';
import EmailService from '../services/emailService.js';
import { db } from '../index.js';
import { cosmetics } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/create-order', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { cosmeticId } = req.body;

    const cosmetic = await db.query.cosmetics.findFirst({
      where: eq(cosmetics.id, cosmeticId)
    });

    if (!cosmetic) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }

    const result = await PaymentService.createOrder(cosmeticId, parseFloat(cosmetic.price.toString()));
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/capture', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, cosmeticId } = req.body;

    const cosmetic = await db.query.cosmetics.findFirst({
      where: eq(cosmetics.id, cosmeticId)
    });

    if (!cosmetic) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }

    const result = await PaymentService.captureOrder(orderId, req.userId!, cosmeticId, parseFloat(cosmetic.price.toString()));

    // Send receipt email
    const user = await db.query.users.findFirst({
      where: eq(cosmetics.id, req.userId!)
    });

    if (user) {
      await EmailService.sendPurchaseReceipt(user.email, cosmetic.name, parseFloat(cosmetic.price.toString()));
    }

    res.json({ message: 'Payment captured', transaction: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  try {
    await PaymentService.handleWebhook(req.body);
    res.json({ message: 'Webhook processed' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
