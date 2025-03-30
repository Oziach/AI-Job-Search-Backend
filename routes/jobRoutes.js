import express from "express";
import {
  extractResumeText,
  analyzeResumeWithDeepSeek,
} from "../utils/resumeAnalysisUtils.js";
import { findMatchingJobs } from "../utils/jobsUtils.js";
import { fileURLToPath } from "url";
import path from "path";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testResumePath = path.join(__dirname, "..", "uploads", "testResume.pdf");

// Upload Endpoint
router.post("/fetch", async (req, res) => {
    try {
      const { token } = req.body; // Get token from request body
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided", success: false });
      }
  
      var decoded = "sup";
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token", success: false });
      }
  
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
      }
  
      const matchedJobs = await findMatchingJobs(user.skills, 0.25);
  
      res.json({ matchedJobs, success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", success: false });
    }
  });
export default router;
