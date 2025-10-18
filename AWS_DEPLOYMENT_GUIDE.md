# AWS EC2 Deployment Guide - AnthroLearn LMS

This guide will help you deploy the AnthroLearn LMS application on an AWS EC2 instance.

## Prerequisites

- AWS Account
- EC2 Instance (Ubuntu 20.04 LTS or later recommended)
- Domain name (optional, but recommended)

## Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS
3. **Instance Type**: t2.medium or higher (2 vCPU, 4GB RAM minimum)
4. **Configure Security Group**:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere (0.0.0.0/0)
   - HTTPS (443) - Anywhere (0.0.0.0/0)
   - Custom TCP (3000) - Anywhere (for Backend API)
   - Custom TCP (5173) - Anywhere (for Frontend, temporary)
5. **Create/Download Key Pair** (e.g., `lms-key.pem`)
6. **Launch Instance**

## Step 2: Connect to EC2 Instance

```bash
# Set proper permissions for your key
chmod 400 lms-key.pem

# Connect to your instance
ssh -i lms-key.pem ubuntu@<your-ec2-public-ip>
```

## Step 3: Install Required Software

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version   # Should be v9.x or higher

# Install Git
sudo apt install -y git

# Install MongoDB (if you want local MongoDB)
# OR use MongoDB Atlas (recommended)

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (for reverse proxy)
sudo apt install -y nginx
```

## Step 4: Clone and Setup Project

```bash
# Clone your repository
git clone https://github.com/Hemanth42d/lms-hackathon.git
cd lms-hackathon

# Setup Backend
cd Backend
npm install

# Create .env file for Backend
cat > .env << EOF
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://<your-ec2-public-ip>:5173
NODE_ENV=production
EOF

cd ..

# Setup Frontend
cd Frontend/lms
npm install

# Update .env file for Frontend
cat > .env << EOF
VITE_BACKEND_URL=http://<your-ec2-public-ip>:3000
VITE_GEMINI_API=AIzaSyAQuL4YNl3ggPuNIIYu8idHxgQ4uyKziLQ
EOF

cd ../..
```

## Step 5: Build Frontend

```bash
cd Frontend/lms
npm run build
cd ../..
```

## Step 6: Start Backend with PM2

```bash
cd Backend

# Start backend server
pm2 start index.js --name lms-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it gives you (usually sudo env PATH=...)

cd ..
```

## Step 7: Serve Frontend with PM2

```bash
cd Frontend/lms

# Install serve globally
sudo npm install -g serve

# Serve the built frontend
pm2 serve dist 5173 --spa --name lms-frontend

# Save PM2 configuration
pm2 save

cd ../..
```

## Step 8: Configure Nginx (Optional but Recommended)

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/lms
```

Add this configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;  # or use IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # or use IP

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/lms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 9: Update Environment Variables

If using domain names, update the environment files:

**Backend/.env:**
```env
FRONTEND_URL=http://yourdomain.com
```

**Frontend/lms/.env:**
```env
VITE_BACKEND_URL=http://api.yourdomain.com
```

Then rebuild and restart:

```bash
# Rebuild frontend
cd Frontend/lms
npm run build
cd ../..

# Restart services
pm2 restart all
```

## Step 10: Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Certbot will automatically configure Nginx for HTTPS
```

Update environment variables to use HTTPS:

**Backend/.env:**
```env
FRONTEND_URL=https://yourdomain.com
```

**Frontend/lms/.env:**
```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

Rebuild and restart again.

## Useful PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs lms-backend
pm2 logs lms-frontend

# Restart services
pm2 restart lms-backend
pm2 restart lms-frontend
pm2 restart all

# Stop services
pm2 stop lms-backend
pm2 stop lms-frontend

# Delete services
pm2 delete lms-backend
pm2 delete lms-frontend

# Monitor
pm2 monit
```

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Add to `Backend/.env` as `MONGODB_URI`

### Option 2: Local MongoDB on EC2
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Use in .env
MONGODB_URI=mongodb://localhost:27017/lms
```

## Troubleshooting

### Check if services are running:
```bash
pm2 status
```

### Check logs:
```bash
pm2 logs
```

### Check ports:
```bash
sudo netstat -tulpn | grep LISTEN
```

### Restart everything:
```bash
pm2 restart all
sudo systemctl restart nginx
```

### Update code from Git:
```bash
cd ~/lms-hackathon
git pull

# Rebuild frontend
cd Frontend/lms
npm install
npm run build
cd ../..

# Restart backend
cd Backend
npm install
pm2 restart lms-backend
cd ..

# Restart frontend
pm2 restart lms-frontend
```

## Access Your Application

- **Frontend**: http://your-ec2-public-ip (or http://yourdomain.com)
- **Backend API**: http://your-ec2-public-ip:3000 (or http://api.yourdomain.com)

## Security Recommendations

1. **Use environment variables** for sensitive data
2. **Setup firewall** (UFW):
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```
3. **Regular updates**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
4. **Use SSL/HTTPS** for production
5. **Setup MongoDB authentication** if using local MongoDB
6. **Use strong passwords** and keys
7. **Regular backups** of your database

## Monitoring

```bash
# Install htop for system monitoring
sudo apt install htop
htop

# Monitor PM2 processes
pm2 monit

# Check disk space
df -h

# Check memory
free -h
```

---

**Your LMS is now deployed on AWS EC2!** 🚀
