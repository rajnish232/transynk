# 🚀 Deploy Transynk to Vercel - Step by Step

## **Method 1: Vercel Dashboard (Easiest)**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import your GitHub repo**: https://github.com/rajnish232/transynk
3. **Configure Project Settings:**
   - Framework Preset: `SvelteKit`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   ```
   VITE_API_URL = /api
   VITE_STRIPE_PUBLISHABLE_KEY = pk_test_placeholder_key
   ```

5. **Click Deploy**

## **Method 2: Fix Current Deployment**

If you already started deployment, go to:
1. **Your Vercel Project** → **Settings** → **Environment Variables**
2. **Add these variables:**

| Name | Value |
|------|-------|
| `VITE_API_URL` | `/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_placeholder` |

3. **Redeploy** by going to **Deployments** → **Redeploy**

## **Method 3: Deploy with Real Backend**

If you want to deploy with a working backend:

1. **First deploy backend to Railway:**
   - Connect GitHub repo to Railway
   - Add PostgreSQL and Redis services
   - Set environment variables for backend

2. **Get your Railway backend URL** (e.g., `https://transynk-api.railway.app`)

3. **Update Vercel environment variables:**
   ```
   VITE_API_URL = https://your-railway-backend-url.railway.app
   VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_real_stripe_key
   ```

## **Quick Test After Deployment**

Your Transynk app should be live at: `https://your-project-name.vercel.app`

**Features that will work without backend:**
- ✅ File conversion (local WebAssembly)
- ✅ Image compression
- ✅ File compression
- ✅ UI and navigation
- ✅ Responsive design

**Features that need backend:**
- ❌ User authentication
- ❌ Premium subscriptions
- ❌ Usage tracking
- ❌ Analytics dashboard

## **Next Steps After Frontend Deployment**

1. **Deploy Backend** (Railway/Heroku)
2. **Update Environment Variables** with real API URL
3. **Configure Stripe** with real keys
4. **Test Full Functionality**

---

**Your Transynk frontend will be live and working for file conversion even without the backend!** 🎉