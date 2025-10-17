import express from "express";
import {
  addLectures,
  getLectures,
  updateLecture,
  deleteLecture,
  createcourse,
  getCourses,
  deleteCourse,
} from "../controllers/CourseControllers.js";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getCourseAssignments,
  toggleAssignmentStatus,
  updateAssignment,
} from "../controllers/assignmentControllers.js";
import {
  getTeacherStats,
  updateCoursesInstructor,
} from "../controllers/TeacherControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard stats
router.get("/dashboard-stats", authenticateToken, getTeacherStats);
router.post(
  "/update-courses-instructor",
  authenticateToken,
  updateCoursesInstructor
);

router.get("/get-all-courses", getCourses);
router.get("/courses/:courseId/lectures", getLectures);
router.get("/courses/:courseId/assignments", getCourseAssignments);
router.get("/assignments/:assignmentId", getAssignmentById);

router.post("/courses/add-new-course", authenticateToken, createcourse);
router.post("/courses/:courseId/assignments", createAssignment);
router.post("/courses/:courseId/lectures", addLectures);

import { updateCourse } from "../controllers/CourseControllers.js";
router.put("/courses/:courseId", authenticateToken, updateCourse);
router.put("/lectures/:lectureId", updateLecture);
router.put("/assignments/:assignmentId", updateAssignment);

router.delete("/courses/:courseId/lectures/:lectureId", deleteLecture);
router.delete("/courses/:courseId/assignments/:assignmentId", deleteAssignment);
router.delete("/courses/:courseId", deleteCourse);

router.patch(
  "/assignments/:assignmentId/toggle-status",
  toggleAssignmentStatus
);

export default router;
