// Create a test submission to verify View Details functionality
import mongoose from "mongoose";
import Submission from "./models/submission-model.js";

async function createTestSubmission() {
  try {
    await mongoose.connect(
      "mongodb://admin:password@localhost:27017/lms?authSource=admin"
    );
    console.log("Connected to MongoDB");

    const testSubmission = new Submission({
      assignmentId: "68ede669ef3f52cc719f13b2", // Recursion Basics Quiz
      courseId: "68edd21ac9309b83815a87a8",
      studentId: "670d1bc1ef8d5ba6bd1fb3a6", // Default student ID
      answers: [0, 1, 2, 0, 1], // Example answers
      score: 85,
      maxScore: 100,
      percentage: 85,
      submittedAt: new Date(),
      gradedAt: new Date(),
      autoGraded: true,
      status: "graded",
      detailedResults: [
        {
          questionIndex: 0,
          question: "What is recursion?",
          studentAnswer: 0,
          correctAnswer: 0,
          isCorrect: true,
          marksAwarded: 20,
          maxMarks: 20,
        },
        {
          questionIndex: 1,
          question: "Base case is important because?",
          studentAnswer: 1,
          correctAnswer: 1,
          isCorrect: true,
          marksAwarded: 20,
          maxMarks: 20,
        },
        {
          questionIndex: 2,
          question: "Recursion uses which data structure?",
          studentAnswer: 2,
          correctAnswer: 1,
          isCorrect: false,
          marksAwarded: 0,
          maxMarks: 20,
        },
        {
          questionIndex: 3,
          question: "Time complexity of factorial recursion?",
          studentAnswer: 0,
          correctAnswer: 0,
          isCorrect: true,
          marksAwarded: 20,
          maxMarks: 20,
        },
        {
          questionIndex: 4,
          question: "Which is better for large inputs?",
          studentAnswer: 1,
          correctAnswer: 1,
          isCorrect: true,
          marksAwarded: 25,
          maxMarks: 20,
        },
      ],
    });

    await testSubmission.save();
    console.log("✅ Test submission created successfully!");
    console.log("Assignment ID:", testSubmission.assignmentId);
    console.log("Student ID:", testSubmission.studentId);
    console.log("Score:", testSubmission.score + "/" + testSubmission.maxScore);

    // Verify it was created
    const count = await Submission.countDocuments();
    console.log("Total submissions now:", count);

    await mongoose.disconnect();
    console.log(
      "\n🎯 Now test the View Details button in the teacher dashboard!"
    );
  } catch (error) {
    console.error("Error:", error);
    await mongoose.disconnect();
  }
}

createTestSubmission();
