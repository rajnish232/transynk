# vastusphere - Modern File Converter & Compressor

Transform any file format instantly with our privacy-first, modern file converter. Built with SvelteKit, featuring local WebAssembly processing, premium subscriptions, and a beautiful user interface.

## 🚀 Features

### Core Features
- **Privacy-First**: All file conversions happen locally in your browser using WebAssembly
- **Modern UI**: Beautiful, responsive design inspired by Google AI and Pika Labs
- **Fast Processing**: Instant conversions with no file uploads required
- **Multiple Formats**: Support for images, documents, videos, audio, and more

### Monetization Features
- **Freemium Model**: 3 free conversions per day for free users
- **Premium Plans**: $2/month or $15/lifetime for unlimited access
- **Advanced Features**: Premium-only formats like video to MP3 conversion
- **File Compression**: Compress files up to 100MB for premium users
- **Ad Integration**: Revenue optimization through strategic ad placement

### Business Features
- **User Authentication**: Secure JWT-based authentication system
- **Subscription Management**: Stripe integration for payments
- **Usage Tracking**: Quota management and analytics
- **Admin Dashboard**: Business metrics and user management
- **SEO Optimized**: Landing pages for popular conversion formats

## 🛠 Tech Stack

### Frontend
- **SvelteKit** - Modern reactive framework
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **WebAssembly** - Local file processing
- **Lucide Icons** - Beautiful icon system

### Backend
- **Node.js/Express** - RESTful API server
- **PostgreSQL** - Primary database
- **Redis** - Session management and caching
- **JWT** - Authentication tokens
- **Stripe** - Payment processing

### Infrastructure
- **Vercel** - Frontend deployment
- **Railway/Heroku** - Backend hosting
- **Cloudflare** - CDN and security

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Stripe account (for payments)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/transynk.git
cd transynk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/transynk
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App URLs
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

### 4. Database Setup
The application will automatically create the required tables on first run. Make sure PostgreSQL is running and the database exists.

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev:full

# Or start individually
npm run dev        # Frontend only (port 5173)
npm run dev:server # Backend only (port 3001)
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `build`

2. **Environment Variables**
   ```env
   VITE_API_URL=https://your-api-domain.com
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   ```

3. **Deploy**
   - Push to main branch for automatic deployment
   - Or use Vercel CLI: `vercel --prod`

### Backend Deployment (Railway)

1. **Create Railway Project**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Add Services**
   - PostgreSQL database
   - Redis instance
   - Node.js service

3. **Environment Variables**
   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   JWT_SECRET=your-production-jwt-secret
   STRIPE_SECRET_KEY=sk_live_your_live_key
   STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook
   FRONTEND_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Alternative: Heroku Deployment

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:mini
   heroku addons:create heroku-redis:mini
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
   heroku config:set FRONTEND_URL=https://your-frontend.com
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Docker Deployment

1. **Build and Run**
   ```bash
   docker-compose up -d
   ```

2. **Environment Configuration**
   Update `docker-compose.yml` with your environment variables.

## 💳 Stripe Setup

### 1. Create Stripe Account
- Sign up at [stripe.com](https://stripe.com)
- Get your API keys from the dashboard
use our site at https://vastusphere.com/
### 2. Configure Webhooks
- Add webhook endpoint: `https://your-api-domain.com/api/subscriptions/webhook`
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### 3. Test Payments
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 📊 Analytics & Ads

### Google Analytics Setup
1. Create GA4 property
2. Add tracking code to `src/app.html`
3. Configure conversion events

### Ad Network Integration
See `docs/AD_INTEGRATION.md` for detailed instructions on:
- Google AdSense setup
- Alternative ad networks
- Revenue optimization
- Ad blocker detection

## 🔧 Configuration

### Premium Features
Configure which features are premium-only in:
- `src/lib/stores/auth.svelte.ts` - User permissions
- `src/lib/components/upload/FileUploader.svelte` - Upload limits
- Backend API routes - Feature gating

### File Processing
WebAssembly modules are loaded from:
- `static/` directory for WASM files
- `src/lib/converters/` for conversion logic

### Theming
Customize the design system in:
- `tailwind.config.ts` - Colors and spacing
- `src/lib/css/app.scss` - Global styles
- Component files - Individual styling

## 🧪 Testing

### Run Tests
```bash
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run test:watch  # Watch mode
```

### Test Coverage
```bash
npm run test:coverage
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] File upload and conversion
- [ ] Quota enforcement for free users
- [ ] Payment flow (use Stripe test mode)
- [ ] Premium feature access
- [ ] Mobile responsiveness
- [ ] Ad display (free users only)

## 📈 Monitoring

### Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Uptime**: Service availability monitoring
- **Logs**: Structured logging with Winston

### Business Metrics
- Daily active users
- Conversion rates (free to premium)
- Revenue tracking
- Feature usage analytics

## 🔒 Security

### Best Practices Implemented
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS enforcement
- CORS configuration
- SQL injection prevention

### Security Checklist
- [ ] Update JWT secret in production
- [ ] Enable HTTPS everywhere
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Regular dependency updates
- [ ] Database connection security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write tests for new features
- Update documentation
- Follow semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Ad Integration](docs/AD_INTEGRATION.md)

### Getting Help
- 📧 Email: support@transynk.com
- 💬 Discord: [Join our community](https://discord.gg/transynk)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/transynk/issues)

### FAQ

**Q: How do I add new file formats?**
A: Add conversion logic to `src/lib/converters/` and update the format lists in the UI components.

**Q: Can I self-host Transynk?**
A: Yes! Follow the deployment instructions above. You'll need to set up your own Stripe account for payments.

**Q: How do I customize the pricing?**
A: Update the pricing in `src/routes/pricing/+page.svelte` and the Stripe product configuration.

**Q: Is the file processing really local?**
A: Yes, all file conversions happen in your browser using WebAssembly. Files never leave your device.

---

Built with ❤️ for creators worldwide. Transform your files with confidence and privacy.
