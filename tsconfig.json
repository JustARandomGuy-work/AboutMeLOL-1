import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';

const ses = new AWS.SES({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export class EmailService {
  static async sendVerificationEmail(email: string, code: string) {
    const verifyUrl = `${process.env.VITE_APP_URL}/verify-email?code=${code}`;

    const html = `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>Or paste this code: ${code}</p>
    `;

    return this.sendEmail(email, 'Verify your email', html);
  }

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.VITE_APP_URL}/reset-password?token=${token}`;

    const html = `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `;

    return this.sendEmail(email, 'Reset your password', html);
  }

  static async sendPurchaseReceipt(email: string, cosmeticName: string, amount: number) {
    const html = `
      <h1>Purchase Confirmed</h1>
      <p>Thanks for your purchase!</p>
      <p>You bought: <strong>${cosmeticName}</strong></p>
      <p>Amount: $${amount.toFixed(2)}</p>
    `;

    return this.sendEmail(email, 'Purchase Receipt', html);
  }

  static async sendEmail(to: string, subject: string, html: string) {
    const params: AWS.SES.SendEmailRequest = {
      Source: process.env.AWS_SES_FROM_EMAIL || 'noreply@about-me.lol',
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } }
      }
    };

    try {
      const result = await ses.sendEmail(params).promise();
      console.log('Email sent:', result.MessageId);
      return result;
    } catch (error) {
      console.error('Email error:', error);
      throw error;
    }
  }
}

export default EmailService;
