import assignmentModel from "../models/assignment-model.js";
import courseModel from "../models/course-model.js";
import Submission from "../models/submission-model.js";
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

    // Get submission counts for each assignment
    const assignmentsWithCounts = await Promise.all(
      assignments.map(async (assignment) => {
        const submissionCount = await Submission.countDocuments({
          assignmentId: assignment._id,
        });

        return {
          ...assignment.toObject(),
          submissionCount,
        };
      })
    );

    res.json({
      success: true,
      message: "Assignments fetched successfully",
      assignments: assignmentsWithCounts,
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

// Submit assignment with auto-grading
export const submitAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const { answers } = req.body; // Array of selected option indices
    // TODO: Implement proper auth middleware - for now using a default user ID
    const userId = req.user?.id || "670d1bc1ef8d5ba6bd1fb3a6"; // Default student ID

    console.log("Submit assignment - userId:", userId); // Debug log

    // Validate parameters
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid course ID format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid assignment ID format",
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: true,
        message: "Answers array is required",
      });
    }

    // Fetch the assignment
    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        error: true,
        message: "Assignment not found",
      });
    }

    // Verify assignment belongs to the course
    if (assignment.courseId.toString() !== courseId) {
      return res.status(400).json({
        error: true,
        message: "Assignment does not belong to the specified course",
      });
    }

    // Check if assignment is quiz type (only quiz type supports auto-grading)
    if (assignment.type !== "quiz") {
      return res.status(400).json({
        error: true,
        message: "Auto-grading is only available for quiz assignments",
      });
    }

    // Check if student has already submitted this assignment
    const existingSubmission = await Submission.findOne({
      assignmentId: assignmentId,
      studentId: userId,
    });

    if (existingSubmission) {
      return res.status(400).json({
        error: true,
        message:
          "You have already submitted this assignment. Only one submission is allowed.",
      });
    }

    // Check if assignment is still open for submission
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    if (now > dueDate) {
      return res.status(400).json({
        error: true,
        message: "Assignment submission deadline has passed",
      });
    }

    // Validate answers length matches questions length
    if (answers.length !== assignment.questions.length) {
      return res.status(400).json({
        error: true,
        message: `Expected ${assignment.questions.length} answers, received ${answers.length}`,
      });
    }

    // Calculate score with auto-grading
    let totalScore = 0;
    let maxScore = 0;
    const detailedResults = [];

    assignment.questions.forEach((question, index) => {
      const studentAnswer = answers[index];
      const correctAnswer = question.correctAnswer;
      const questionMarks = question.marks || 1;

      maxScore += questionMarks;

      let isCorrect = false;
      if (studentAnswer !== null && studentAnswer !== undefined) {
        isCorrect = parseInt(studentAnswer) === parseInt(correctAnswer);
        if (isCorrect) {
          totalScore += questionMarks;
        }
      }

      detailedResults.push({
        questionIndex: index,
        question: question.question,
        studentAnswer: studentAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        marksAwarded: isCorrect ? questionMarks : 0,
        maxMarks: questionMarks,
      });
    });

    // Calculate percentage
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    // Create and save submission record
    const submissionData = {
      assignmentId: assignmentId,
      courseId: courseId,
      studentId: userId,
      answers: answers,
      score: totalScore,
      maxScore: maxScore,
      percentage: percentage,
      submittedAt: new Date(),
      gradedAt: new Date(),
      autoGraded: true,
      detailedResults: detailedResults,
      status: "graded",
    };

    // Save submission to database
    const submission = new Submission(submissionData);
    await submission.save();

    res.json({
      success: true,
      message: "Assignment submitted and graded successfully",
      submission: {
        assignmentId: assignmentId,
        score: totalScore,
        maxScore: maxScore,
        percentage: percentage.toFixed(2),
        submittedAt: submissionData.submittedAt,
        gradedAt: submissionData.gradedAt,
        autoGraded: true,
      },
      detailedResults: detailedResults,
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Get assignments for a course with student submission status
export const getAssignmentsWithSubmissions = async (req, res) => {
  try {
    const { courseId } = req.params;
    // TODO: Implement proper auth middleware - for now using a default user ID
    const userId = req.user?.id || "670d1bc1ef8d5ba6bd1fb3a6"; // Default student ID

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid course ID format",
      });
    }

    // Get all assignments for the course
    const assignments = await assignmentModel
      .find({ courseId })
      .sort({ createdAt: -1 });

    if (!assignments || assignments.length === 0) {
      return res.json({
        success: true,
        message: "No assignments found for this course",
        assignments: [],
      });
    }

    // Get all submissions for this student for these assignments
    const assignmentIds = assignments.map((assignment) => assignment._id);
    const submissions = await Submission.find({
      assignmentId: { $in: assignmentIds },
      studentId: userId,
    });

    // Create a map of submissions by assignment ID
    const submissionMap = {};
    submissions.forEach((submission) => {
      submissionMap[submission.assignmentId.toString()] = submission;
    });

    // Add submission status to each assignment
    const assignmentsWithStatus = assignments.map((assignment) => {
      const submission = submissionMap[assignment._id.toString()];

      let status = "not_started";
      let score = null;
      let submissionData = null;

      if (submission) {
        status = "completed";
        score = `${submission.score}/${submission.maxScore}`;
        submissionData = {
          score: submission.score,
          maxScore: submission.maxScore,
          percentage: submission.percentage,
          submittedAt: submission.submittedAt,
          detailedResults: submission.detailedResults,
        };
      } else {
        // Check if assignment is overdue
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        if (now > dueDate) {
          status = "overdue";
        }
      }

      return {
        ...assignment.toObject(),
        status,
        score,
        submission: submissionData,
      };
    });

    res.json({
      success: true,
      assignments: assignmentsWithStatus,
    });
  } catch (error) {
    console.error("Error fetching assignments with submissions:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Get specific submission details
export const getSubmissionDetails = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    // TODO: Implement proper auth middleware - for now using a default user ID
    const userId = req.user?.id || "670d1bc1ef8d5ba6bd1fb3a6"; // Default student ID

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(assignmentId)
    ) {
      return res.status(400).json({
        error: true,
        message: "Invalid course or assignment ID format",
      });
    }

    // Get the assignment
    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        error: true,
        message: "Assignment not found",
      });
    }

    // Get the submission
    const submission = await Submission.findOne({
      assignmentId: assignmentId,
      studentId: userId,
    });

    if (!submission) {
      return res.status(404).json({
        error: true,
        message: "No submission found for this assignment",
      });
    }

    res.json({
      success: true,
      submission: {
        submission: {
          assignmentId: submission.assignmentId,
          score: submission.score,
          maxScore: submission.maxScore,
          percentage: submission.percentage,
          submittedAt: submission.submittedAt,
        },
        detailedResults: submission.detailedResults,
      },
      assignment: assignment,
    });
  } catch (error) {
    console.error("Error fetching submission details:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Get assignment submissions for teacher
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid assignment ID format",
      });
    }

    // Verify assignment exists
    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        error: true,
        message: "Assignment not found",
      });
    }

    // Get all submissions for this assignment
    const submissions = await Submission.find({ assignmentId })
      .populate("studentId", "firstName lastName userName email")
      .sort({ submittedAt: -1 });

    // Format submissions for response
    const formattedSubmissions = submissions.map((submission) => {
      const student = submission.studentId;
      return {
        _id: submission._id,
        studentId: student._id,
        studentName:
          `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
          student.userName ||
          "Unknown Student",
        studentEmail: student.email,
        assignmentId: submission.assignmentId,
        submissionType: submission.submissionType || "text",
        submissionData: submission.submissionData,
        submittedAt: submission.submittedAt,
        status: submission.status || "submitted",
        grade: submission.grade,
        feedback: submission.feedback,
        isLate: submission.isLate || false,
        score: submission.score,
        maxScore: submission.maxScore,
        percentage: submission.percentage,
      };
    });

    res.json({
      success: true,
      message: "Assignment submissions fetched successfully",
      submissions: formattedSubmissions,
      total: formattedSubmissions.length,
      assignment: {
        _id: assignment._id,
        title: assignment.title,
        type: assignment.type,
        maxMarks: assignment.maxMarks,
        dueDate: assignment.dueDate,
      },
    });
  } catch (error) {
    console.error("Error fetching assignment submissions:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Get quiz submissions for teacher
export const getQuizSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid assignment ID format",
      });
    }

    // Verify assignment exists and is a quiz
    const assignment = await assignmentModel.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        error: true,
        message: "Assignment not found",
      });
    }

    if (assignment.type !== "quiz") {
      return res.status(400).json({
        error: true,
        message: "This endpoint is only for quiz assignments",
      });
    }

    // Get all quiz submissions for this assignment
    const submissions = await Submission.find({ assignmentId })
      .populate("studentId", "firstName lastName userName email")
      .sort({ submittedAt: -1 });

    // Format quiz submissions for response
    const formattedSubmissions = submissions.map((submission) => {
      const student = submission.studentId;
      return {
        _id: submission._id,
        studentId: student._id,
        studentName:
          `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
          student.userName ||
          "Unknown Student",
        studentEmail: student.email,
        assignmentId: submission.assignmentId,
        answers: submission.submissionData?.answers || [],
        submittedAt: submission.submittedAt,
        status: submission.status || "submitted",
        autoGrade: submission.score,
        totalMarks: assignment.maxMarks,
        isLate: submission.isLate || false,
        score: submission.score,
        maxScore: submission.maxScore,
        percentage: submission.percentage,
        detailedResults: submission.detailedResults,
      };
    });

    res.json({
      success: true,
      message: "Quiz submissions fetched successfully",
      submissions: formattedSubmissions,
      total: formattedSubmissions.length,
      assignment: {
        _id: assignment._id,
        title: assignment.title,
        questions: assignment.questions,
        maxMarks: assignment.maxMarks,
        dueDate: assignment.dueDate,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz submissions:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Grade a submission
export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({
        error: true,
        message: "Invalid submission ID format",
      });
    }

    if (grade === undefined || grade === null) {
      return res.status(400).json({
        error: true,
        message: "Grade is required",
      });
    }

    // Find and update the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        error: true,
        message: "Submission not found",
      });
    }

    // Get assignment to validate grade against maxMarks
    const assignment = await assignmentModel.findById(submission.assignmentId);
    if (!assignment) {
      return res.status(404).json({
        error: true,
        message: "Assignment not found",
      });
    }

    const numericGrade = parseInt(grade);
    if (
      isNaN(numericGrade) ||
      numericGrade < 0 ||
      numericGrade > assignment.maxMarks
    ) {
      return res.status(400).json({
        error: true,
        message: `Grade must be between 0 and ${assignment.maxMarks}`,
      });
    }

    // Update submission with grade and feedback
    submission.grade = numericGrade;
    submission.feedback = feedback || "";
    submission.status = "graded";
    submission.score = numericGrade;
    submission.maxScore = assignment.maxMarks;
    submission.percentage = (numericGrade / assignment.maxMarks) * 100;
    submission.gradedAt = new Date();

    await submission.save();

    res.json({
      success: true,
      message: "Submission graded successfully",
      submission: {
        _id: submission._id,
        grade: submission.grade,
        feedback: submission.feedback,
        status: submission.status,
        percentage: submission.percentage,
      },
    });
  } catch (error) {
    console.error("Error grading submission:", error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
