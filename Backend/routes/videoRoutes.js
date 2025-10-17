import express from "express";
import { summarizeVideo } from "../controllers/videoControllers.js";

const router = express.Router();

// POST /api/video/summarize
router.post("/summarize", summarizeVideo);

export default router;
