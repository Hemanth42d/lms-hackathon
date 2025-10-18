#!/bin/bash

echo "🔍 LMS Production Deployment Verification"
echo "=========================================="
echo ""

# Check if vercel.json exists
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
else
    echo "❌ vercel.json missing"
fi

# Check if Frontend/lms/dist exists
if [ -d "Frontend/lms/dist" ]; then
    echo "✅ Frontend build directory exists"
    echo "   📦 Build size: $(du -sh Frontend/lms/dist | cut -f1)"
else
    echo "⚠️  Frontend build directory not found (will be created on Vercel)"
fi

# Check index.html in dist
if [ -f "Frontend/lms/dist/index.html" ]; then
    echo "✅ index.html found in build"
else
    echo "⚠️  index.html not found in build (normal if not built locally)"
fi

# Check environment file
if [ -f "Frontend/lms/.env" ]; then
    echo "✅ .env file exists"
    echo "   🔑 Variables:"
    cat Frontend/lms/.env | grep -v "^#" | grep -v "^$"
else
    echo "❌ .env file missing"
fi

# Check package.json scripts
if [ -f "Frontend/lms/package.json" ]; then
    echo "✅ package.json exists"
    echo "   📝 Build script:"
    grep -A 1 '"build"' Frontend/lms/package.json
else
    echo "❌ package.json missing"
fi

echo ""
echo "🔧 Testing Local Build"
echo "======================"
cd Frontend/lms

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "   📦 Build output:"
    ls -lh dist/ | head -10
    
    # Check if index.html exists
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html generated"
        echo "   📄 File size: $(stat -f%z dist/index.html 2>/dev/null || stat -c%s dist/index.html 2>/dev/null) bytes"
    else
        echo "❌ index.html not generated"
    fi
    
    # Check if assets exist
    if [ -d "dist/assets" ]; then
        echo "✅ Assets directory generated"
        echo "   📦 Asset files: $(ls -1 dist/assets | wc -l) files"
    else
        echo "⚠️  No assets directory"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

cd ../..

echo ""
echo "🌐 Vercel Configuration Check"
echo "=============================="

# Parse vercel.json
if command -v jq &> /dev/null; then
    echo "✅ buildCommand: $(jq -r '.buildCommand' vercel.json)"
    echo "✅ outputDirectory: $(jq -r '.outputDirectory' vercel.json)"
    echo "✅ installCommand: $(jq -r '.installCommand' vercel.json)"
else
    echo "⚠️  jq not installed, skipping JSON parsing"
    cat vercel.json
fi

echo ""
echo "📋 Deployment Checklist"
echo "======================="
echo "Before deploying, ensure:"
echo "  ☐ Environment variables set in Vercel Dashboard"
echo "  ☐ VITE_BACKEND_URL = https://anthro-learn.onrender.com"
echo "  ☐ VITE_GEMINI_API = Your API key"
echo "  ☐ Vercel project connected to GitHub"
echo "  ☐ Auto-deploy enabled for main branch"
echo ""
echo "🚀 Ready to deploy! Push to main branch:"
echo "   git add ."
echo "   git commit -m 'fix: complete production deployment setup'"
echo "   git push"
echo ""
echo "📊 Monitor deployment at: https://vercel.com/dashboard"
