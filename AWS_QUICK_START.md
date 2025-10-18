# 🚀 AWS EC2 Quick Deployment

## Simple 3-Step Deployment

### 1️⃣ Launch EC2 Instance
- **AMI**: Ubuntu 22.04 LTS
- **Instance Type**: t2.medium (minimum)
- **Security Group**: Allow ports 22, 80, 443, 3000, 5173

### 2️⃣ Connect & Setup
```bash
# Connect to your instance
ssh -i your-key.pem ubuntu@<your-ec2-ip>

# Install Node.js and Git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt update && sudo apt install -y nodejs git

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/Hemanth42d/lms-hackathon.git
cd lms-hackathon
```

### 3️⃣ Deploy
```bash
# Run the deployment script
./deploy-aws.sh

# Follow the prompts to:
# - Enter MongoDB connection string (use MongoDB Atlas)
# - Script will automatically setup everything
```

## Access Your Application

After deployment completes:
- **Frontend**: `http://your-ec2-ip:5173`
- **Backend**: `http://your-ec2-ip:3000`

## Management Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Stop services
pm2 stop all
```

## Update Code

```bash
cd ~/lms-hackathon
git pull
./deploy-aws.sh
```

## Full Documentation

See **AWS_DEPLOYMENT_GUIDE.md** for:
- Nginx reverse proxy setup
- SSL/HTTPS configuration
- Domain name setup
- Security best practices
- Troubleshooting guide

---

**Need help?** Check AWS_DEPLOYMENT_GUIDE.md for detailed instructions.
