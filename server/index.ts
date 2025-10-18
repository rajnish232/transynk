import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/users.js';
import { subscriptionRouter } from './routes/subscriptions.js';
import { analyticsRouter } from './routes/analytics.js';
import { imageResizeRouter } from './routes/imageResize.js';
import { pdfOperationsRouter } from './routes/pdfOperations.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy in production
if (isProduction) {
  app.set('trust proxy', 1);
}

// Middleware
app.use(cors({
  origin: isProduction 
    ? [process.env.FRONTEND_URL || 'https://your-domain.com']
    : ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);

// Serve static files in production
if (isProduction) {
  const buildPath = path.join(__dirname, '../../build');
  app.use(express.static(buildPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/images', imageResizeRouter);
app.use('/api/pdf', pdfOperationsRouter);

// Serve SvelteKit app in production
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'));
  });
}

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Transynk ${isProduction ? 'production' : 'development'} server running on port ${PORT}`);
  if (isProduction) {
    console.log(`📱 Frontend served from: ${path.join(__dirname, '../../build')}`);
  }
});
