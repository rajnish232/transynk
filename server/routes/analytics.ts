import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

export const analyticsRouter = express.Router();

// Log conversion (public endpoint for tracking)
analyticsRouter.post('/conversion', async (req, res) => {
  try {
    const { 
      userId, 
      sessionId, 
      inputFormat, 
      outputFormat, 
      fileSize, 
      processingTime, 
      success = true 
    } = req.body;

    if (!inputFormat || !outputFormat) {
      return res.status(400).json({
        error: { code: 'MISSING_FORMATS', message: 'Input and output formats are required' }
      });
    }

    // Determine user tier
    let userTier = 'free';
    if (userId) {
      const userResult = await pool.query(
        'SELECT subscription_status FROM users WHERE id = $1',
        [userId]
      );
      if (userResult.rows.length > 0) {
        userTier = userResult.rows[0].subscription_status.includes('premium') ? 'premium' : 'free';
      }
    }

    // Log the conversion
    await pool.query(
      `INSERT INTO conversion_logs 
       (user_id, session_id, input_format, output_format, file_size, processing_time, user_tier, success)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, sessionId, inputFormat, outputFormat, fileSize, processingTime, userTier, success]
    );

    // Update daily metrics
    const today = new Date().toISOString().split('T')[0];
    await pool.query(
      `INSERT INTO daily_metrics (date, total_conversions, free_conversions, premium_conversions)
       VALUES ($1, 1, $2, $3)
       ON CONFLICT (date) DO UPDATE SET
       total_conversions = daily_metrics.total_conversions + 1,
       free_conversions = daily_metrics.free_conversions + $2,
       premium_conversions = daily_metrics.premium_conversions + $3`,
      [today, userTier === 'free' ? 1 : 0, userTier === 'premium' ? 1 : 0]
    );

    // If user is logged in, increment their daily conversion count
    if (userId && userTier === 'free') {
      await pool.query(
        'UPDATE users SET daily_conversions = daily_conversions + 1 WHERE id = $1',
        [userId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Log conversion error:', error);
    res.status(500).json({
      error: { code: 'LOGGING_ERROR', message: 'Failed to log conversion' }
    });
  }
});

// Log user action (for general analytics)
analyticsRouter.post('/user-action', async (req, res) => {
  try {
    const { action, userId, sessionId, metadata } = req.body;

    if (!action) {
      return res.status(400).json({
        error: { code: 'MISSING_ACTION', message: 'Action is required' }
      });
    }

    // For now, just log to console. In production, you might want to store these
    // in a separate analytics table or send to a service like Google Analytics
    console.log('User action:', { action, userId, sessionId, metadata, timestamp: new Date() });

    res.json({ success: true });
  } catch (error) {
    console.error('Log user action error:', error);
    res.status(500).json({
      error: { code: 'LOGGING_ERROR', message: 'Failed to log user action' }
    });
  }
});

// Get dashboard metrics (admin only)
analyticsRouter.get('/dashboard', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { days = 30 } = req.query;
    const daysNum = parseInt(days as string) || 30;

    // Get daily metrics for the specified period
    const metricsResult = await pool.query(
      `SELECT * FROM daily_metrics 
       WHERE date >= CURRENT_DATE - INTERVAL '${daysNum} days'
       ORDER BY date DESC`,
    );

    // Get total users by subscription status
    const usersResult = await pool.query(
      `SELECT subscription_status, COUNT(*) as count
       FROM users 
       GROUP BY subscription_status`
    );

    // Get recent conversions
    const conversionsResult = await pool.query(
      `SELECT input_format, output_format, user_tier, timestamp
       FROM conversion_logs 
       WHERE timestamp >= NOW() - INTERVAL '7 days'
       ORDER BY timestamp DESC
       LIMIT 100`
    );

    // Calculate totals
    const totals = metricsResult.rows.reduce((acc, row) => ({
      totalConversions: acc.totalConversions + (row.total_conversions || 0),
      freeConversions: acc.freeConversions + (row.free_conversions || 0),
      premiumConversions: acc.premiumConversions + (row.premium_conversions || 0),
      newUsers: acc.newUsers + (row.new_users || 0),
      premiumUpgrades: acc.premiumUpgrades + (row.premium_upgrades || 0),
      revenue: acc.revenue + parseFloat(row.revenue || 0)
    }), {
      totalConversions: 0,
      freeConversions: 0,
      premiumConversions: 0,
      newUsers: 0,
      premiumUpgrades: 0,
      revenue: 0
    });

    res.json({
      metrics: {
        dailyMetrics: metricsResult.rows,
        usersByTier: usersResult.rows,
        recentConversions: conversionsResult.rows,
        totals,
        period: daysNum
      }
    });
  } catch (error) {
    console.error('Get dashboard metrics error:', error);
    res.status(500).json({
      error: { code: 'METRICS_ERROR', message: 'Failed to get dashboard metrics' }
    });
  }
});

// Get specific metrics (admin only)
analyticsRouter.get('/metrics', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { metric, period = '30' } = req.query;
    const days = parseInt(period as string) || 30;

    let query = '';
    let params: any[] = [];

    switch (metric) {
      case 'conversions':
        query = `
          SELECT DATE(timestamp) as date, COUNT(*) as count, user_tier
          FROM conversion_logs 
          WHERE timestamp >= NOW() - INTERVAL '${days} days'
          GROUP BY DATE(timestamp), user_tier
          ORDER BY date DESC
        `;
        break;
      case 'users':
        query = `
          SELECT DATE(created_at) as date, COUNT(*) as count, subscription_status
          FROM users 
          WHERE created_at >= NOW() - INTERVAL '${days} days'
          GROUP BY DATE(created_at), subscription_status
          ORDER BY date DESC
        `;
        break;
      case 'revenue':
        query = `
          SELECT date, revenue
          FROM daily_metrics 
          WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
          ORDER BY date DESC
        `;
        break;
      default:
        return res.status(400).json({
          error: { code: 'INVALID_METRIC', message: 'Invalid metric requested' }
        });
    }

    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({
      error: { code: 'METRICS_ERROR', message: 'Failed to get metrics' }
    });
  }
});