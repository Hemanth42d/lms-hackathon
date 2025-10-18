// Test script to check if there are submissions and assignments in the database
import mongoose from "mongoose";
import Submission from "./models/submission-model.js";
import Assignment from "./models/assignment-model.js";

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb://admin:password@localhost:27017/lms?authSource=admin"
    );

    console.log("Connected to MongoDB");

    // Check assignments
    const totalAssignments = await Assignment.countDocuments();
    console.log("Total assignments in database:", totalAssignments);

    const assignments = await Assignment.find();
    console.log("\nAll assignments:");
    assignments.forEach((assignment, index) => {
      console.log(`${index + 1}. Title: ${assignment.title}`);
      console.log(`   Type: ${assignment.type}`);
      console.log(`   Course ID: ${assignment.courseId}`);
      console.log(`   Assignment ID: ${assignment._id}`);
      console.log(`   Due Date: ${assignment.dueDate}`);
      console.log("---");
    });

    // Check submissions
    const totalSubmissions = await Submission.countDocuments();
    console.log("\nTotal submissions in database:", totalSubmissions);

    // Get all submissions
    const submissions = await Submission.find()
      .populate("studentId", "firstName lastName userName email")
      .populate("assignmentId", "title type");

    console.log("All submissions:");
    submissions.forEach((sub, index) => {
      console.log(
        `${index + 1}. Assignment: ${sub.assignmentId?.title} (${
          sub.assignmentId?.type
        })`
      );
      console.log(
        `   Student: ${sub.studentId?.firstName} ${sub.studentId?.lastName} (${sub.studentId?.userName})`
      );
      console.log(
        `   Score: ${sub.score}/${sub.maxScore} (${sub.percentage}%)`
      );
      console.log(`   Submitted: ${sub.createdAt}`);
      console.log(`   Assignment ID: ${sub.assignmentId?._id}`);
      console.log("---");
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkDatabase();
