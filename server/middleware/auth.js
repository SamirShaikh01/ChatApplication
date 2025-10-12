import { verifyToken } from "../lib/utils.js";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check for Bearer prefix
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No or invalid token format",
      });
    }

    // ✅ Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    // ✅ Verify token and fetch user
    const userId = verifyToken(token);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.log("Middleware Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
