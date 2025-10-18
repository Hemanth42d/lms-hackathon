#!/bin/bash

# Quick AWS Deployment Script for AnthroLearn LMS
# Run this script on your AWS EC2 instance after cloning the repository

echo "======================================"
echo "AnthroLearn LMS - AWS Deployment"
echo "======================================"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "Please do not run as root"
   exit 1
fi

# Get EC2 public IP
echo "Detecting EC2 instance public IP..."
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
if [ -z "$PUBLIC_IP" ]; then
    echo "Could not detect EC2 public IP. Please enter it manually:"
    read -p "Enter your EC2 public IP: " PUBLIC_IP
fi
echo "Using IP: $PUBLIC_IP"
echo ""

# MongoDB URI
echo "MongoDB Configuration:"
echo "1. Use MongoDB Atlas (recommended)"
echo "2. Use local MongoDB"
read -p "Choose option (1 or 2): " MONGO_OPTION

if [ "$MONGO_OPTION" = "1" ]; then
    read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI
else
    MONGODB_URI="mongodb://localhost:27017/lms"
fi

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
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
if [ $? -ne 0 ]; then
    echo "✗ Backend npm install failed"
    exit 1
fi
echo "✓ Backend dependencies installed"
cd ..

# Install Frontend dependencies
echo "Installing Frontend dependencies..."
cd Frontend/lms
npm install
if [ $? -ne 0 ]; then
    echo "✗ Frontend npm install failed"
    exit 1
fi
echo "✓ Frontend dependencies installed"

# Build Frontend
echo "Building Frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "✗ Frontend build failed"
    exit 1
fi
echo "✓ Frontend built successfully"
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

# Start Backend with PM2
echo ""
echo "Starting Backend server..."
cd Backend
pm2 delete lms-backend 2>/dev/null
pm2 start index.js --name lms-backend
cd ..

# Start Frontend with PM2
echo "Starting Frontend server..."
cd Frontend/lms
pm2 delete lms-frontend 2>/dev/null
pm2 serve dist 5173 --spa --name lms-frontend
cd ../..

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
echo ""
echo "Setting up PM2 to start on system boot..."
pm2 startup | tail -n 1 > /tmp/pm2-startup.sh
if [ -s /tmp/pm2-startup.sh ]; then
    sudo bash /tmp/pm2-startup.sh
    rm /tmp/pm2-startup.sh
fi

echo ""
echo "======================================"
echo "✓ Deployment Complete!"
echo "======================================"
echo ""
echo "Your application is running at:"
echo "  Frontend: http://$PUBLIC_IP:5173"
echo "  Backend:  http://$PUBLIC_IP:3000"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check service status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart all services"
echo "  pm2 monit           - Monitor processes"
echo ""
echo "To setup Nginx reverse proxy, see AWS_DEPLOYMENT_GUIDE.md"
echo ""
