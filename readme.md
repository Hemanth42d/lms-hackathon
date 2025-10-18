# AnthroLearn 🎓

## Learning Management System - Hackathon Project

# Project Description 📝

AnthroLearn is a comprehensive Learning Management System (LMS) developed for a hackathon competition. This platform enables seamless interaction between students, teachers, and administrators with features including course management, video lectures, assignments with auto-grading, real-time discussions, and AI-powered video summarization.

The platform is built using the **MERN stack** and deployed on **AWS EC2** for production hosting with PM2 process management.

## 👥 Team Members

- **M V Hemanth** - Full Stack Developer & DevOps
- **G Monish Reddy** - Testing & Deployment
- **D Bharath** - Frontend & Design

<hr/>

## Table of Contents

| Section                                        | Description                           |
| ---------------------------------------------- | ------------------------------------- |
| [AnthroLearn Features](#anthrolearn-features-) | 🎯 Key features and capabilities      |
| [Tech Stack](#tech-stack-)                     | 💻🔧 Technologies used in the project |
| [Project Structure](#project-structure-)       | 📁 Overview of project organization   |
| [System Architecture](#system-architecture-)   | � Overview of the system architecture |
| [Database Schema](#database-schema-)           | 🗂 Database models and relationships   |
| [React Features](#react-features-)             | ⚛️ React hooks and libraries used     |
| [Deployment](#deployment-)                     | 🚀 AWS EC2 deployment setup           |
| [Live Application](#live-application-)         | 🌐 Access the deployed application    |

## AnthroLearn Features 🎯

### 🎓 For Students:

- **Course Enrollment & Learning**: Browse and enroll in courses with interactive video lectures
- **Assignment System**: Complete assignments with auto-grading functionality
- **Video Player**: Universal video player supporting YouTube, Google Drive, and direct video links
- **AI Video Summarization**: Get AI-powered summaries of lecture videos using Gemini API
- **Progress Tracking**: Real-time progress tracking with mark-as-complete functionality
- **Dashboard**: Personalized dashboard with course progress and notifications

### 👨‍🏫 For Teachers:

- **Course Management**: Create, update, and manage courses with multimedia content
- **Assignment Creation**: Design assignments with auto-grading capabilities
- **Student Analytics**: Monitor student progress and engagement
- **Discussion Moderation**: Manage course discussions and student interactions

### 👨‍💼 For Administrators:

- **User Management**: Manage students, teachers, and system users
- **System Analytics**: Overview of platform usage and performance

## Tech Stack 💻🔧

### Frontend 🎨:

- **React.js** - Interactive user interface with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Context** - State management for auth and courses
- **React Icons** - Comprehensive icon library

### Backend ⚙️:

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Gemini AI API** - Video summarization AI service

### DevOps & Deployment 🚀:

- **AWS EC2** - Cloud computing platform for hosting
- **PM2** - Production process manager for Node.js
- **MongoDB Atlas** - Cloud database service
- **Nginx** - Reverse proxy and web server (optional)
- **Git** - Version control and deployment

### Development Tools 🛠️:

- **ESLint** - Code linting
- **Git** - Version control
- **VS Code** - Development environment

## Project Structure 📁

```
lms-hackathon/
├── Backend/                    # Node.js Express server
│   ├── config/                # Database configuration
│   ├── controllers/           # API route handlers
│   ├── middleware/            # Authentication middleware
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies
├── Frontend/lms/             # React application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context providers
│   │   └── utils/           # Frontend utilities
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── AWS_SETUP.md             # AWS EC2 deployment guide
├── setup-aws.sh             # Automated deployment script
└── README.md                # Project documentation
```

## System Architecture 🏰

AnthroLearn follows a modern **3-tier architecture** with clear separation of concerns:

### 🎨 **Frontend Layer**

- **React.js** with Vite for fast development and optimized builds
- **Tailwind CSS** for responsive and modern UI design
- **Context API** for state management (Auth & Course contexts)
- **React Router** for client-side navigation
- **Universal Video Player** supporting multiple video formats
- **Real-time progress tracking** with instant UI updates

### ⚙️ **Backend Layer**

- **Node.js & Express.js** RESTful API server
- **JWT Authentication** with middleware protection
- **Auto-grading system** for assignments
- **Gemini AI integration** for video summarization
- **File upload handling** with Multer
- **Real-time progress tracking** APIs

### 🛢️ **Database Layer**

- **MongoDB** with Mongoose ODM
- **Flexible schema design** for courses, users, and progress
- **Optimized queries** for performance
- **Data relationships** between users, courses, lectures, and progress

### 🚀 **Infrastructure Layer**

- **AWS EC2** for production hosting
- **PM2** process manager for auto-restart and monitoring
- **MongoDB Atlas** for cloud database
- **Nginx** (optional) for reverse proxy and SSL

## Database Schema 🗂

AnthroLearn uses a comprehensive MongoDB database design with 8 core collections to manage users, courses, lectures, assignments, and progress tracking.

<img width='100%' src='./screenshots/schema.png' alt='AnthroLearn Database Schema' />

### **Key Features:**

- **Relational Design**: Proper references between collections for data integrity
- **Progress Tracking**: Dedicated models for tracking lecture completion and course progress
- **Flexible Content**: Support for multiple content types (videos, assignments, discussions)
- **Auto-grading**: Assignment submission and grading system
- **User Management**: Comprehensive user profiles with role-based access

## React Features 🎣

### **React Hooks Used:**

- `useState` - Component state management
- `useEffect` - Side effects and lifecycle management
- `useContext` - Access to Auth and Course contexts
- `useParams` - URL parameter extraction
- `useNavigate` - Programmatic navigation
- `useRef` - DOM element references

### **Key React Libraries:**

- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **React Icons** - Comprehensive icon library
- **React Hot Toast** - Toast notifications for user feedback

### **Custom Components:**

- **VideoPlayer** - Universal video player with format detection
- **VideoSummarizer** - AI-powered video summarization
- **AssignmentsTable** - Interactive assignment display
- **CourseCard** - Reusable course display component
- **Navigation Components** - Student/Teacher/Admin dashboards

## Deployment 🚀

### **Live Application 🌐**

The application is currently deployed and accessible at:

- **Frontend**: http://34.227.106.134:5173
- **Backend API**: http://34.227.106.134:3000

### **Deployment Architecture:**

- **Platform**: AWS EC2 (Ubuntu 22.04 LTS)
- **Instance Type**: t2.medium
- **Process Manager**: PM2 for automatic restarts and monitoring
- **Database**: MongoDB Atlas (Cloud)
- **Frontend**: Vite build served with PM2
- **Backend**: Node.js/Express managed by PM2

### **Development Setup:**

```bash
# Clone the repository
git clone https://github.com/Hemanth42d/lms-hackathon.git
cd lms-hackathon

# Install backend dependencies
cd Backend
npm install

# Create Backend .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF

cd ..

# Install frontend dependencies
cd Frontend/lms
npm install

# Create Frontend .env file
cat > .env << EOF
VITE_BACKEND_URL=http://localhost:3000
VITE_GEMINI_API=your_gemini_api_key
EOF

# Start development servers
npm run dev    # Frontend (port 5173)
cd ../../Backend
npm start      # Backend (port 3000)
```

### **AWS EC2 Production Deployment:**

#### **Quick Setup:**

```bash
# On your AWS EC2 instance:

# 1. Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g pm2 serve

# 2. Clone and setup
git clone https://github.com/Hemanth42d/lms-hackathon.git
cd lms-hackathon

# 3. Run automated setup script
./setup-aws.sh
```

#### **Manual Setup:**

```bash
# Backend Setup
cd Backend
npm install
# Create .env file with production values
pm2 start index.js --name lms-backend

# Frontend Setup
cd ../Frontend/lms
npm install
npm run build
pm2 serve dist 5173 --spa --name lms-frontend

# Save PM2 configuration
pm2 save
pm2 startup  # Follow the instructions to enable auto-start
```

#### **AWS Security Group Configuration:**

Ensure the following inbound rules are set:

| Type       | Port | Source    | Description |
| ---------- | ---- | --------- | ----------- |
| SSH        | 22   | Your IP   | SSH access  |
| HTTP       | 80   | 0.0.0.0/0 | HTTP        |
| Custom TCP | 3000 | 0.0.0.0/0 | Backend API |
| Custom TCP | 5173 | 0.0.0.0/0 | Frontend    |

### **PM2 Management Commands:**

```bash
# Check service status
pm2 status

# View logs
pm2 logs
pm2 logs lms-backend
pm2 logs lms-frontend

# Restart services
pm2 restart all
pm2 restart lms-backend
pm2 restart lms-frontend

# Stop services
pm2 stop all

# Monitor processes
pm2 monit
```

### **Updating the Deployment:**

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@34.227.106.134

# Navigate to project
cd ~/lms-hackathon

# Pull latest changes
git pull

# Update Backend
cd Backend
npm install
pm2 restart lms-backend

# Update Frontend
cd ../Frontend/lms
npm install
npm run build
pm2 restart lms-frontend
```

### **Key Environment Variables:**

```env
# Backend (.env)
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lms
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
FRONTEND_URL=http://34.227.106.134:5173
NODE_ENV=production

# Frontend (.env)
VITE_BACKEND_URL=http://34.227.106.134:3000
VITE_GEMINI_API=your_gemini_api_key
```

### **Monitoring & Logs:**

```bash
# View real-time logs
pm2 logs --lines 100

# Check server health
curl http://localhost:3000
curl http://localhost:5173

# Check process status
pm2 status

# View detailed process info
pm2 show lms-backend
pm2 show lms-frontend
```

📖 **For detailed deployment troubleshooting, see [AWS_SETUP.md](./AWS_SETUP.md)**

## Features Highlights 🌟

### **🎥 Advanced Video System:**

- Universal video player supporting YouTube, Google Drive, and direct video links
- Progress tracking with mark-as-complete functionality
- Real-time progress updates

### **📝 Auto-Grading Assignments:**

- Intelligent assignment evaluation system
- Instant feedback for students
- Grade tracking and analytics
- Submission management

### **💬 Discussion Forums:**

- Course-specific discussion boards
- Real-time interaction between students and teachers
- Threaded conversations and replies

### **📊 Analytics Dashboard:**

- Student progress tracking
- Course completion rates
- Assignment performance metrics
- Teacher insights and analytics

### **🔐 Security Features:**

- JWT-based authentication
- Role-based access control (Student/Teacher/Admin)
- Secure API endpoints
- Input validation and sanitization

---

## Live Application 🌐

### **Access the Platform:**

- **Frontend**: [http://34.227.106.134:5173](http://34.227.106.134:5173)
- **Backend API**: [http://34.227.106.134:3000](http://34.227.106.134:3000)

### **Deployment Details:**

- **Hosting**: AWS EC2 (Ubuntu 22.04 LTS)
- **Instance**: t2.medium (2 vCPU, 4GB RAM)
- **Process Manager**: PM2 for high availability
- **Database**: MongoDB Atlas (Cloud)
- **Uptime**: 99.9% with PM2 auto-restart

### **API Health Check:**

```bash
curl http://34.227.106.134:3000
# Response: {"message":"AnthroLearn API Server"}
```

---

## 🚀 **Hackathon Achievement**

This project was developed as part of a hackathon competition, showcasing:

- **Rapid Development** - Complete LMS built in hackathon timeframe
- **Team Collaboration** - Effective coordination between 3 team members
- **Modern Architecture** - Implementation of industry-standard practices
- **Scalable Design** - Built for future enhancements and growth
- **Innovation** - AI integration and modern UX/UI design
- **Production Deployment** - Successfully deployed on AWS EC2

---

_Developed with ❤️ by Team AnthroLearn for the Hackathon 2025_
