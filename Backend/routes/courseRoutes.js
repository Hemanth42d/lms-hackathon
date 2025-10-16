import express from "express";
import { getCourses } from "../controllers/CourseControllers.js";

const router = express.Router();

router.get("/get-all-courses", getCourses);

export default router;
