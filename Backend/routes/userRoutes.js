import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/AuthControllers.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Testing the connection...");
});

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/logout", logoutUser);

export default router;
