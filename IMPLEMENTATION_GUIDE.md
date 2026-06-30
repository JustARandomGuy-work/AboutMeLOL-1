# About Me.LOL - Full Implementation Guide

## Project Overview
Replicate guns.lol with profile landing pages, analytics, cosmetics shop, and premium features.
- **Frontend**: Vercel (static + dynamic)
- **Backend**: Railway (Node.js/Express)
- **Database**: Supabase (PostgreSQL)
- **Cache**: Upstash Redis
- **Media**: Bunny.net (zero egress)
- **Email**: Amazon SES
- **Payments**: PayPal
- **Security**: Cloudflare WAF

---

## PHASE 1: FRONTEND STRUCTURE (Vercel)

### 1.1 Current Landing Page ✓
- `index.html` - Hero landing (already exists)
- `styles.css` - Base styling (already exists)
- `app.js` - Scroll logic (already exists)

### 1.2 Pages to Create
```
frontend/
├── public/
│   ├── index.html (landing - exists)
│   ├── favicon.ico (exists)
│   └── fonts/
├── pages/
│   ├── login.html
│   ├── signup.html
│   ├── dashboard/
│   │   ├── index.html (profile editor)
│   │   ├── analytics.html
│   │   └── settings.html
│   ├── [username]/
│   │   └── index.html (public profile view)
│   ├── pricing.html
│   └── cosmetics-shop.html
├── styles/
│   ├── base.css (extends styles.css)
│   ├── dashboard.css
│   ├── profile.css
│   ├── shop.css
│   └── animations.css
├── js/
│   ├── app.js (exists)
│   ├── auth-manager.js (handle login/signup)
│   ├── api-client.js (talk to Railway backend)
│   ├── profile-editor.js (dashboard)
│   ├── analytics-renderer.js
│   └── cosmetics-cart.js (PayPal integration)
├── assets/
│   └── photos/ (exists)
└── vercel.json (Vercel config)
```

### 1.3 Key Frontend Features
- **Authentication UI**: Login/Signup forms
- **Profile Builder**: Drag-drop link editor, color picker, avatar upload
- **Analytics View**: Chart showing visits, clicks
- **Public Profile**: @username pages
- **Shop**: Cosmetics gallery (glowing text, badges, animations)
- **Responsive**: Mobile-first design

---

## PHASE 2: BACKEND STRUCTURE (Railway)

### 2.1 Project Setup
```
backend/
├── src/
│   ├── index.ts (main server)
│   ├── middleware/
│   │   ├── auth.ts (JWT verification)
│   │   ├── rate-limit.ts
│   │   └── error-handler.ts
│   ├── routes/
│   │   ├── auth.ts (POST /register, /login, /refresh)
│   │   ├── users.ts (GET/PUT /users/:id, GET /@username)
│   │   ├── profiles.ts (GET/PUT /profiles/:id)
│   │   ├── analytics.ts (GET /analytics/:userId)
│   │   ├── cosmetics.ts (GET /shop, POST /cosmetics/apply)
│   │   ├── payments.ts (POST /webhook/paypal)
│   │   └── media.ts (GET/POST media, Bunny.net integration)
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── profileController.ts
│   │   ├── analyticsController.ts
│   │   └── paymentController.ts
│   ├── services/
│   │   ├── userService.ts (business logic)
│   │   ├── redisService.ts (Upstash integration)
│   │   ├── emailService.ts (SES integration)
│   │   ├── paymentService.ts (PayPal webhook handler)
│   │   └── bunnyService.ts (Media upload/CDN)
│   ├── db/
│   │   ├── schema.ts (Drizzle schema)
│   │   ├── migrations/ (Drizzle migrations)
│   │   └── client.ts (Supabase connection)
│   └── types/
│       └── index.ts (TypeScript interfaces)
├── .env.example
├── package.json
├── tsconfig.json
├── railway.toml (Railway config)
└── Dockerfile
```

### 2.2 API Endpoints

#### Authentication
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

#### Users
```
GET /users/:id
PUT /users/:id
GET /@username (public profile)
```

#### Profiles
```
GET /profiles/:userId
PUT /profiles/:userId
POST /profiles/:userId/links
DELETE /profiles/:userId/links/:linkId
```

#### Analytics
```
GET /analytics/:userId
POST /analytics/:userId/track (log page visit)
```

#### Cosmetics Shop
```
GET /shop
POST /shop/:cosmeticId/apply
GET /cosmetics/user/:userId
```

#### Payments
```
POST /webhook/paypal
GET /transactions/:userId
```

#### Media (Bunny.net)
```
POST /media/upload (avatar, background)
DELETE /media/:mediaId
```

---

## PHASE 3: DATABASE SCHEMA (Supabase)

### 3.1 Tables (using Drizzle ORM)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT false
);

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url TEXT, -- Bunny.net URL
  background_url TEXT, -- Bunny.net URL
  theme_color VARCHAR(7) DEFAULT '#b670ff',
  badge_text_glow BOOLEAN DEFAULT false,
  badge_animation BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Links table (user's profile links)
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(100),
  url TEXT NOT NULL,
  icon_type VARCHAR(20), -- 'twitter', 'instagram', 'youtube', etc
  position INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cosmetics table (shop items)
CREATE TABLE cosmetics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50), -- 'badge', 'animation', 'glow', 'background'
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  preview_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User cosmetics table (what user owns)
CREATE TABLE user_cosmetics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cosmetic_id UUID REFERENCES cosmetics(id),
  purchased_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, cosmetic_id)
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  visit_date DATE,
  visit_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  visitor_ip VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table (PayPal purchases)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  paypal_transaction_id VARCHAR(255) UNIQUE,
  cosmetic_id UUID REFERENCES cosmetics(id),
  amount DECIMAL(10, 2),
  status VARCHAR(20), -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## PHASE 4: EXTERNAL SERVICES SETUP

### 4.1 Supabase (PostgreSQL)
1. Create project at supabase.com
2. Get connection string
3. Add to Railway env: `DATABASE_URL`
4. Run Drizzle migrations

### 4.2 Upstash Redis
1. Create Redis instance at upstash.com
2. Get Redis URL
3. Add to Railway env: `REDIS_URL`
4. Use for: profile cache, session storage, rate limiting

### 4.3 Bunny.net (Media CDN)
1. Create account at bunny.net
2. Create storage zone (e.g., "aboutme-media")
3. Get API key and storage zone name
4. Railway env: `BUNNY_API_KEY`, `BUNNY_STORAGE_ZONE`
5. Generates URLs like: `https://aboutme-media.b-cdn.net/avatar/user123.jpg`

### 4.4 Amazon SES (Email)
1. Request production access (starts in sandbox)
2. Verify email addresses
3. Get credentials: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
4. Use for: verification emails, password resets, payment confirmations

### 4.5 PayPal (Payments)
1. Create business account at paypal.com
2. Get Client ID and Secret
3. Add to Railway env: `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`
4. Set webhook URL: `https://railway-app.com/webhook/paypal`

### 4.6 Cloudflare WAF
1. Point about-me.lol DNS to Cloudflare nameservers
2. Set up WAF rules:
   - Block common scraping bots
   - Rate limit login attempts (5 per minute)
   - Geo-restriction (optional)

---

## PHASE 5: ENVIRONMENT VARIABLES

### Railway `.env` Template
```
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# Redis
REDIS_URL=redis://username:password@host:port

# Bunny.net
BUNNY_API_KEY=your_bunny_api_key
BUNNY_STORAGE_ZONE=aboutme-media
BUNNY_STORAGE_REGION=ny

# AWS SES
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret
PAYPAL_WEBHOOK_ID=your_webhook_id

# JWT
JWT_SECRET=your_super_secret_key

# Vercel Frontend
VITE_API_BASE_URL=https://about-me-api.railway.app
VITE_APP_URL=https://about-me.lol
```

---

## PHASE 6: DEPLOYMENT CHECKLIST

### Step 1: Vercel Frontend
- [ ] Git push frontend to GitHub
- [ ] Connect repo to Vercel
- [ ] Add domain: about-me.lol
- [ ] Point DNS records to Vercel
- [ ] SSL auto-issued

### Step 2: Railway Backend
- [ ] Git push backend to GitHub
- [ ] Create Railway project
- [ ] Connect GitHub repo
- [ ] Add all env variables
- [ ] Set port: 3000
- [ ] Enable Public Networking
- [ ] Get Railway domain: `https://about-me-api.railway.app`

### Step 3: Supabase Database
- [ ] Create project
- [ ] Import schema via migrations
- [ ] Set `DATABASE_URL` in Railway

### Step 4: Security (Cloudflare)
- [ ] Register about-me.lol domain
- [ ] Add to Cloudflare
- [ ] Set nameservers
- [ ] Enable WAF rules

### Step 5: Upstash Redis
- [ ] Create instance
- [ ] Add `REDIS_URL` to Railway

### Step 6: Bunny.net Media
- [ ] Create storage zone
- [ ] Add credentials to Railway

### Step 7: AWS SES & PayPal
- [ ] Verify SES email
- [ ] Set PayPal webhook
- [ ] Add to Railway env

---

## PHASE 7: FEATURE ROLLOUT

### MVP (Week 1-2)
- [ ] Landing page
- [ ] User registration/login
- [ ] Basic profile page
- [ ] Link management (add/edit/delete)
- [ ] Public @username pages

### Phase 2 (Week 3-4)
- [ ] Analytics dashboard
- [ ] Avatar upload to Bunny.net
- [ ] Basic cosmetics shop
- [ ] PayPal purchase flow

### Phase 3 (Week 5+)
- [ ] Advanced animations
- [ ] Custom backgrounds
- [ ] Email verification via SES
- [ ] Password reset flow
- [ ] Admin dashboard
- [ ] Leaderboard

---

## KEY CODE EXAMPLES

### Backend Setup (Express + TypeScript)
```typescript
// src/index.ts
import express from 'express';
import { Pool } from 'pg';
import { Redis } from 'upstash-redis';

const app = express();
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = new Redis({ url: process.env.REDIS_URL });

app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/profiles', require('./routes/profiles'));

app.listen(3000, () => console.log('Server running on :3000'));
```

### Drizzle Schema
```typescript
// src/db/schema.ts
import { pgTable, text, uuid, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

## NEXT STEPS
1. **Complete landing page** (you have a good start!)
2. **Set up Railway backend** - Create Node.js Express project
3. **Create Supabase project** - PostgreSQL database
4. **Build auth system** - registration, login, JWT
5. **Implement profile pages** - public @username routes
6. **Connect frontend to API** - axios/fetch calls
7. **Add Bunny.net integration** - media uploads
8. **Deploy to Vercel + Railway**
9. **Set up Cloudflare WAF** - security hardening

---

## TROUBLESHOOTING
- **Slow profile loads?** → Cache in Upstash Redis
- **Email not sending?** → Check SES sandbox/production status
- **Media uploads failing?** → Verify Bunny.net API key
- **PayPal webhooks not firing?** → Check webhook URL in PayPal dashboard
- **Database migrations?** → Use Drizzle CLI: `drizzle-kit push:pg`
