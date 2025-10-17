import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetOTP,
  resetPassword,
} from "../controllers/AuthControllers.js";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/UserControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes (maintaining existing URLs)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/send-password-reset-otp", sendPasswordResetOTP);
router.post("/reset-password", resetPassword);

// Protected profile routes
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
router.post("/change-password", authenticateToken, changePassword);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "API routes are working!",
    timestamp: new Date(),
  });
});

export default router;
