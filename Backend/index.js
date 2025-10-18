import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import "./config/db-connection.js";
import userRoutes from "./routes/userRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import courseRoute from "./routes/courseRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();

// Configure CORS with multiple allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://anthro-learn.vercel.app", // Your Vercel deployment
  "https://anthro-learn-git-main.vercel.app", // Vercel preview deployments
  "https://*.vercel.app", // All Vercel deployments
  "http://localhost:5173", // Local development
  "http://localhost:3000", // Alternative local port
  "http://localhost:4173", // Vite preview
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list or matches Vercel pattern
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (allowedOrigin === origin) return true;
        if (allowedOrigin.includes("*")) {
          const pattern = allowedOrigin.replace("*", ".*");
          return new RegExp(pattern).test(origin);
        }
        return false;
      });

      if (isAllowed || process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url} from ${
      req.get("origin") || "no-origin"
    }`
  );
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", userRoutes);
app.use("/api", courseRoute);
app.use("/api/teacher", teacherRoutes);
app.use("/api", aiRoutes);
app.use("/api/video", videoRoutes);

// Enhanced health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "AnthroLearn API is running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth/*",
      courses: "/api/course/*",
      teacher: "/api/teacher/*",
      ai: "/api/ai/*",
      video: "/api/video/*",
    },
  });
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
