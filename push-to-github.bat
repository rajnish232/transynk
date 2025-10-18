@echo off
echo 🚀 Transynk GitHub Push Script
echo ================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the VERT directory.
    pause
    exit /b 1
)

echo 📁 Current directory: %CD%

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Initialize git if not already initialized
if not exist ".git" (
    echo 🔧 Initializing Git repository...
    git init
)

REM Remove existing origin if it exists
echo 🔧 Configuring remote repository...
git remote remove origin 2>nul

REM Add your GitHub repository
echo 🔗 Adding GitHub repository as origin...
git remote add origin https://github.com/rajnish232/transynk.git

REM Verify remote
echo 📡 Verifying remote repository...
git remote -v

REM Add all files
echo 📦 Adding all files to Git...
git add .

REM Check git status
echo 📋 Git status:
git status --short

REM Commit changes
echo 💾 Committing changes...
git commit -m "🚀 Initial Transynk release - Complete SaaS file converter with monetization features"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
echo Note: You may be prompted for your GitHub credentials.

git push -u origin main

if errorlevel 1 (
    echo ❌ Push failed. Try these solutions:
    echo 1. Force push: git push -u origin main --force
    echo 2. Pull first: git pull origin main --allow-unrelated-histories
    echo 3. Check your GitHub credentials
) else (
    echo ✅ Successfully pushed to GitHub!
    echo 🎉 Your Transynk code is now available at: https://github.com/rajnish232/transynk
    echo.
    echo 📋 Next Steps:
    echo 1. 🌐 Deploy frontend to Vercel
    echo 2. 🚂 Deploy backend to Railway
    echo 3. 💳 Configure Stripe payments
    echo 4. 🚀 Launch your SaaS!
)

echo.
echo 📖 Check GITHUB_DEPLOYMENT.md for detailed deployment instructions.
pause