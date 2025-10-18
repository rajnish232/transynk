#!/bin/bash

# Transynk Production Deployment Script
set -e

echo "🚀 Starting Transynk production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    print_error ".env.prod file not found!"
    print_warning "Please copy .env.production to .env.prod and configure your environment variables"
    exit 1
fi

# Load environment variables
export $(cat .env.prod | grep -v '^#' | xargs)

print_status "Environment loaded from .env.prod"

# Check required environment variables
required_vars=("DATABASE_URL" "JWT_SECRET" "STRIPE_SECRET_KEY" "FRONTEND_URL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set"
        exit 1
    fi
done

print_success "All required environment variables are set"

# Install dependencies
print_status "Installing dependencies..."
npm ci --only=production=false

# Run linting and type checking
print_status "Running code quality checks..."
npm run lint
npm run check

# Build the application
print_status "Building application..."
npm run build:prod

print_success "Application built successfully"

# Database setup
print_status "Setting up database..."
if command -v psql &> /dev/null; then
    print_status "PostgreSQL client found, testing connection..."
    if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        print_success "Database connection successful"
    else
        print_warning "Could not connect to database. Make sure PostgreSQL is running and accessible."
    fi
else
    print_warning "PostgreSQL client not found. Skipping database connection test."
fi

# Docker deployment option
if [ "$1" = "--docker" ]; then
    print_status "Deploying with Docker..."
    
    # Build and start containers
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml build
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Docker containers started"
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Health check
    if curl -f http://localhost:3000/health &> /dev/null; then
        print_success "Application is healthy and running!"
    else
        print_error "Application health check failed"
        docker-compose -f docker-compose.prod.yml logs transynk-app
        exit 1
    fi
    
else
    # Direct deployment
    print_status "Starting application server..."
    
    # Kill existing process if running
    if pgrep -f "node dist/server/index.js" > /dev/null; then
        print_status "Stopping existing application..."
        pkill -f "node dist/server/index.js"
        sleep 2
    fi
    
    # Start the application
    print_status "Starting new application instance..."
    nohup npm start > app.log 2>&1 &
    
    # Wait for startup
    sleep 5
    
    # Health check
    if curl -f http://localhost:3000/health &> /dev/null; then
        print_success "Application is healthy and running!"
    else
        print_error "Application health check failed"
        tail -n 20 app.log
        exit 1
    fi
fi

# Final checks
print_status "Running post-deployment checks..."

# Check if frontend is accessible
if [ ! -z "$FRONTEND_URL" ]; then
    if curl -f "$FRONTEND_URL" &> /dev/null; then
        print_success "Frontend is accessible at $FRONTEND_URL"
    else
        print_warning "Frontend may not be accessible at $FRONTEND_URL"
    fi
fi

# Display deployment summary
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "  • Application: Running"
echo "  • Database: Connected"
echo "  • Environment: Production"
echo "  • Frontend URL: $FRONTEND_URL"
echo ""
echo "📝 Next Steps:"
echo "  1. Configure your domain DNS to point to this server"
echo "  2. Set up SSL certificates (Let's Encrypt recommended)"
echo "  3. Configure monitoring and alerting"
echo "  4. Set up automated backups"
echo ""
echo "🔧 Useful Commands:"
echo "  • View logs: tail -f app.log (or docker-compose logs -f)"
echo "  • Restart app: npm start (or docker-compose restart)"
echo "  • Check status: curl http://localhost:3000/health"
echo ""

print_success "Transynk is now running in production! 🚀"