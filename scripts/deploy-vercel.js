#!/usr/bin/env node

/**
 * Vercel Deployment Script for Transynk
 * Automates the deployment process to Vercel
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

function checkPrerequisites() {
  log('🔍 Checking deployment prerequisites...', 'bold');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    log('✅ Vercel CLI is installed', 'green');
  } catch (error) {
    log('❌ Vercel CLI not found. Installing...', 'yellow');
    execCommand('npm install -g vercel', 'Installing Vercel CLI');
  }

  // Check if user is logged in to Vercel
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    log('✅ Logged in to Vercel', 'green');
  } catch (error) {
    log('⚠️  Not logged in to Vercel. Please run: vercel login', 'yellow');
    process.exit(1);
  }
}

function validateEnvironment() {
  log('🔧 Validating environment configuration...', 'bold');
  
  if (!existsSync('.env')) {
    log('❌ .env file not found. Please create one based on .env.example', 'red');
    process.exit(1);
  }

  const envContent = readFileSync('.env', 'utf8');
  const requiredVars = [
    'STRIPE_PUBLISHABLE_KEY',
    'DATABASE_URL',
    'JWT_SECRET'
  ];

  for (const varName of requiredVars) {
    if (!envContent.includes(varName)) {
      log(`⚠️  Missing environment variable: ${varName}`, 'yellow');
    }
  }

  log('✅ Environment configuration validated', 'green');
}

function buildProject() {
  log('🏗️  Building project for production...', 'bold');
  execCommand('npm run build', 'Building SvelteKit application');
}

function deployToVercel() {
  log('🚀 Deploying to Vercel...', 'bold');
  
  // Deploy to Vercel
  execCommand('vercel --prod', 'Deploying to production');
  
  log('🎉 Deployment completed successfully!', 'bold');
  log('\n📋 Next steps:', 'bold');
  log('1. Set up your environment variables in Vercel dashboard', 'blue');
  log('2. Configure your custom domain (if applicable)', 'blue');
  log('3. Set up your database and Redis instances', 'blue');
  log('4. Configure Stripe webhooks with your new domain', 'blue');
  log('5. Test all functionality on the live site', 'blue');
}

function setEnvironmentVariables() {
  log('🔐 Setting up environment variables...', 'bold');
  
  const envVars = [
    { name: 'DATABASE_URL', description: 'PostgreSQL connection string' },
    { name: 'REDIS_URL', description: 'Redis connection string' },
    { name: 'JWT_SECRET', description: 'JWT signing secret' },
    { name: 'STRIPE_SECRET_KEY', description: 'Stripe secret key' },
    { name: 'STRIPE_PUBLISHABLE_KEY', description: 'Stripe publishable key' },
    { name: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhook secret' },
    { name: 'NODE_ENV', description: 'Environment (production)' }
  ];

  log('Please set these environment variables in your Vercel dashboard:', 'yellow');
  envVars.forEach(env => {
    log(`  - ${env.name}: ${env.description}`, 'blue');
  });
  
  log('\nOr use Vercel CLI:', 'yellow');
  log('vercel env add <VARIABLE_NAME> production', 'blue');
}

function displayDeploymentInfo() {
  log('\n🌐 Deployment Information:', 'bold');
  log('Frontend: Deployed to Vercel automatically', 'green');
  log('Backend API: You\'ll need to deploy separately to Railway/Heroku', 'yellow');
  log('Database: Set up PostgreSQL (Supabase, PlanetScale, or Neon)', 'yellow');
  log('Redis: Set up Redis (Upstash or Redis Cloud)', 'yellow');
  
  log('\n📚 Useful commands:', 'bold');
  log('vercel --prod          # Deploy to production', 'blue');
  log('vercel env ls          # List environment variables', 'blue');
  log('vercel logs            # View deployment logs', 'blue');
  log('vercel domains         # Manage custom domains', 'blue');
}

function main() {
  log('🚀 Transynk Vercel Deployment', 'bold');
  log('This script will deploy your Transynk application to Vercel.\n', 'blue');

  try {
    checkPrerequisites();
    validateEnvironment();
    buildProject();
    deployToVercel();
    setEnvironmentVariables();
    displayDeploymentInfo();
  } catch (error) {
    log(`\n❌ Deployment failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the deployment
main();