import { Pool } from 'pg';
import { createClient } from 'redis';

// PostgreSQL connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/transynk',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Redis connection
export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.log('Redis Client Error', err));

// Initialize connections
export async function initializeDatabase() {
  try {
    await redis.connect();
    console.log('✅ Connected to Redis');
    
    // Test PostgreSQL connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    client.release();
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

async function createTables() {
  const client = await pool.connect();
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        subscription_status VARCHAR(50) DEFAULT 'free',
        subscription_id VARCHAR(255),
        daily_conversions INTEGER DEFAULT 0,
        last_conversion_reset DATE DEFAULT CURRENT_DATE,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        stripe_subscription_id VARCHAR(255) UNIQUE,
        plan VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Conversion logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversion_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        session_id VARCHAR(255),
        input_format VARCHAR(50) NOT NULL,
        output_format VARCHAR(50) NOT NULL,
        file_size BIGINT,
        processing_time INTEGER,
        user_tier VARCHAR(20) NOT NULL,
        success BOOLEAN DEFAULT true,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Daily metrics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_metrics (
        date DATE PRIMARY KEY,
        total_conversions INTEGER DEFAULT 0,
        free_conversions INTEGER DEFAULT 0,
        premium_conversions INTEGER DEFAULT 0,
        new_users INTEGER DEFAULT 0,
        premium_upgrades INTEGER DEFAULT 0,
        revenue DECIMAL(10,2) DEFAULT 0,
        unique_visitors INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created/verified');
  } finally {
    client.release();
  }
}

// Initialize on import
initializeDatabase();