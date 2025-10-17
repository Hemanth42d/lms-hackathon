import discussionModel from "../models/discussion-model.js";
import mongoose from "mongoose";

export const getCourseDiscussions = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: true, message: "Invalid course ID" });
    }
    const discussions = await discussionModel
      .find({ course: courseId })
      .populate("author", "userName")
      .populate("replies.author", "userName")
      .sort({ createdAt: -1 });
    return res.json({ success: true, discussions });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { authorId, content, title } = req.body;
    if (!courseId || !authorId || !content) {
      return res.status(400).json({ error: true, message: "courseId, authorId and content are required" });
    }
    const discussion = await discussionModel.create({ course: courseId, author: authorId, content, title });
    return res.status(201).json({ success: true, discussion });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};


