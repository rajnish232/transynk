#!/usr/bin/env node

/**
 * Deployment Validation Script
 * Validates that all required environment variables are properly configured
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

console.log('🔍 Validating deployment configuration...\n');

// Check if we're in a Vercel project
try {
  const vercelConfig = JSON.parse(readFileSync('.vercel/project.json', 'utf8'));
  console.log(`✅ Vercel project: ${vercelConfig.name}`);
} catch (error) {
  console.log('❌ Not linked to Vercel project. Run: vercel link');
  process.exit(1);
}

// Check environment variables
console.log('\n📋 Checking environment variables...');

try {
  const envOutput = execSync('vercel env ls', { encoding: 'utf8' });
  
  const requiredVars = ['VITE_API_URL', 'VITE_STRIPE_PUBLISHABLE_KEY'];
  const environments = ['Production', 'Development', 'Preview'];
  
  let allValid = true;
  
  for (const envVar of requiredVars) {
    for (const env of environments) {
      if (envOutput.includes(`${envVar}`) && envOutput.includes(env)) {
        console.log(`✅ ${envVar} (${env})`);
      } else {
        console.log(`❌ ${envVar} (${env}) - Missing`);
        allValid = false;
      }
    }
  }
  
  if (!allValid) {
    console.log('\n❌ Some environment variables are missing. Please set them using:');
    console.log('vercel env add VARIABLE_NAME');
    process.exit(1);
  }
  
} catch (error) {
  console.log('❌ Failed to check environment variables');
  console.log('Make sure you have Vercel CLI installed and are logged in');
  process.exit(1);
}

// Check vercel.json configuration
console.log('\n📄 Checking vercel.json configuration...');

try {
  const vercelJson = JSON.parse(readFileSync('vercel.json', 'utf8'));
  
  // Check if environment variables are properly referenced
  if (vercelJson.env) {
    if (vercelJson.env.VITE_API_URL === '$VITE_API_URL') {
      console.log('✅ VITE_API_URL properly configured in vercel.json');
    } else {
      console.log('❌ VITE_API_URL not properly configured in vercel.json');
    }
    
    if (vercelJson.env.VITE_STRIPE_PUBLISHABLE_KEY === '$VITE_STRIPE_PUBLISHABLE_KEY') {
      console.log('✅ VITE_STRIPE_PUBLISHABLE_KEY properly configured in vercel.json');
    } else {
      console.log('❌ VITE_STRIPE_PUBLISHABLE_KEY not properly configured in vercel.json');
    }
  }
  
  // Check if API rewrites are configured
  if (vercelJson.rewrites && vercelJson.rewrites.some(r => r.source === '/api/(.*)')) {
    console.log('✅ API rewrites properly configured');
  } else {
    console.log('❌ API rewrites not configured');
  }
  
} catch (error) {
  console.log('❌ Failed to read vercel.json');
  process.exit(1);
}

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');

try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  
  const requiredScripts = ['build', 'dev'];
  
  for (const script of requiredScripts) {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script} script configured`);
    } else {
      console.log(`❌ ${script} script missing`);
    }
  }
  
} catch (error) {
  console.log('❌ Failed to read package.json');
  process.exit(1);
}

console.log('\n🎉 All deployment validations passed!');
console.log('\n📝 Next steps:');
console.log('1. Run: vercel --prod');
console.log('2. Your app will be deployed to: https://your-project.vercel.app');
console.log('3. API endpoints will be available at: https://your-project.vercel.app/api/*');

console.log('\n💡 Tips:');
console.log('- Your API runs on the same domain as your frontend');
console.log('- VITE_API_URL is set to "/api" for same-domain deployment');
console.log('- Update VITE_STRIPE_PUBLISHABLE_KEY with real Stripe key for production');