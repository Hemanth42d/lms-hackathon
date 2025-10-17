import express from "express";
import {
  getCourses,
  getMyCourses,
  enrollInCourse,
  getLectures,
  markLectureComplete,
  getLectureProgress,
} from "../controllers/CourseControllers.js";
import {
  getCourseAssignments,
  submitAssignment,
  getAssignmentsWithSubmissions,
  getSubmissionDetails,
} from "../controllers/assignmentControllers.js";
import {
  getCourseDiscussions,
  createDiscussion,
} from "../controllers/DiscussionControllers.js";

const router = express.Router();

router.get("/get-all-courses", getCourses);
router.get("/my-courses", getMyCourses);
router.post("/enroll", enrollInCourse);
router.get("/course/:courseId/lectures", getLectures);
router.post(
  "/course/:courseId/lecture/:lectureId/complete",
  markLectureComplete
);
router.get("/course/:courseId/lecture-progress", getLectureProgress);
router.get("/course/:courseId/assignments", getAssignmentsWithSubmissions);
router.post(
  "/course/:courseId/assignments/:assignmentId/submit",
  submitAssignment
);
router.get(
  "/course/:courseId/assignments/:assignmentId/submission",
  getSubmissionDetails
);
router.get("/course/:courseId/discussions", getCourseDiscussions);
router.post("/course/:courseId/discussions", createDiscussion);

export default router;
