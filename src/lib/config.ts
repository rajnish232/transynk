import { browser } from '$app/environment';

// Configuration that works both in development and production
export const config = {
  // API URL - defaults to relative path for same-domain deployment
  apiUrl: browser ? (import.meta.env.VITE_API_URL || '/api') : '/api',
  
  // Stripe - use placeholder for demo, real key for production
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
  
  // App settings
  app: {
    name: 'VastuSphere',
    description: 'Modern file converter & compressor',
    version: '1.0.0'
  },
  
  // Feature flags - Enable core features even without backend
  features: {
    authentication: false, // Disable auth for frontend-only deployment
    payments: false, // Disable payments for frontend-only deployment
    analytics: true,
    compression: true // Core file conversion works client-side
  }
};