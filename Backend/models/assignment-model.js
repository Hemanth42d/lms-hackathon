import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  fileUrl: String,
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      submissionUrl: String,
      submittedAt: Date,
      grade: Number,
      feedback: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Assignment", assignmentSchema);
