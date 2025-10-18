import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

export const userRouter = express.Router();

// Get user profile
userRouter.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, subscription_status, daily_conversions, 
       last_conversion_reset, created_at FROM users WHERE id = $1`,
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        subscriptionStatus: user.subscription_status,
        dailyConversions: user.daily_conversions,
        lastConversionReset: user.last_conversion_reset,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: { code: 'PROFILE_ERROR', message: 'Failed to get profile' }
    });
  }
});

// Get user usage stats
userRouter.get('/usage', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const today = new Date().toISOString().split('T')[0];

    // Get user's current quota
    const userResult = await pool.query(
      'SELECT daily_conversions, last_conversion_reset, subscription_status FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const user = userResult.rows[0];
    const lastReset = user.last_conversion_reset?.toISOString().split('T')[0];
    
    // Reset quota if it's a new day
    let dailyConversions = user.daily_conversions;
    if (lastReset !== today) {
      await pool.query(
        'UPDATE users SET daily_conversions = 0, last_conversion_reset = CURRENT_DATE WHERE id = $1',
        [userId]
      );
      dailyConversions = 0;
    }

    const maxConversions = user.subscription_status === 'free' ? 3 : -1; // -1 means unlimited
    const remainingConversions = maxConversions === -1 ? -1 : Math.max(0, maxConversions - dailyConversions);

    res.json({
      usage: {
        dailyConversions,
        remainingConversions,
        maxConversions,
        subscriptionStatus: user.subscription_status,
        resetDate: today
      }
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({
      error: { code: 'USAGE_ERROR', message: 'Failed to get usage stats' }
    });
  }
});

// Update user profile
userRouter.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { email } = req.body;
    const userId = req.user!.id;

    if (!email) {
      return res.status(400).json({
        error: { code: 'MISSING_EMAIL', message: 'Email is required' }
      });
    }

    // Check if email is already taken by another user
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: { code: 'EMAIL_TAKEN', message: 'Email is already taken' }
      });
    }

    // Update user
    const result = await pool.query(
      'UPDATE users SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING email',
      [email, userId]
    );

    res.json({
      user: {
        email: result.rows[0].email
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: { code: 'UPDATE_ERROR', message: 'Failed to update profile' }
    });
  }
});

// Delete user account
userRouter.delete('/account', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Delete user (cascades to related records)
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: { code: 'DELETE_ERROR', message: 'Failed to delete account' }
    });
  }
});