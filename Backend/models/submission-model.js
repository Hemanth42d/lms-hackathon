import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        type: mongoose.Schema.Types.Mixed, // Can be number, string, or other types
        required: true,
      },
    ],
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
      default: Date.now,
    },
    autoGraded: {
      type: Boolean,
      default: false,
    },
    detailedResults: [
      {
        questionIndex: Number,
        question: String,
        studentAnswer: mongoose.Schema.Types.Mixed,
        correctAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        marksAwarded: Number,
        maxMarks: Number,
      },
    ],
    status: {
      type: String,
      enum: ["submitted", "graded", "reviewed"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one submission per student per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

// Index for efficient queries
submissionSchema.index({ courseId: 1, studentId: 1 });
submissionSchema.index({ assignmentId: 1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
