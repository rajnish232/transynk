import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth.js';

export const authRouter = express.Router();

// Register
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Email and password are required' }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters' }
      });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: { code: 'USER_EXISTS', message: 'User with this email already exists' }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, subscription_status',
      [email, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        subscriptionStatus: user.subscription_status
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: { code: 'REGISTRATION_FAILED', message: 'Failed to create account' }
    });
  }
});

// Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Email and password are required' }
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, subscription_status, is_admin FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        subscriptionStatus: user.subscription_status,
        isAdmin: user.is_admin
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: { code: 'LOGIN_FAILED', message: 'Login failed' }
    });
  }
});

// Get current user
authRouter.get('/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Logout (client-side token removal)
authRouter.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});