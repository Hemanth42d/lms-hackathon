#!/bin/bash

# Simple AWS EC2 Setup Script for AnthroLearn LMS
# Run this on your EC2 instance after cloning the repository

set -e  # Exit on any error

echo "=========================================="
echo "  AnthroLearn LMS - AWS EC2 Setup"
echo "=========================================="
echo ""

# Get EC2 public IP
PUBLIC_IP="34.227.106.134"
echo "Using EC2 IP: $PUBLIC_IP"
echo ""

# Get MongoDB connection string
echo "Enter your MongoDB Atlas connection string:"
echo "(Example: mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/lms)"
read -p "MongoDB URI: " MONGODB_URI

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo ""
echo "Generated JWT Secret: $JWT_SECRET"
echo ""

# Create Backend .env
echo "Creating Backend environment file..."
cat > Backend/.env << EOF
PORT=3000
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=http://$PUBLIC_IP:5173
NODE_ENV=production
EOF
echo "✓ Backend .env created"

# Create Frontend .env
echo "Creating Frontend environment file..."
cat > Frontend/lms/.env << EOF
VITE_BACKEND_URL=http://$PUBLIC_IP:3000
VITE_GEMINI_API=AIzaSyAQuL4YNl3ggPuNIIYu8idHxgQ4uyKziLQ
EOF
echo "✓ Frontend .env created"
echo ""

# Install Backend dependencies
echo "Installing Backend dependencies..."
cd Backend
npm install
echo "✓ Backend dependencies installed"
cd ..

# Install Frontend dependencies
echo "Installing Frontend dependencies..."
cd Frontend/lms
npm install
echo "✓ Frontend dependencies installed"

# Build Frontend
echo "Building Frontend..."
npm run build
echo "✓ Frontend built"
cd ../..

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Check if serve is installed
if ! command -v serve &> /dev/null; then
    echo "Installing serve..."
    sudo npm install -g serve
fi

# Stop existing PM2 processes
pm2 delete lms-backend 2>/dev/null || true
pm2 delete lms-frontend 2>/dev/null || true

# Start Backend
echo ""
echo "Starting Backend server..."
cd Backend
pm2 start index.js --name lms-backend
cd ..

# Start Frontend
echo "Starting Frontend server..."
cd Frontend/lms
pm2 serve dist 5173 --spa --name lms-frontend
cd ../..

# Save PM2 configuration
pm2 save

# Setup PM2 startup
echo ""
echo "Setting up PM2 to start on boot..."
pm2 startup | grep "sudo" | bash || true

echo ""
echo "=========================================="
echo "  ✓ Setup Complete!"
echo "=========================================="
echo ""
echo "Services Status:"
pm2 status
echo ""
echo "Access your application:"
echo "  Frontend: http://$PUBLIC_IP:5173"
echo "  Backend:  http://$PUBLIC_IP:3000"
echo ""
echo "Useful Commands:"
echo "  pm2 status       - Check services"
echo "  pm2 logs         - View logs"
echo "  pm2 restart all  - Restart services"
echo ""
echo "If you can't access the application:"
echo "1. Check AWS Security Group allows ports 3000 and 5173"
echo "2. Run: pm2 logs"
echo ""
