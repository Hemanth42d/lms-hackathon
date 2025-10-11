import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetOTP,
  resetPassword,
} from "../controllers/AuthControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/send-password-reset-otp", sendPasswordResetOTP);
router.post("/reset-password", resetPassword);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "API routes are working!",
    timestamp: new Date(),
  });
});

export default router;
