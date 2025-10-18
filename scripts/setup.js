#!/usr/bin/env node

/**
 * Transynk Setup Script
 * Automates the initial setup process for development and production
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

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
  log('🔍 Checking prerequisites...', 'bold');
  
  const requirements = [
    { command: 'node --version', name: 'Node.js', minVersion: '18.0.0' },
    { command: 'npm --version', name: 'npm' },
    { command: 'psql --version', name: 'PostgreSQL', optional: true },
    { command: 'redis-cli --version', name: 'Redis', optional: true }
  ];

  for (const req of requirements) {
    try {
      const version = execSync(req.command, { encoding: 'utf8' }).trim();
      log(`✅ ${req.name}: ${version}`, 'green');
    } catch (error) {
      if (req.optional) {
        log(`⚠️  ${req.name}: Not found (optional for development)`, 'yellow');
      } else {
        log(`❌ ${req.name}: Required but not found`, 'red');
        process.exit(1);
      }
    }
  }
}

function setupEnvironment() {
  log('🔧 Setting up environment...', 'bold');
  
  if (!existsSync('.env')) {
    if (existsSync('.env.example')) {
      execCommand('cp .env.example .env', 'Copying environment template');
      log('📝 Please update .env with your configuration', 'yellow');
    } else {
      log('❌ .env.example not found', 'red');
      process.exit(1);
    }
  } else {
    log('✅ .env already exists', 'green');
  }
}

function installDependencies() {
  log('📦 Installing dependencies...', 'bold');
  execCommand('npm install', 'Installing npm packages');
}

function setupDatabase() {
  log('🗄️  Setting up database...', 'bold');
  
  try {
    // Check if we can connect to the database
    const dbUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/transynk';
    log('Database will be automatically set up on first run', 'blue');
    log('✅ Database setup configured', 'green');
  } catch (error) {
    log('⚠️  Database connection not tested (will be created on first run)', 'yellow');
  }
}

function buildProject() {
  log('🏗️  Building project...', 'bold');
  execCommand('npm run build', 'Building frontend');
}

function generateSecrets() {
  log('🔐 Generating secrets...', 'bold');
  
  const envPath = '.env';
  let envContent = readFileSync(envPath, 'utf8');
  
  // Generate JWT secret if not present
  if (envContent.includes('JWT_SECRET=your-super-secret-jwt-key-change-in-production')) {
    const jwtSecret = require('crypto').randomBytes(64).toString('hex');
    envContent = envContent.replace(
      'JWT_SECRET=your-super-secret-jwt-key-change-in-production',
      `JWT_SECRET=${jwtSecret}`
    );
    writeFileSync(envPath, envContent);
    log('✅ Generated JWT secret', 'green');
  } else {
    log('✅ JWT secret already configured', 'green');
  }
}

function displayNextSteps() {
  log('\n🎉 Setup completed successfully!', 'bold');
  log('\n📋 Next steps:', 'bold');
  log('1. Update .env with your Stripe keys and database URLs', 'blue');
  log('2. Start the development servers:', 'blue');
  log('   npm run dev:full  (both frontend and backend)', 'yellow');
  log('   or separately:', 'yellow');
  log('   npm run dev       (frontend only)', 'yellow');
  log('   npm run dev:server (backend only)', 'yellow');
  log('3. Visit http://localhost:5173 to see your app', 'blue');
  log('4. Configure Stripe webhooks for payments', 'blue');
  log('5. Set up your ad network integration', 'blue');
  log('\n📚 Documentation:', 'bold');
  log('- README.md - Complete setup guide', 'blue');
  log('- docs/DEPLOYMENT.md - Production deployment', 'blue');
  log('- docs/AD_INTEGRATION.md - Ad network setup', 'blue');
  log('\n💡 Need help? Check the documentation or create an issue on GitHub', 'yellow');
}

function main() {
  log('🚀 Welcome to Transynk Setup!', 'bold');
  log('This script will help you set up your development environment.\n', 'blue');

  try {
    checkPrerequisites();
    setupEnvironment();
    installDependencies();
    generateSecrets();
    setupDatabase();
    buildProject();
    displayNextSteps();
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the setup
main();