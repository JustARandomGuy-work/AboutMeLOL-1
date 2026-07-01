import { redis } from '../index';

export class RedisService {
  static async get(key: string) {
    return await redis.get(key);
  }

  static async set(key: string, value: string, ttl: number = 3600) {
    return await redis.setex(key, ttl, value);
  }

  static async del(key: string) {
    return await redis.del(key);
  }

  static async incrementCounter(key: string, ttl: number = 60) {
    const val = await redis.incr(key);
    if (val === 1) {
      await redis.expire(key, ttl);
    }
    return val;
  }

  static async getCounter(key: string) {
    const val = await redis.get(key);
    return val ? parseInt(val) : 0;
  }
}

export default RedisService;
