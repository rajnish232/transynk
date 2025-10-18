#!/usr/bin/env node

/**
 * Production Setup Script for Transynk
 * Prepares the application for production deployment
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

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

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function setupProductionEnvironment() {
  log('🔧 Setting up production environment...', 'bold');
  
  if (!existsSync('.env.prod')) {
    if (existsSync('.env.production')) {
      let envContent = readFileSync('.env.production', 'utf8');
      
      // Generate secure JWT secret
      const jwtSecret = generateSecureSecret(32);
      envContent = envContent.replace(
        'JWT_SECRET=your-super-secure-jwt-secret-at-least-256-bits-long-change-this',
        `JWT_SECRET=${jwtSecret}`
      );
      
      // Generate secure database password
      const dbPassword = generateSecureSecret(16);
      envContent = envContent.replace(
        'POSTGRES_PASSWORD=your_secure_database_password',
        `POSTGRES_PASSWORD=${dbPassword}`
      );
      
      writeFileSync('.env.prod', envContent);
      log('✅ Created .env.prod with secure secrets', 'green');
      log('⚠️  Please update .env.prod with your actual Stripe keys and domain', 'yellow');
    } else {
      log('❌ .env.production template not found', 'red');
      process.exit(1);
    }
  } else {
    log('✅ .env.prod already exists', 'green');
  }
}

function buildApplication() {
  log('🏗️  Building application for production...', 'bold');
  
  // Clean previous builds
  execCommand('rm -rf build dist', 'Cleaning previous builds');
  
  // Install dependencies
  execCommand('npm ci --only=production=false', 'Installing dependencies');
  
  // Run quality checks
  execCommand('npm run lint', 'Running linter');
  execCommand('npm run check', 'Type checking');
  
  // Build frontend and backend
  execCommand('npm run build:prod', 'Building application');
  
  log('✅ Application built successfully', 'green');
}

function setupNginx() {
  log('🌐 Setting up Nginx configuration...', 'bold');
  
  if (!existsSync('nginx')) {
    mkdirSync('nginx', { recursive: true });
  }
  
  // Copy production nginx config
  if (existsSync('nginx/nginx.prod.conf')) {
    log('✅ Nginx configuration ready', 'green');
    log('📝 Update nginx/nginx.prod.conf with your domain name', 'yellow');
  } else {
    log('⚠️  Nginx configuration not found', 'yellow');
  }
}

function setupSSL() {
  log('🔒 SSL Certificate setup...', 'bold');
  
  if (!existsSync('nginx/ssl')) {
    mkdirSync('nginx/ssl', { recursive: true });
  }
  
  log('📝 SSL Certificate setup required:', 'yellow');
  log('  1. For Let\'s Encrypt: certbot certonly --standalone -d your-domain.com', 'blue');
  log('  2. Copy certificates to nginx/ssl/ directory', 'blue');
  log('  3. Update nginx configuration with your domain', 'blue');
}

function createSystemdService() {
  log('⚙️  Creating systemd service...', 'bold');
  
  const serviceContent = `[Unit]
Description=Transynk File Converter
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=${process.cwd()}
Environment=NODE_ENV=production
EnvironmentFile=${process.cwd()}/.env.prod
ExecStart=/usr/bin/node ${process.cwd()}/dist/server/index.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=transynk

[Install]
WantedBy=multi-user.target`;

  writeFileSync('transynk.service', serviceContent);
  
  log('✅ Systemd service file created: transynk.service', 'green');
  log('📝 To install the service:', 'yellow');
  log('  sudo cp transynk.service /etc/systemd/system/', 'blue');
  log('  sudo systemctl daemon-reload', 'blue');
  log('  sudo systemctl enable transynk', 'blue');
  log('  sudo systemctl start transynk', 'blue');
}

function setupMonitoring() {
  log('📊 Setting up monitoring...', 'bold');
  
  // Create a simple monitoring script
  const monitorScript = `#!/bin/bash
# Simple health check script for Transynk

URL="http://localhost:3000/health"
LOGFILE="/var/log/transynk-monitor.log"

response=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $response -eq 200 ]; then
    echo "$(date): Transynk is healthy" >> $LOGFILE
else
    echo "$(date): Transynk health check failed (HTTP $response)" >> $LOGFILE
    # Restart service if unhealthy
    sudo systemctl restart transynk
fi`;

  writeFileSync('scripts/monitor.sh', monitorScript);
  execCommand('chmod +x scripts/monitor.sh', 'Making monitor script executable');
  
  log('✅ Monitoring script created', 'green');
  log('📝 Add to crontab for automated monitoring:', 'yellow');
  log('  */5 * * * * /path/to/transynk/scripts/monitor.sh', 'blue');
}

function displayProductionChecklist() {
  log('\n📋 Production Deployment Checklist:', 'bold');
  
  const checklist = [
    '□ Update .env.prod with your actual values',
    '□ Configure your domain DNS',
    '□ Set up SSL certificates',
    '□ Configure Stripe webhooks',
    '□ Set up database backups',
    '□ Configure monitoring and alerting',
    '□ Test all functionality',
    '□ Set up log rotation',
    '□ Configure firewall rules',
    '□ Set up automated deployments'
  ];
  
  checklist.forEach(item => log(item, 'yellow'));
  
  log('\n🚀 Deployment Commands:', 'bold');
  log('  Development: npm run dev:full', 'blue');
  log('  Production: ./scripts/deploy.sh', 'blue');
  log('  Docker: ./scripts/deploy.sh --docker', 'blue');
  
  log('\n📚 Documentation:', 'bold');
  log('  • README.md - Complete setup guide', 'blue');
  log('  • docs/DEPLOYMENT.md - Detailed deployment instructions', 'blue');
  log('  • docs/AD_INTEGRATION.md - Advertisement setup', 'blue');
}

function main() {
  log('🏭 Transynk Production Setup', 'bold');
  log('Preparing your application for production deployment...\n', 'blue');

  try {
    setupProductionEnvironment();
    buildApplication();
    setupNginx();
    setupSSL();
    createSystemdService();
    setupMonitoring();
    displayProductionChecklist();
    
    log('\n🎉 Production setup completed!', 'bold');
    log('Your Transynk application is ready for production deployment.', 'green');
    
  } catch (error) {
    log(`\n❌ Production setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the setup
main();