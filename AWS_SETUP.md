# AWS EC2 Deployment - Troubleshooting "Connection Refused"

## Quick Fix Checklist

### 1. Check AWS Security Group Settings
Your EC2 instance needs these ports open:

**Go to AWS Console → EC2 → Security Groups → Your Instance's Security Group**

Add these Inbound Rules:
- **Port 22** (SSH) - Source: My IP
- **Port 80** (HTTP) - Source: 0.0.0.0/0 (Anywhere)
- **Port 3000** (Backend) - Source: 0.0.0.0/0 (Anywhere)
- **Port 5173** (Frontend) - Source: 0.0.0.0/0 (Anywhere)

### 2. SSH into Your EC2 Instance
```bash
ssh -i your-key.pem ubuntu@34.227.106.134
```

### 3. Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # Should show v18.x
npm --version

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### 4. Clone and Setup Project
```bash
# Clone your repository
git clone https://github.com/Hemanth42d/lms-hackathon.git
cd lms-hackathon

# Setup Backend
cd Backend
npm install

# Create Backend .env file
nano .env
```

Add this content to Backend/.env:
```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_min_32_characters_long
FRONTEND_URL=http://34.227.106.134:5173
NODE_ENV=production
```

Save and exit (Ctrl+X, Y, Enter)

```bash
cd ..

# Setup Frontend
cd Frontend/lms
npm install

# Create Frontend .env file
nano .env
```

Add this content to Frontend/lms/.env:
```env
VITE_BACKEND_URL=http://34.227.106.134:3000
VITE_GEMINI_API=AIzaSyAQuL4YNl3ggPuNIIYu8idHxgQ4uyKziLQ
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# Build Frontend
npm run build

cd ../..
```

### 5. Start Services with PM2
```bash
# Start Backend
cd Backend
pm2 start index.js --name lms-backend
cd ..

# Start Frontend (using serve)
sudo npm install -g serve
cd Frontend/lms
pm2 serve dist 5173 --spa --name lms-frontend
cd ../..

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it shows
```

### 6. Check if Services are Running
```bash
# Check PM2 status
pm2 status

# Should show:
# lms-backend  | online
# lms-frontend | online

# Check if ports are listening
sudo netstat -tulpn | grep -E '3000|5173'

# Should show:
# tcp  0.0.0.0:3000  (node - backend)
# tcp  0.0.0.0:5173  (node - frontend)
```

### 7. Test Locally First
```bash
# On the EC2 instance, test locally
curl http://localhost:3000
curl http://localhost:5173

# Should get responses
```

### 8. Access from Browser
Now try accessing:
- Frontend: http://34.227.106.134:5173
- Backend: http://34.227.106.134:3000

## Common Issues

### Issue 1: "Connection Refused"
**Cause:** Security Group not configured
**Fix:** Add inbound rules for ports 3000 and 5173

### Issue 2: "npm install fails"
**Cause:** Out of memory
**Fix:** 
```bash
# Create swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Issue 3: "PM2 services not starting"
**Fix:**
```bash
# Check logs
pm2 logs

# Restart services
pm2 restart all

# Delete and recreate
pm2 delete all
# Then start again from step 5
```

### Issue 4: "MongoDB connection error"
**Fix:** Make sure you're using MongoDB Atlas connection string
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dbname
```

## Verify Everything Works

```bash
# 1. Check PM2
pm2 status

# 2. Check logs
pm2 logs lms-backend --lines 20
pm2 logs lms-frontend --lines 20

# 3. Check ports
sudo lsof -i :3000
sudo lsof -i :5173

# 4. Test backend
curl http://localhost:3000

# 5. Test frontend
curl http://localhost:5173
```

## Quick Commands Reference

```bash
# PM2 Management
pm2 status              # Check status
pm2 logs                # View all logs
pm2 logs lms-backend    # Backend logs
pm2 logs lms-frontend   # Frontend logs
pm2 restart all         # Restart all
pm2 stop all            # Stop all
pm2 delete all          # Delete all

# Update Code
cd ~/lms-hackathon
git pull
cd Backend && npm install && pm2 restart lms-backend
cd ../Frontend/lms && npm install && npm run build && pm2 restart lms-frontend
```

## Need More Help?

If still not working:
1. Check PM2 logs: `pm2 logs`
2. Check security groups in AWS Console
3. Verify services are running: `pm2 status`
4. Check firewall: `sudo ufw status` (should be inactive or allow ports)
