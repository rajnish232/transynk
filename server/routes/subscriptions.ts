import express from 'express';
import Stripe from 'stripe';
import { pool } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export const subscriptionRouter = express.Router();

// Get available plans
subscriptionRouter.get('/plans', (req, res) => {
  res.json({
    plans: [
      {
        id: 'monthly',
        name: 'Premium Monthly',
        price: 2.00,
        currency: 'usd',
        interval: 'month',
        features: [
          'Unlimited conversions',
          'Advanced formats (video to MP3)',
          'File compression',
          'No ads',
          'Priority support'
        ]
      },
      {
        id: 'lifetime',
        name: 'Premium Lifetime',
        price: 15.00,
        currency: 'usd',
        interval: 'one_time',
        features: [
          'Unlimited conversions',
          'Advanced formats (video to MP3)',
          'File compression',
          'No ads',
          'Priority support',
          'Lifetime access'
        ]
      }
    ]
  });
});

// Create checkout session
subscriptionRouter.post('/create-checkout', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user!.id;

    if (!planId || !['monthly', 'lifetime'].includes(planId)) {
      return res.status(400).json({
        error: { code: 'INVALID_PLAN', message: 'Invalid plan selected' }
      });
    }

    const isLifetime = planId === 'lifetime';
    const priceAmount = isLifetime ? 1500 : 200; // $15.00 or $2.00 in cents

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer_email: req.user!.email,
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isLifetime ? 'Transynk Premium Lifetime' : 'Transynk Premium Monthly',
              description: isLifetime 
                ? 'Lifetime access to all premium features'
                : 'Monthly subscription with unlimited conversions'
            },
            unit_amount: priceAmount,
            ...(isLifetime ? {} : { recurring: { interval: 'month' } })
          },
          quantity: 1,
        },
      ],
      mode: isLifetime ? 'payment' : 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing`,
      metadata: {
        userId,
        planId
      }
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({
      error: { code: 'CHECKOUT_ERROR', message: 'Failed to create checkout session' }
    });
  }
});

// Stripe webhook
subscriptionRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook signature verification failed');
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.error('Missing userId or planId in checkout session');
    return;
  }

  const isLifetime = planId === 'lifetime';
  const subscriptionStatus = isLifetime ? 'premium_lifetime' : 'premium_monthly';

  // Update user subscription status
  await pool.query(
    'UPDATE users SET subscription_status = $1, subscription_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
    [subscriptionStatus, session.subscription || session.id, userId]
  );

  // Create subscription record
  await pool.query(
    `INSERT INTO subscriptions (user_id, stripe_subscription_id, plan, status, current_period_start, current_period_end)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      userId,
      session.subscription || session.id,
      planId,
      'active',
      new Date(),
      isLifetime ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    ]
  );

  console.log(`✅ User ${userId} upgraded to ${subscriptionStatus}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const result = await pool.query(
    'SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1',
    [subscription.id]
  );

  if (result.rows.length === 0) {
    console.error('Subscription not found:', subscription.id);
    return;
  }

  const userId = result.rows[0].user_id;
  const status = subscription.status === 'active' ? 'premium_monthly' : 'free';

  // Update user and subscription
  await pool.query(
    'UPDATE users SET subscription_status = $1 WHERE id = $2',
    [status, userId]
  );

  await pool.query(
    'UPDATE subscriptions SET status = $1, current_period_end = $2 WHERE stripe_subscription_id = $3',
    [subscription.status, new Date(subscription.current_period_end * 1000), subscription.id]
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const result = await pool.query(
    'SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1',
    [subscription.id]
  );

  if (result.rows.length === 0) {
    console.error('Subscription not found:', subscription.id);
    return;
  }

  const userId = result.rows[0].user_id;

  // Revert user to free tier
  await pool.query(
    'UPDATE users SET subscription_status = $1, subscription_id = NULL WHERE id = $2',
    ['free', userId]
  );

  await pool.query(
    'UPDATE subscriptions SET status = $1 WHERE stripe_subscription_id = $2',
    ['canceled', subscription.id]
  );
}

// Get subscription status
subscriptionRouter.get('/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      `SELECT s.*, u.subscription_status 
       FROM subscriptions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        subscription: null,
        status: 'free'
      });
    }

    const subscription = result.rows[0];
    res.json({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      },
      status: subscription.subscription_status
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      error: { code: 'SUBSCRIPTION_ERROR', message: 'Failed to get subscription status' }
    });
  }
});