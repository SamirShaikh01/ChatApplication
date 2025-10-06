// Middleware to protect routes

import { verifyToken } from "../lib/utils.js";
import User from "../models/User.js";

export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.headers.token;
        const userId = verifyToken(token)
        const user = await User.findById(userId).select("-password")
       if (!user) return res.status(404).json({ success: false, message: "User not found" });

        //apend this user data into request
        req.user = user;
        next();
    } catch (error) {
       console.log("Middleware Error:", error.message);
    res.status(401).json({ success: false, message: error.message });
    }
}
