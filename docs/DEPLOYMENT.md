# Deployment Guide

This guide provides step-by-step instructions for deploying Transynk to production.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Stripe account
- Domain name
- SSL certificate

## Environment Setup

### 1. Production Environment Variables

Create a `.env.production` file:

```env
# Database
DATABASE_URL=postgresql://username:password@your-db-host:5432/transynk
REDIS_URL=redis://your-redis-host:6379

# JWT (Generate a strong secret)
JWT_SECRET=your-super-secure-jwt-secret-256-bits-long

# Stripe (Use live keys)
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret

# URLs
FRONTEND_URL=https://your-domain.com
API_URL=https://api.your-domain.com

# Environment
NODE_ENV=production
PORT=3001
```

### 2. Database Setup

```sql
-- Create production database
CREATE DATABASE transynk;
CREATE USER transynk_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE transynk TO transynk_user;
```

## Frontend Deployment (Vercel)

### Option 1: GitHub Integration

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the project root

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   VITE_API_URL=https://api.your-domain.com
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
   ```

4. **Custom Domain**
   - Add your custom domain in Vercel dashboard
   - Configure DNS records as instructed

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel --prod

# Set environment variables
vercel env add VITE_API_URL production
vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
```

## Backend Deployment (Railway)

### 1. Setup Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Link to existing project or create new
railway link
```

### 2. Add Services

```bash
# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis

# Deploy the application
railway up
```

### 3. Configure Environment Variables

In Railway dashboard or via CLI:

```bash
railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}
railway variables set REDIS_URL=${{Redis.REDIS_URL}}
railway variables set JWT_SECRET=your-jwt-secret
railway variables set STRIPE_SECRET_KEY=sk_live_your_key
railway variables set STRIPE_WEBHOOK_SECRET=whsec_your_secret
railway variables set FRONTEND_URL=https://your-domain.com
railway variables set NODE_ENV=production
```

### 4. Custom Domain

```bash
# Add custom domain
railway domain add api.your-domain.com
```

## Alternative: Heroku Deployment

### 1. Create Heroku App

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Add add-ons
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini
```

### 2. Configure Environment

```bash
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_your_secret
heroku config:set FRONTEND_URL=https://your-domain.com
heroku config:set NODE_ENV=production
```

### 3. Deploy

```bash
git push heroku main
```

## Docker Deployment

### 1. Build Images

```bash
# Build frontend
docker build -f Dockerfile.frontend -t transynk-frontend .

# Build backend
docker build -f Dockerfile.backend -t transynk-backend .
```

### 2. Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    image: transynk-frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.your-domain.com

  backend:
    image: transynk-backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/transynk
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=transynk
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Deploy

```bash
docker-compose up -d
```

## SSL Certificate Setup

### Using Cloudflare (Recommended)

1. **Add Domain to Cloudflare**
   - Add your domain to Cloudflare
   - Update nameservers at your registrar

2. **Configure SSL**
   - Set SSL mode to "Full (strict)"
   - Enable "Always Use HTTPS"
   - Enable "HTTP Strict Transport Security (HSTS)"

3. **Configure DNS**
   ```
   A    @           your-frontend-ip
   A    api         your-backend-ip
   CNAME www        your-domain.com
   ```

### Using Let's Encrypt

```bash
# Install certbot
sudo apt install certbot

# Generate certificates
sudo certbot certonly --standalone -d your-domain.com -d api.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Stripe Webhook Configuration

### 1. Create Webhook Endpoint

In Stripe Dashboard:
- Go to Developers > Webhooks
- Add endpoint: `https://api.your-domain.com/api/subscriptions/webhook`
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### 2. Configure Webhook Secret

Copy the webhook signing secret and add to environment variables:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Monitoring Setup

### 1. Application Monitoring

```bash
# Install PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start server/index.js --name transynk-api
pm2 startup
pm2 save
```

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/node @sentry/svelte
```

Add to `server/index.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 3. Uptime Monitoring

Set up monitoring with:
- UptimeRobot
- Pingdom
- StatusCake

Monitor these endpoints:
- `https://your-domain.com` (frontend)
- `https://api.your-domain.com/health` (backend)

## Performance Optimization

### 1. CDN Configuration

Configure Cloudflare or AWS CloudFront:
- Cache static assets (images, CSS, JS)
- Enable Brotli compression
- Set appropriate cache headers

### 2. Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversion_logs_user_id ON conversion_logs(user_id);
CREATE INDEX idx_conversion_logs_timestamp ON conversion_logs(timestamp);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

### 3. Redis Caching

Configure Redis for:
- Session storage
- Rate limiting
- Temporary data caching

## Security Checklist

- [ ] HTTPS enabled everywhere
- [ ] Strong JWT secret (256+ bits)
- [ ] Database credentials secured
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] SQL injection prevention
- [ ] XSS protection headers
- [ ] Regular security updates

## Backup Strategy

### 1. Database Backups

```bash
# Daily backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
aws s3 cp backup_$(date +%Y%m%d).sql s3://your-backup-bucket/
```

### 2. Automated Backups

Set up automated backups:
- Railway: Built-in PostgreSQL backups
- Heroku: Heroku Postgres backups
- AWS RDS: Automated snapshots

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates valid
- [ ] Stripe webhooks configured

### Deployment
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and healthy
- [ ] Database connected
- [ ] Redis connected
- [ ] Stripe integration working

### Post-deployment
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] DNS propagated
- [ ] Performance optimized

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check connection string
   psql $DATABASE_URL
   ```

2. **Redis Connection Failed**
   ```bash
   # Test Redis connection
   redis-cli -u $REDIS_URL ping
   ```

3. **Stripe Webhook Failures**
   - Check webhook URL is accessible
   - Verify webhook secret matches
   - Check Stripe dashboard for errors

4. **CORS Issues**
   - Verify FRONTEND_URL in backend config
   - Check CORS middleware configuration

### Logs and Debugging

```bash
# View application logs
railway logs
# or
heroku logs --tail

# Check specific service logs
docker-compose logs backend
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancers (Nginx, AWS ALB)
- Scale backend instances
- Implement session sharing via Redis

### Database Scaling

- Read replicas for read-heavy workloads
- Connection pooling (PgBouncer)
- Database sharding for large datasets

### CDN and Caching

- Implement Redis caching for API responses
- Use CDN for static assets
- Enable browser caching headers

This deployment guide ensures a production-ready Transynk installation with proper security, monitoring, and scalability considerations.