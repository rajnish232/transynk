# Vercel Deployment Guide for Transynk

This guide will help you deploy Transynk to Vercel for production use.

## Prerequisites

- Vercel account (free tier available)
- GitHub repository with your Transynk code
- Stripe account for payments
- Database provider (Supabase, PlanetScale, or Neon)
- Redis provider (Upstash or Redis Cloud)

## Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

## Step 2: Set Up External Services

### Database Setup (Choose one)

#### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from Settings > Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

#### Option B: PlanetScale
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection string from Connect tab

#### Option C: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### Redis Setup (Choose one)

#### Option A: Upstash (Recommended)
1. Go to [upstash.com](https://upstash.com)
2. Create a Redis database
3. Copy the Redis URL

#### Option B: Redis Cloud
1. Go to [redis.com](https://redis.com)
2. Create a new database
3. Get connection details

## Step 3: Deploy Frontend to Vercel

### Automatic Deployment (Recommended)

1. **Connect GitHub to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the root directory

2. **Configure Build Settings**:
   - Framework Preset: SvelteKit
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   In Vercel dashboard, go to Settings > Environment Variables and add:
   ```
   VITE_API_URL=https://your-api-domain.railway.app
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
   ```

### Manual Deployment

1. **Run deployment script**:
   ```bash
   npm run deploy:vercel
   ```

2. **Or use Vercel CLI directly**:
   ```bash
   vercel --prod
   ```

## Step 4: Deploy Backend API

Since Vercel has limitations with Node.js backends, deploy your API separately:

### Option A: Railway (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set environment variables**:
   ```bash
   railway variables set DATABASE_URL="your-database-url"
   railway variables set REDIS_URL="your-redis-url"
   railway variables set JWT_SECRET="your-jwt-secret"
   railway variables set STRIPE_SECRET_KEY="your-stripe-secret"
   railway variables set STRIPE_WEBHOOK_SECRET="your-webhook-secret"
   railway variables set FRONTEND_URL="https://your-vercel-domain.vercel.app"
   railway variables set NODE_ENV="production"
   ```

### Option B: Heroku

1. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**:
   ```bash
   heroku config:set DATABASE_URL="your-database-url"
   heroku config:set REDIS_URL="your-redis-url"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set STRIPE_SECRET_KEY="your-stripe-secret"
   heroku config:set STRIPE_WEBHOOK_SECRET="your-webhook-secret"
   heroku config:set FRONTEND_URL="https://your-vercel-domain.vercel.app"
   heroku config:set NODE_ENV="production"
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

## Step 5: Configure Stripe Webhooks

1. **Go to Stripe Dashboard** > Developers > Webhooks
2. **Add endpoint**: `https://your-api-domain.railway.app/api/subscriptions/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Copy webhook signing secret** and add to your backend environment variables

## Step 6: Set Up Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update environment variables** with your new domain:
   ```
   FRONTEND_URL=https://your-custom-domain.com
   ```

## Step 7: Initialize Database

Your database tables will be created automatically when the backend starts. If you need to run migrations manually:

1. **Connect to your database**:
   ```bash
   psql "your-database-url"
   ```

2. **Run the table creation queries** from `server/config/database.ts`

## Step 8: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test key functionality**:
   - User registration/login
   - File conversion
   - Image compression/resizing
   - Payment flow (use Stripe test mode first)
   - Premium features

## Environment Variables Reference

### Frontend (Vercel)
```env
VITE_API_URL=https://your-api-domain.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

### Backend (Railway/Heroku)
```env
DATABASE_URL=postgresql://username:password@host:5432/database
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secure-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

## Monitoring and Maintenance

### Vercel Analytics
- Enable Vercel Analytics in your dashboard
- Monitor performance and usage

### Error Tracking
Add Sentry for error monitoring:
```bash
npm install @sentry/svelte @sentry/node
```

### Uptime Monitoring
Set up monitoring with:
- UptimeRobot
- Pingdom
- Better Uptime

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify environment variables are set

2. **API Connection Issues**:
   - Verify VITE_API_URL is correct
   - Check CORS settings in backend
   - Ensure backend is deployed and running

3. **Database Connection**:
   - Verify DATABASE_URL format
   - Check database provider status
   - Ensure database allows external connections

4. **Stripe Webhooks**:
   - Verify webhook URL is accessible
   - Check webhook secret matches
   - Monitor webhook delivery in Stripe dashboard

### Useful Commands

```bash
# Vercel commands
vercel --prod                    # Deploy to production
vercel env ls                    # List environment variables
vercel logs                      # View deployment logs
vercel domains                   # Manage domains

# Railway commands
railway status                   # Check deployment status
railway logs                     # View application logs
railway variables               # Manage environment variables

# Database commands
psql "your-database-url"        # Connect to database
```

## Security Checklist

- [ ] Use strong JWT secret (256+ bits)
- [ ] Enable HTTPS everywhere
- [ ] Set secure CORS origins
- [ ] Use production Stripe keys
- [ ] Enable rate limiting
- [ ] Set up proper error monitoring
- [ ] Regular security updates

## Performance Optimization

- [ ] Enable Vercel Edge Functions
- [ ] Configure CDN caching
- [ ] Optimize images and assets
- [ ] Monitor Core Web Vitals
- [ ] Set up database connection pooling

## Cost Optimization

- [ ] Monitor Vercel usage
- [ ] Optimize database queries
- [ ] Use appropriate Redis plan
- [ ] Monitor Stripe transaction fees
- [ ] Set up usage alerts

Your Transynk application should now be successfully deployed and ready for production use!