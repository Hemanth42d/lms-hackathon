import express from "express";
import { getCourses, getMyCourses, enrollInCourse, getLectures } from "../controllers/CourseControllers.js";
import { getCourseAssignments } from "../controllers/assignmentControllers.js";
import { getCourseDiscussions, createDiscussion } from "../controllers/DiscussionControllers.js";

const router = express.Router();

router.get("/get-all-courses", getCourses);
router.get("/my-courses", getMyCourses);
router.post("/enroll", enrollInCourse);
router.get("/course/:courseId/lectures", getLectures);
router.get("/course/:courseId/assignments", getCourseAssignments);
router.get("/course/:courseId/discussions", getCourseDiscussions);
router.post("/course/:courseId/discussions", createDiscussion);

export default router;
