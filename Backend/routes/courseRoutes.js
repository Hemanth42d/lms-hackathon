import express from "express";
import { getCourses, getMyCourses, enrollInCourse } from "../controllers/CourseControllers.js";

const router = express.Router();

router.get("/get-all-courses", getCourses);
router.get("/my-courses", getMyCourses);
router.post("/enroll", enrollInCourse);

export default router;
