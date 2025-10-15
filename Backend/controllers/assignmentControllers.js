import assignmentModel from "../models/assignment-model.js";
import courseModel from "../models/course-model.js";
import mongoose from "mongoose";

export const createAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      description,
      type,
      dueDate,
      maxMarks,
      questions,
      requirements,
      submissionFormat,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid course ID format",
      });
    }

    if (!title || !description || !type || !dueDate || !maxMarks) {
      return res.status(400).json({
        error: true,
        message:
          "Title, description, type, due date, and max marks are required",
      });
    }

    if (!["quiz", "project"].includes(type.toLowerCase())) {
      return res.status(400).json({
        error: true,
        message: "Assignment type must be either 'quiz' or 'project'",
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        error: true,
        message: `Course with ID ${courseId} not found`,
      });
    }

    let assignmentData = {
      title,
      description,
      type: type.toLowerCase(),
      courseId,
      dueDate: new Date(dueDate),
      maxMarks: parseInt(maxMarks),
      status: "active",
    };

    if (type.toLowerCase() === "quiz") {
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          error: true,
          message: "Quiz must have at least one question",
        });
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (
          !q.question ||
          !q.options ||
          q.options.length < 2 ||
          q.correctAnswer === undefined
        ) {
          return res.status(400).json({
            error: true,
            message: `Question ${
              i + 1
            } is incomplete. Each question must have text, at least 2 options, and a correct answer.`,
          });
        }
      }

      assignmentData.questions = questions;
    } else if (type.toLowerCase() === "project") {
      assignmentData.requirements = requirements || [];
      assignmentData.submissionFormat = submissionFormat || "file";
    }

    const newAssignment = await assignmentModel.create(assignmentData);

    course.assignments = course.assignments || [];
    course.assignments.push(newAssignment._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } assignment created successfully`,
      assignment: newAssignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Get all assignments for a course
export const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid course ID format",
      });
    }

    const assignments = await assignmentModel
      .find({ courseId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Assignments fetched successfully",
      assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Get single assignment by ID
export const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid assignment ID format",
      });
    }

    const assignment = await assignmentModel
      .findById(assignmentId)
      .populate("courseId", "title");

    if (!assignment) {
      return res.status(404).json({
        error: true,
        message: "Assignment not found",
      });
    }

    res.json({
      success: true,
      message: "Assignment fetched successfully",
      assignment,
    });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Update assignment
export const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid assignment ID format",
      });
    }

    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        error: true,
        message: "Assignment not found",
      });
    }

    // Update assignment
    const updatedAssignment = await assignmentModel.findByIdAndUpdate(
      assignmentId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    res.json({
      success: true,
      message: "Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid assignment ID format",
      });
    }

    // Remove assignment from course
    if (courseId) {
      await courseModel.findByIdAndUpdate(courseId, {
        $pull: { assignments: assignmentId },
      });
    }

    // Delete assignment
    await assignmentModel.findByIdAndDelete(assignmentId);

    res.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Toggle assignment status (active/inactive)
export const toggleAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        error: true,
        message: "Assignment not found",
      });
    }

    assignment.status = assignment.status === "active" ? "inactive" : "active";
    await assignment.save();

    res.json({
      success: true,
      message: `Assignment ${
        assignment.status === "active" ? "activated" : "deactivated"
      } successfully`,
      assignment,
    });
  } catch (error) {
    console.error("Error toggling assignment status:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
