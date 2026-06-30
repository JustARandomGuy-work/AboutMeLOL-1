# About Me.LOL - External Services Setup Guide

## 1. SUPABASE (PostgreSQL Database)

### Setup Steps
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Select region (closest to users)
5. Create strong database password
6. Wait for provisioning (~2 min)

### Get Credentials
- **Project URL**: Settings → API → URL
- **Database Password**: Settings → Database → Password
- **Connection String**: Settings → Database → Connection Pooling → PostgreSQL
  - Format: `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`
- **API Key**: Settings → API → Service Role Key (keep secret!)

### Environment Variables
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

### First Steps
- [ ] Create project
- [ ] Save connection string
- [ ] Run database migrations (Drizzle)
- [ ] Test connection from Railway

---

## 2. UPSTASH REDIS (In-Memory Cache)

### Setup Steps
1. Go to [console.upstash.com](https://console.upstash.com)
2. Sign up / Log in
3. Click **"Create Database"**
4. Choose region
5. Select **"Upstash Redis"**
6. Choose **"Free"** tier

### Get Credentials
- **Redis URL**: Details → REST API → URL
  - Format: `redis://default:password@host:port`
- **Database Details**: Name, Status

### Environment Variables
```
REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_HOST:39XXX
```

### Usage Example
```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);
await redis.set('key', 'value', 'EX', 3600); // 1 hour TTL
```

### Cache Strategy
- **Profile data**: 30 min TTL
- **Analytics**: 5 min TTL
- **Session data**: 24 hour TTL
- **Rate limit counters**: 1 min TTL

### First Steps
- [ ] Create Redis instance
- [ ] Save URL
- [ ] Test connection
- [ ] Implement cache layer

---

## 3. BUNNY.NET (CDN + Media Storage)

### Setup Steps
1. Go to [bunny.net](https://bunny.net)
2. Sign up / Log in
3. Click **"Storage"** menu
4. Create new **"Storage Zone"**
5. Choose region (NY, EU, etc.)
6. Set name: `aboutme-media`

### Get Credentials
- **Storage Zone Name**: aboutme-media
- **API Key**: Account Settings → Security → API Key
- **CDN URL**: Pull Zone → CDN URL (auto-created)
  - Format: `https://aboutme-media.b-cdn.net/`

### Environment Variables
```
BUNNY_API_KEY=YOUR_API_KEY
BUNNY_STORAGE_ZONE=aboutme-media
BUNNY_STORAGE_REGION=ny
BUNNY_CDN_URL=https://aboutme-media.b-cdn.net
```

### Upload Example
```typescript
const fs = require('fs');
const axios = require('axios');

async function uploadAvatar(userId: string, file: Buffer) {
  const response = await axios.put(
    `https://ny.storage.bunnycdn.com/aboutme-media/avatars/${userId}.jpg`,
    file,
    {
      headers: {
        'AccessKey': process.env.BUNNY_API_KEY,
        'Content-Type': 'image/jpeg'
      }
    }
  );
  
  return `https://aboutme-media.b-cdn.net/avatars/${userId}.jpg`;
}
```

### File Structure
```
aboutme-media/
├── avatars/
│   └── user-123.jpg
├── backgrounds/
│   └── user-123.gif
└── cosmetics/
    └── badge-premium.png
```

### Pricing (ZERO Egress!)
- Storage: $0.01/GB/month
- Download/Egress: FREE ✓
- Perfect for CDN-heavy usage

### First Steps
- [ ] Create storage zone
- [ ] Get API key
- [ ] Set up upload endpoints
- [ ] Test file uploads

---

## 4. AMAZON SES (Email Service)

### Setup Steps
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Sign up / Log in
3. Search **"Simple Email Service"**
4. Go to **Verified identities**
5. Create new identity: **Email**
6. Enter sender email: `noreply@about-me.lol`
7. Check email inbox for verification link
8. Click verification link

### Get Credentials
1. **IAM User Setup**:
   - Go to **IAM → Users → Create user**
   - Name: `about-me-ses`
   - Click through to add permissions
   - Attach **"AmazonSESFullAccess"**
   - Create access key
   - Save **Access Key ID** and **Secret Access Key**

### Environment Variables
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@about-me.lol
```

### Email Templates

**Verification Email**
```html
<h1>Verify your Email</h1>
<p>Click the link to verify: <a href="https://about-me.lol/verify?code=XXXX">Verify</a></p>
```

**Password Reset**
```html
<h1>Reset your Password</h1>
<p>Click here to reset: <a href="https://about-me.lol/reset?token=XXXX">Reset Password</a></p>
```

**Purchase Receipt**
```html
<h1>Thanks for your purchase!</h1>
<p>You bought: <strong>Premium Glow Badge</strong></p>
<p>Amount: $2.99</p>
```

### Send Email Example
```typescript
import * as AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-1' });

async function sendEmail(to: string, subject: string, html: string) {
  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: html } }
    }
  };

  return ses.sendEmail(params).promise();
}
```

### Important Notes
- **Sandbox mode**: Can only send to verified emails
- **Request production access**: Higher limits
- **Cost**: $0.10 per 1,000 emails

### First Steps
- [ ] Verify sender email
- [ ] Create IAM user
- [ ] Request production access
- [ ] Test email sending

---

## 5. PAYPAL (Payment Processing)

### Setup Steps
1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Sign up / Log in
3. Click **"Apps & Credentials"**
4. Select **"Sandbox"** (testing)
5. Create new **"App"**: Name = `about-me`
6. Go to **Accounts → Sandbox Accounts**
7. Create test business account

### Get Credentials
- **Client ID**: Sandbox → Credentials → Client ID
- **Secret**: Sandbox → Credentials → Secret
- **Webhook ID**: Set up later

### Environment Variables
```
PAYPAL_CLIENT_ID=AaBbCcDd...
PAYPAL_SECRET=EeFfGgHh...
PAYPAL_MODE=sandbox  # Change to 'live' for production
```

### Create Order Example
```typescript
import axios from 'axios';

async function createPayPalOrder(cosmeticId: string, price: number) {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v2/checkout/orders',
    {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: price.toString()
        },
        description: `Cosmetic: ${cosmeticId}`
      }],
      return_url: 'https://about-me.lol/shop/success',
      cancel_url: 'https://about-me.lol/shop/cancel'
    },
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.id; // approval_link in response
}
```

### Webhook Setup
1. Sandbox: Settings → Webhooks
2. URL: `https://railway-app.com/webhook/paypal`
3. Events: Order Approved, Order Completed
4. Save Webhook ID

### Pricing
- 2.2% + $0.30 per transaction
- or 1.49% for volume (~100,000 txns/month)

### First Steps
- [ ] Create sandbox app
- [ ] Get Client ID + Secret
- [ ] Test payment flow
- [ ] Set up webhook
- [ ] Request production access

---

## 6. CLOUDFLARE (WAF + DNS)

### Setup Steps
1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up / Log in
3. Add site: `about-me.lol`
4. Choose plan: **Free** ($0/month)
5. Change nameservers at domain registrar

### Get Nameservers
- Cloudflare provides 2 nameservers
- Update at your domain registrar
- Wait 24-48 hours for propagation

### WAF Rules
1. Go to **Security → WAF Rules**
2. Enable **"OWASP ModSecurity Core Rule Set"**
3. Create custom rule: Block username scraping bots
4. Rate limit: 5 login attempts per minute

### Custom Rule Example
```
(cf.bot_management.score < 30) and (http.request.uri.path eq "/api/check-username")
→ Block (403)
```

### Environment Variables
```
CLOUDFLARE_ZONE_ID=abc123def456...
CLOUDFLARE_API_TOKEN=your_token...
```

### First Steps
- [ ] Add domain to Cloudflare
- [ ] Update nameservers
- [ ] Wait for SSL certificate
- [ ] Enable WAF rules
- [ ] Test security

---

## 7. VERCEL (Frontend Hosting)

### Setup Steps
1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Connect GitHub account
4. Select frontend repo
5. Set **Framework Preset**: Static (or None)
6. Deploy

### Environment Variables
```
VITE_API_BASE_URL=https://about-me-api.railway.app
VITE_APP_URL=https://about-me.lol
```

### Add Domain
1. Settings → Domains
2. Add `about-me.lol`
3. Vercel provides nameservers OR CNAME
4. Update DNS at registrar
5. SSL issued automatically

### First Steps
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Add domain
- [ ] Test homepage

---

## 8. RAILWAY (Backend Hosting)

### Setup Steps
1. Go to [railway.app](https://railway.app)
2. Sign up / Log in with GitHub
3. Create new **"Project"**
4. Connect GitHub repo (backend)
5. Select Node.js environment
6. Deploy

### Environment Variables
Add all variables from `.env`:
- DATABASE_URL
- REDIS_URL
- BUNNY_API_KEY
- AWS_ACCESS_KEY_ID
- PAYPAL_CLIENT_ID
- JWT_SECRET
- etc.

### Generate Public URL
1. Project settings → Deployments
2. Get public URL: `https://about-me-api.railway.app`

### Railway Config (railway.toml)
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run start"
restartPolicyMaxRetries = 5
```

### Monitoring
- Logs: Real-time output
- Metrics: Memory, CPU
- Deployments: Version history

### First Steps
- [ ] Push backend to GitHub
- [ ] Create Railway project
- [ ] Add env variables
- [ ] Deploy
- [ ] Test health endpoint

---

## COMPLETE ENV TEMPLATE

```bash
# ===== SUPABASE =====
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# ===== REDIS =====
REDIS_URL=redis://default:password@host:39XXX

# ===== BUNNY.NET =====
BUNNY_API_KEY=YOUR_API_KEY
BUNNY_STORAGE_ZONE=aboutme-media
BUNNY_CDN_URL=https://aboutme-media.b-cdn.net

# ===== AWS SES =====
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@about-me.lol

# ===== PAYPAL =====
PAYPAL_CLIENT_ID=AaBbCcDd...
PAYPAL_SECRET=EeFfGgHh...
PAYPAL_MODE=sandbox

# ===== JWT =====
JWT_SECRET=your_super_secret_key_min_32_chars

# ===== APP URLS =====
VITE_API_BASE_URL=https://about-me-api.railway.app
VITE_APP_URL=https://about-me.lol

# ===== OPTIONAL =====
NODE_ENV=production
PORT=3000
```

---

## DEPLOYMENT ORDER

1. **Supabase** - Database (needed first)
2. **Upstash Redis** - Cache
3. **Bunny.net** - Media storage
4. **AWS SES** - Email
5. **PayPal** - Payments
6. **Railway** - Backend (all services ready)
7. **Vercel** - Frontend
8. **Cloudflare** - DNS + WAF

---

## COST ESTIMATION (Monthly)

| Service | Free Tier | Cost | Notes |
|---------|-----------|------|-------|
| Supabase | 500MB DB | $25 | Includes 1GB real |
| Upstash Redis | 10K commands | $0.20 | Per 100K cmds |
| Bunny.net | None | $0.01/GB | Zero egress ✓ |
| AWS SES | 62K emails/month | $0.10 per 1K | Very cheap |
| PayPal | None | 2.2% + $0.30 | Per transaction |
| Railway | $5/month free | $8+ | For 2-3 services |
| Vercel | Unlimited | Free | For static sites |
| Cloudflare | Unlimited | $20/month | Pro (WAF) |
| **TOTAL** | | **~$50-100** | Scales with users |
