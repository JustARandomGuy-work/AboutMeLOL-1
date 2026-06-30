<<<<<<< HEAD
import { db, redis } from '../index.js';
import { analytics, profiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class AnalyticsService {
  static async trackVisit(profileId: string, visitorIp?: string) {
    const today = new Date().toISOString().split('T')[0];

    const existingRecord = await db.query.analytics.findFirst({
      where: eq(analytics.profileId, profileId)
    });

    if (existingRecord) {
      await db.update(analytics)
        .set({ visitCount: existingRecord.visitCount + 1 })
        .where(eq(analytics.id, existingRecord.id));
    } else {
      await db.insert(analytics).values({
        profileId,
        visitDate: new Date(today),
        visitCount: 1,
        visitorIp
      });
    }

    // Cache invalidation
    await redis.del(`analytics:${profileId}`);
  }

  static async trackClick(profileId: string) {
    const today = new Date().toISOString().split('T')[0];

    const existingRecord = await db.query.analytics.findFirst({
      where: eq(analytics.profileId, profileId)
    });

    if (existingRecord) {
      await db.update(analytics)
        .set({ clickCount: existingRecord.clickCount + 1 })
        .where(eq(analytics.id, existingRecord.id));
    }

    await redis.del(`analytics:${profileId}`);
  }

  static async getAnalytics(profileId: string) {
    const cacheKey = `analytics:${profileId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const records = await db.query.analytics.findMany({
      where: eq(analytics.profileId, profileId)
    });

    const totalVisits = records.reduce((sum, r) => sum + r.visitCount, 0);
    const totalClicks = records.reduce((sum, r) => sum + r.clickCount, 0);

    const result = {
      profileId,
      totalVisits,
      totalClicks,
      records
    };

    await redis.setex(cacheKey, 300, JSON.stringify(result));

    return result;
  }
}

export default AnalyticsService;
=======
import { db, redis } from '../index.js';
import { analytics, profiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class AnalyticsService {
  static async trackVisit(profileId: string, visitorIp?: string) {
    const today = new Date().toISOString().split('T')[0];

    const existingRecord = await db.query.analytics.findFirst({
      where: eq(analytics.profileId, profileId)
    });

    if (existingRecord) {
      await db.update(analytics)
        .set({ visitCount: existingRecord.visitCount + 1 })
        .where(eq(analytics.id, existingRecord.id));
    } else {
      await db.insert(analytics).values({
        profileId,
        visitDate: new Date(today),
        visitCount: 1,
        visitorIp
      });
    }

    // Cache invalidation
    await redis.del(`analytics:${profileId}`);
  }

  static async trackClick(profileId: string) {
    const today = new Date().toISOString().split('T')[0];

    const existingRecord = await db.query.analytics.findFirst({
      where: eq(analytics.profileId, profileId)
    });

    if (existingRecord) {
      await db.update(analytics)
        .set({ clickCount: existingRecord.clickCount + 1 })
        .where(eq(analytics.id, existingRecord.id));
    }

    await redis.del(`analytics:${profileId}`);
  }

  static async getAnalytics(profileId: string) {
    const cacheKey = `analytics:${profileId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const records = await db.query.analytics.findMany({
      where: eq(analytics.profileId, profileId)
    });

    const totalVisits = records.reduce((sum, r) => sum + r.visitCount, 0);
    const totalClicks = records.reduce((sum, r) => sum + r.clickCount, 0);

    const result = {
      profileId,
      totalVisits,
      totalClicks,
      records
    };

    await redis.setex(cacheKey, 300, JSON.stringify(result));

    return result;
  }
}

export default AnalyticsService;
>>>>>>> aee9477181ceb519ab7930d588f6fed3b340e70c
