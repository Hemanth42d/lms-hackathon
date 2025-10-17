import jwt from "jsonwebtoken";
import userModel from "../models/user-model.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid token - user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: "Invalid or expired token",
    });
  }
};
