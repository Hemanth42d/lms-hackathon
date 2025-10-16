import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  studentsCount: {
    type: Number,
  },
  assignmentsCount: {
    type: Number,
  },
  discussionsCount: {
    type: Number,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: String,
  thumbnailUrl: String,
  duration: String,
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  assignments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  discussions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
    },
  ],
  price: {
    type: String,
  },
  enrolled: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Course", courseSchema);
