#!/bin/bash

# Production Deployment Script for AnthroLearn LMS

echo "🚀 AnthroLearn LMS - Production Deployment"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

echo -e "\n${YELLOW}📋 Pre-deployment Checks${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "Frontend/lms/package.json" ]; then
    echo -e "${RED}❌ Not in project root directory${NC}"
    exit 1
fi

# Frontend checks
echo "🎨 Checking Frontend..."
cd Frontend/lms

# Check environment variables
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file missing${NC}"
    exit 1
fi

if ! grep -q "VITE_BACKEND_URL=https://anthro-learn.onrender.com" .env.production; then
    echo -e "${RED}❌ Production backend URL not configured${NC}"
    exit 1
fi

print_status 0 "Environment configuration valid"

# Test build
echo "🔨 Testing production build..."
npm install > /dev/null 2>&1
print_status $? "Dependencies installed"

npm run build > /dev/null 2>&1
print_status $? "Production build successful"

# Check build output
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌ Build output missing${NC}"
    exit 1
fi

print_status 0 "Build artifacts generated"

cd ../..

# Backend checks
echo -e "\n🔧 Checking Backend..."
cd Backend

# Check environment variables
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Backend .env file missing${NC}"
    exit 1
fi

print_status 0 "Backend configuration valid"

# Test backend
npm install > /dev/null 2>&1
print_status $? "Backend dependencies installed"

cd ..

echo -e "\n${YELLOW}🚀 Deployment Steps${NC}"

# Git operations
echo "📝 Preparing code for deployment..."
git add . > /dev/null 2>&1
print_status $? "Changes staged"

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
    git commit -m "Production deployment: Fix SPA routing, enhance error handling, add security headers

- Fixed Vercel SPA routing with proper vercel.json configuration
- Updated frontend to use production backend URL
- Enhanced axios error handling with 401/404/500 error management  
- Added production security headers and SEO meta tags
- Created production environment configuration
- Enhanced backend health check endpoint
- Production-ready error handling and logging" > /dev/null 2>&1
    print_status $? "Changes committed"
fi

git push > /dev/null 2>&1
print_status $? "Code pushed to GitHub"

echo -e "\n${GREEN}✅ Deployment Preparation Complete!${NC}"

echo -e "\n${YELLOW}📋 Next Steps:${NC}"
echo "1. Vercel will auto-deploy from GitHub push"
echo "2. Render will auto-deploy backend changes"
echo "3. Monitor deployment logs on both platforms"
echo "4. Test the application after deployment"

echo -e "\n${YELLOW}🔗 Deployment URLs:${NC}"
echo "Frontend: https://anthro-learn.vercel.app"
echo "Backend:  https://anthro-learn.onrender.com"
echo "Health:   https://anthro-learn.onrender.com/health"

echo -e "\n${YELLOW}🔍 Post-Deployment Verification:${NC}"
echo "✅ Visit frontend URL and test routing (refresh pages)"
echo "✅ Test login/registration functionality" 
echo "✅ Verify API calls work correctly"
echo "✅ Check browser console for errors"
echo "✅ Test all major features (courses, assignments, etc.)"

echo -e "\n${GREEN}🎉 Production deployment initiated successfully!${NC}"