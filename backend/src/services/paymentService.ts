<<<<<<< HEAD
import axios from 'axios';
import { db } from '../index.js';
import { transactions, userCosmetics, cosmetics } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class PaymentService {
  static readonly BASE_URL = process.env.PAYPAL_MODE === 'live' 
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  static async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    try {
      const response = await axios.post(`${this.BASE_URL}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.access_token;
    } catch (error) {
      console.error('PayPal auth error:', error);
      throw error;
    }
  }

  static async createOrder(cosmeticId: string, amount: number): Promise<{ id: string; approvalUrl: string }> {
    const token = await this.getAccessToken();

    const response = await axios.post(`${this.BASE_URL}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: `Cosmetic: ${cosmeticId}`
      }],
      return_url: `${process.env.VITE_APP_URL}/shop?success=true`,
      cancel_url: `${process.env.VITE_APP_URL}/shop?cancelled=true`
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const approvalLink = response.data.links.find((link: any) => link.rel === 'approve');

    return {
      id: response.data.id,
      approvalUrl: approvalLink?.href || ''
    };
  }

  static async captureOrder(orderId: string, userId: string, cosmeticId: string, amount: number) {
    const token = await this.getAccessToken();

    const response = await axios.post(`${this.BASE_URL}/v2/checkout/orders/${orderId}/capture`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.data.status === 'COMPLETED') {
      // Record transaction
      const txn = await db.insert(transactions).values({
        userId,
        paypalTransactionId: response.data.id,
        cosmeticId,
        amount: parseFloat(amount.toString()),
        status: 'completed'
      }).returning();

      // Grant cosmetic to user
      await db.insert(userCosmetics).values({
        userId,
        cosmeticId
      });

      return txn[0];
    }

    throw new Error('Payment not completed');
  }

  static async handleWebhook(body: any) {
    // Verify and process PayPal webhook
    console.log('Webhook received:', body.event_type);
    
    if (body.event_type === 'CHECKOUT.ORDER.COMPLETED') {
      // Handle order completion
      return true;
    }

    return false;
  }
}

export default PaymentService;
=======
import axios from 'axios';
import { db } from '../index.js';
import { transactions, userCosmetics, cosmetics } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class PaymentService {
  static readonly BASE_URL = process.env.PAYPAL_MODE === 'live' 
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  static async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    try {
      const response = await axios.post(`${this.BASE_URL}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.access_token;
    } catch (error) {
      console.error('PayPal auth error:', error);
      throw error;
    }
  }

  static async createOrder(cosmeticId: string, amount: number): Promise<{ id: string; approvalUrl: string }> {
    const token = await this.getAccessToken();

    const response = await axios.post(`${this.BASE_URL}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: `Cosmetic: ${cosmeticId}`
      }],
      return_url: `${process.env.VITE_APP_URL}/shop?success=true`,
      cancel_url: `${process.env.VITE_APP_URL}/shop?cancelled=true`
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const approvalLink = response.data.links.find((link: any) => link.rel === 'approve');

    return {
      id: response.data.id,
      approvalUrl: approvalLink?.href || ''
    };
  }

  static async captureOrder(orderId: string, userId: string, cosmeticId: string, amount: number) {
    const token = await this.getAccessToken();

    const response = await axios.post(`${this.BASE_URL}/v2/checkout/orders/${orderId}/capture`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.data.status === 'COMPLETED') {
      // Record transaction
      const txn = await db.insert(transactions).values({
        userId,
        paypalTransactionId: response.data.id,
        cosmeticId,
        amount: parseFloat(amount.toString()),
        status: 'completed'
      }).returning();

      // Grant cosmetic to user
      await db.insert(userCosmetics).values({
        userId,
        cosmeticId
      });

      return txn[0];
    }

    throw new Error('Payment not completed');
  }

  static async handleWebhook(body: any) {
    // Verify and process PayPal webhook
    console.log('Webhook received:', body.event_type);
    
    if (body.event_type === 'CHECKOUT.ORDER.COMPLETED') {
      // Handle order completion
      return true;
    }

    return false;
  }
}

export default PaymentService;
>>>>>>> aee9477181ceb519ab7930d588f6fed3b340e70c
