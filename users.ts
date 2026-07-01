import './loadEnv.js';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import Redis from 'ioredis';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './db/schema.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import profileRoutes from './routes/profiles.js';
import analyticsRoutes from './routes/analytics.js';
import cosmeticsRoutes from './routes/cosmetics.js';
import paymentsRoutes from './routes/payments.js';
import mediaRoutes from './routes/media.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const app: Express = express();
const PORT = 3000;

// Global middleware
app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: false
}));
app.use(cors({
  origin: process.env.VITE_APP_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(requestLogger);

// Database connections
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });

// Parse and sanitize Redis URL with TLS support for Upstash or other secure endpoints
let redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisOptions: any = {
  maxRetriesPerRequest: 3,
};

if (redisUrl.includes('redis-cli')) {
  const match = redisUrl.match(/(rediss?:\/\/[^\s]+)/);
  if (match) {
    redisUrl = match[1];
  }
}

if (process.env.REDIS_URL?.includes('--tls') || redisUrl.startsWith('rediss://') || redisUrl.includes('upstash.io')) {
  if (redisUrl.startsWith('redis://')) {
    redisUrl = redisUrl.replace('redis://', 'rediss://');
  }
  redisOptions.tls = {
    rejectUnauthorized: false
  };
}

export const redis = new Redis(redisUrl, redisOptions);

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

redis.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
    cache: 'connected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cosmetics', cosmeticsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/media', mediaRoutes);
app.post('/webhook/paypal', paymentsRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// Serve specific page routes
app.get('/signup', (req: Request, res: Response) => {
  res.sendFile(path.join(rootDir, 'pages/signup.html'));
});

app.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.join(rootDir, 'pages/login.html'));
});

app.get('/pricing', (req: Request, res: Response) => {
  res.sendFile(path.join(rootDir, 'pages/pricing.html'));
});

app.get('/dashboard', (req: Request, res: Response) => {
  res.sendFile(path.join(rootDir, 'pages/dashboard/index.html'));
});

// Wildcard for public username profiles e.g. /@username
app.get('/@:username', (req: Request, res: Response) => {
  res.sendFile(path.join(rootDir, 'pages/profile-template.html'));
});

// Serve public static assets from the root directory
app.use(express.static(rootDir));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
