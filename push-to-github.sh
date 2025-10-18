#!/bin/bash

# Transynk GitHub Push Script
# This script will push your Transynk code to GitHub

echo "🚀 Transynk GitHub Push Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the VERT directory.${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Current directory: $(pwd)${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}🔧 Initializing Git repository...${NC}"
    git init
fi

# Remove existing origin if it exists
echo -e "${YELLOW}🔧 Configuring remote repository...${NC}"
git remote remove origin 2>/dev/null || true

# Add your GitHub repository
echo -e "${BLUE}🔗 Adding GitHub repository as origin...${NC}"
git remote add origin https://github.com/rajnish232/transynk.git

# Verify remote
echo -e "${BLUE}📡 Verifying remote repository...${NC}"
git remote -v

# Add all files
echo -e "${YELLOW}📦 Adding all files to Git...${NC}"
git add .

# Check git status
echo -e "${BLUE}📋 Git status:${NC}"
git status --short

# Commit changes
echo -e "${YELLOW}💾 Committing changes...${NC}"
git commit -m "🚀 Initial Transynk release - Complete SaaS file converter

✨ Features:
- Modern file converter with WebAssembly processing
- Image & file compression tools
- Freemium model with premium subscriptions (\$2/month, \$15/lifetime)
- Stripe payment integration
- User authentication and dashboard
- Analytics and admin panel
- SEO-optimized landing pages
- Advertisement integration
- Mobile-responsive modern UI

🛠️ Tech Stack:
- Frontend: SvelteKit + TypeScript + Tailwind CSS
- Backend: Node.js + Express + PostgreSQL + Redis
- Payments: Stripe integration
- Deployment: Vercel + Railway ready

💰 Revenue Ready:
- Premium subscription model
- Usage-based limitations
- Advertisement slots
- Analytics tracking"

# Push to GitHub
echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
echo -e "${BLUE}Note: You may be prompted for your GitHub credentials.${NC}"

# Try to push
if git push -u origin main; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo -e "${GREEN}🎉 Your Transynk code is now available at: https://github.com/rajnish232/transynk${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. 🌐 Deploy frontend to Vercel: https://vercel.com"
    echo "2. 🚂 Deploy backend to Railway: https://railway.app"
    echo "3. 💳 Configure Stripe payments"
    echo "4. 🚀 Launch your SaaS!"
    echo ""
    echo -e "${YELLOW}📖 Check GITHUB_DEPLOYMENT.md for detailed deployment instructions.${NC}"
else
    echo -e "${RED}❌ Push failed. This might happen if:${NC}"
    echo "1. The repository already has content"
    echo "2. You need to authenticate with GitHub"
    echo "3. There are permission issues"
    echo ""
    echo -e "${YELLOW}🔧 Try these solutions:${NC}"
    echo "1. Force push (⚠️  use carefully): git push -u origin main --force"
    echo "2. Pull and merge first: git pull origin main --allow-unrelated-histories"
    echo "3. Check your GitHub credentials and permissions"
fi

echo ""
echo -e "${BLUE}📞 Need help? Check the GITHUB_DEPLOYMENT.md file for troubleshooting.${NC}"