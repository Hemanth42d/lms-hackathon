import mongoose from "mongoose";
import courseModel from "./models/course-model.js";
import lectureModel from "./models/lecture-model.js";
import userModel from "./models/user-model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/lms"
    );
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const sampleData = async () => {
  await connectDB();

  try {
    // Create a sample user if not exists
    let user = await userModel.findOne({ email: "student@test.com" });
    if (!user) {
      user = await userModel.create({
        userName: "Test Student",
        email: "student@test.com",
        password: "password123",
        role: "Student",
      });
    }

    // Create a sample course if not exists
    let course = await courseModel.findOne({ title: "Sample Course" });
    if (!course) {
      course = await courseModel.create({
        title: "Sample Course",
        description:
          "A sample course for testing the video player functionality",
        category: "Technology",
        instructor: user._id,
        duration: 120,
        thumbnailUrl: "https://via.placeholder.com/300x200",
      });
    }

    // Create sample lectures with various video URL types
    const lectures = [
      {
        title: "Introduction to Programming",
        description: "Learn the basics of programming",
        course: course._id,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // YouTube
        pdfUrl: "https://example.com/intro-programming.pdf",
        pptUrl: "https://example.com/intro-programming.pptx",
        duration: 1800, // 30 minutes
        order: 1,
      },
      {
        title: "Variables and Data Types",
        description: "Understanding variables and different data types",
        course: course._id,
        videoUrl:
          "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view", // Google Drive
        pdfUrl: "https://example.com/variables.pdf",
        pptUrl: "https://example.com/variables.pptx",
        duration: 2400, // 40 minutes
        order: 2,
      },
      {
        title: "Control Structures",
        description: "If statements, loops, and conditional logic",
        course: course._id,
        videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk", // Another YouTube
        pdfUrl: "https://example.com/control-structures.pdf",
        duration: 3000, // 50 minutes
        order: 3,
      },
      {
        title: "Functions and Methods",
        description: "Creating reusable code with functions",
        course: course._id,
        videoUrl:
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Direct video
        pdfUrl: "https://example.com/functions.pdf",
        pptUrl: "https://example.com/functions.pptx",
        duration: 2700, // 45 minutes
        order: 4,
      },
    ];

    // Check if lectures already exist
    const existingLectures = await lectureModel.find({ course: course._id });
    if (existingLectures.length === 0) {
      await lectureModel.insertMany(lectures);
      console.log("Sample lectures created successfully!");
    } else {
      console.log("Lectures already exist, skipping creation.");
    }

    console.log("Sample data setup complete!");
    console.log(`Course ID: ${course._id}`);
    console.log(`User ID: ${user._id}`);

    process.exit(0);
  } catch (error) {
    console.error("Error creating sample data:", error);
    process.exit(1);
  }
};

sampleData();
