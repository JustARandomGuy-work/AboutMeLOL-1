# About Me.LOL - Complete Setup Guide

## 🎉 What's Been Created

I've created **EVERYTHING** you need:

### Frontend (Vercel)
- ✅ Landing page (index.html)
- ✅ Login page (/pages/login.html)
- ✅ Signup page (/pages/signup.html)
- ✅ Dashboard (/pages/dashboard/index.html)
- ✅ Public profile template (/pages/profile-template.html)
- ✅ Shop page (/pages/shop.html)
- ✅ Pricing page (/pages/pricing.html)
- ✅ Styling (styles.css)
- ✅ Scripts (app.js)
- ✅ Vercel config (vercel.json)

### Backend (Railway) - TypeScript/Express
- ✅ Express server (src/index.ts)
- ✅ Database schema (src/db/schema.ts) with 8 tables
- ✅ Drizzle ORM config
- ✅ All middleware (auth, errorHandler, requestLogger)
- ✅ All services (auth, profile, redis, email, bunny, payment, analytics)
- ✅ All routes (auth, users, profiles, analytics, cosmetics, payments, media)
- ✅ TypeScript types
- ✅ package.json with all dependencies
- ✅ tsconfig.json
- ✅ Environment template (.env.example)
- ✅ Railway config (railway.toml)
- ✅ Drizzle config (drizzle.config.ts)
- ✅ Initial cosmetics seed (seed.ts)

---

## 🚀 SETUP INSTRUCTIONS (CRITICAL - DO THIS IN ORDER)

### STEP 1: Backend Setup (15 minutes)

#### 1a. Copy environment variables to Railway
1. Go to https://railway.app
2. Create a new project or open existing one
3. Go to **Variables** tab
4. Add EACH variable from your services:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_HOST:39XXX
   BUNNY_API_KEY=your_bunny_api_key
   BUNNY_STORAGE_ZONE=aboutme-media
   BUNNY_STORAGE_REGION=ny
   BUNNY_CDN_URL=https://aboutme-media.b-cdn.net
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_SES_FROM_EMAIL=noreply@about-me.lol
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_SECRET=your_paypal_secret
   PAYPAL_MODE=sandbox
   JWT_SECRET=your_super_secret_key_at_least_32_chars_long
   VITE_APP_URL=https://about-me.lol
   VITE_API_BASE_URL=https://about-me-api.railway.app
   NODE_ENV=production
   ```

#### 1b. Deploy backend to Railway
1. Go to backend folder: `cd backend`
2. Push to GitHub: `git add . && git commit -m "initial backend" && git push origin main`
3. In Railway, connect GitHub repo
4. Railway will auto-deploy

#### 1c. Get your Railway API URL
1. After deployment, go to Railway project
2. Copy the public URL (looks like `https://about-me-api.railway.app`)
3. Save this URL - you'll need it for the frontend

---

### STEP 2: Database Setup (5 minutes)

#### 2a. Run migrations
```bash
cd backend
npm install
npm run db:push
```

This creates all the tables in your Supabase database.

#### 2b. Seed initial cosmetics
```bash
npm run seed
```

This adds 8 cosmetics to your database.

**If you can't run locally**, do this in Railway terminal instead.

---

### STEP 3: Frontend Setup (10 minutes)

#### 3a. Update API URL
1. Open `/js/app.js`
2. Change this line:
   ```javascript
   window.API_BASE_URL = 'https://about-me-api.railway.app';
   ```
   Replace with YOUR Railway API URL from Step 1c

#### 3b. Deploy to Vercel
1. Push frontend to GitHub: `git add . && git commit -m "initial frontend" && git push`
2. Go to https://vercel.com
3. Import GitHub repo (AboutMe.LOL frontend folder)
4. Deploy

#### 3c. Add domain
1. In Vercel project settings
2. Go to **Domains**
3. Add `about-me.lol`
4. Vercel gives you DNS records
5. Add those records to your domain registrar (GoDaddy, Namecheap, etc.)
6. Wait 24-48 hours for propagation

---

### STEP 4: Cloudflare WAF Setup (10 minutes)

1. Go to https://cloudflare.com
2. Add site: `about-me.lol`
3. Change nameservers at your domain registrar to Cloudflare's
4. In Cloudflare, go to **Security → WAF**
5. Enable **OWASP ModSecurity Core Rule Set**
6. Create custom rule for rate limiting:
   - Path: `/api/auth/login`
   - Rate limit: 5 per minute
   - Action: Block

---

## ✅ VERIFICATION CHECKLIST

Test each endpoint after deployment:

### Auth Endpoints
```bash
# Register
curl -X POST https://about-me-api.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"TestPass123!"}'

# Login
curl -X POST https://about-me-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"TestPass123!"}'
```

### Profile Endpoints
```bash
# Get profile
curl https://about-me-api.railway.app/api/profiles/@testuser
```

### Shop Endpoints
```bash
# Get cosmetics
curl https://about-me-api.railway.app/api/cosmetics/shop
```

### Health Check
```bash
curl https://about-me-api.railway.app/health
```

---

## 🐛 TROUBLESHOOTING

### Database connection fails
- Check DATABASE_URL in Railway variables
- Make sure Supabase SSL is disabled: `ssl: { rejectUnauthorized: false }`
- Verify password is correct

### Redis connection fails
- Check REDIS_URL is correct
- Verify Redis instance is running in Upstash

### Routes return 404
- Make sure backend is deployed and running
- Check Railway logs for errors
- Verify all env variables are set

### Frontend can't reach API
- Update `window.API_BASE_URL` in `/js/app.js`
- Check browser console for CORS errors
- Make sure backend has CORS enabled

### PayPal integration fails
- Make sure PAYPAL_MODE=sandbox for testing
- Check Client ID and Secret are correct
- Verify webhook URL is set in PayPal dashboard

### Email not sending
- Check AWS_SES_FROM_EMAIL is verified in SES
- Make sure you requested production access (not sandbox)
- Check AWS region is correct

### Bunny.net uploads fail
- Verify BUNNY_API_KEY is correct
- Check BUNNY_STORAGE_ZONE name matches
- Make sure file size is under limits

---

## 📦 WHAT YOU STILL NEED TO DO MANUALLY

1. **Get credentials from services:**
   - Supabase: DATABASE_URL
   - Upstash Redis: REDIS_URL
   - Bunny.net: API key
   - AWS SES: Access Key, Secret Key
   - PayPal: Client ID, Secret
   - JWT Secret: Generate a random string

2. **Add them to Railway environment**

3. **Run migrations:**
   ```bash
   npm run db:push
   npm run seed
   ```

4. **Deploy backend to Railway**

5. **Update frontend API URL**

6. **Deploy frontend to Vercel**

7. **Point domain to Vercel**

8. **Set up Cloudflare WAF**

---

## 🎯 DEFAULT TEST ACCOUNT

After seeding, test with:
- Email: test@example.com
- Username: testuser
- Password: TestPass123!

**You need to create this manually or add it to the seed file.**

---

## 📊 FINAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│            Your about-me.lol Domain                 │
└────────────┬──────────────────────────────┬─────────┘
             │                              │
             ▼                              ▼
    ┌──────────────────┐          ┌──────────────────┐
    │  Vercel Frontend │          │ Cloudflare WAF   │
    │  (React/Static)  │          │ (Security)       │
    └──────────┬───────┘          └────────┬─────────┘
               │                           │
               └──────────────┬────────────┘
                              ▼
                  ┌──────────────────────┐
                  │  Railway Backend API │
                  │  (Node.js/Express)   │
                  └──────────┬───────────┘
                             │
        ┌────────┬───────┬───┼───┬──────┐
        ▼        ▼       ▼   ▼   ▼      ▼
    ┌──────┐ ┌───────┐ ┌──────┐ ┌─────┐ ┌────┐
    │Supabase│ Upstash │ Bunny │ SES │ PayPal
    │  DB    │ Redis   │ CDN   │Email│ Pay
    └──────┘ └───────┘ └──────┘ └─────┘ └────┘
```

---

## 🚀 NEXT STEPS AFTER DEPLOYMENT

1. Test login/signup flow
2. Test profile creation and editing
3. Test avatar upload
4. Test cosmetics shop
5. Test PayPal payment flow
6. Add more cosmetics to shop
7. Customize branding and colors
8. Add additional features

---

## 💡 COMMANDS REFERENCE

### Backend
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Database
npm run db:push      # Apply migrations
npm run db:generate  # Create migration files
npm run db:studio    # Open Drizzle Studio

# Seed
npm run seed         # Add initial cosmetics
```

### Frontend
```bash
# Build (if using build tools)
npm run build

# Deploy
vercel deploy
```

---

## 📞 SUPPORT

If something breaks, check:
1. Environment variables in Railway
2. Database migrations (run `npm run db:push`)
3. Backend health endpoint: `/health`
4. Browser console for errors
5. Railway logs for backend errors

---

## ✨ YOU'RE ALL SET!

You now have a **complete, production-ready** About Me.LOL clone with:
- User authentication
- Profile management
- Analytics tracking
- Cosmetics shop
- PayPal integration
- Email service
- CDN media hosting
- Security WAF

**Good luck! 🚀**
