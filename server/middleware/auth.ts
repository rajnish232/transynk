import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    subscriptionStatus: string;
    isAdmin: boolean;
  };
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { code: 'NO_TOKEN', message: 'Access token required' } });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, subscription_status, is_admin FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    }

    const user = result.rows[0];
    req.user = {
      id: user.id,
      email: user.email,
      subscriptionStatus: user.subscription_status,
      isAdmin: user.is_admin
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: { code: 'AUTH_ERROR', message: 'Authentication failed' } });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: { code: 'ADMIN_REQUIRED', message: 'Admin access required' } });
  }
  next();
}