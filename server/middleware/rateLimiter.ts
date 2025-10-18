import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/database.js';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const key = `rate_limit:${clientIp}`;

  try {
    const current = await redis.get(key);
    const requests = current ? parseInt(current) : 0;

    if (requests >= RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later',
          retryable: true
        }
      });
    }

    await redis.setex(key, Math.ceil(RATE_LIMIT_WINDOW / 1000), requests + 1);
    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    // Continue without rate limiting if Redis fails
    next();
  }
}