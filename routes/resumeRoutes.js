import express from "express";
import { upload } from "../configs/multerConfig.js";
import { extractSkillsFromResume } from "../utils/resumeAnalysisUtils.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { authenticateUser } from "../configs/authMiddleware.js";

const router = express.Router();

// Upload Endpoint
router.post("/upload",authenticateUser ,upload.single("resume"), async (req, res) => {
  
  try {
      if (!req.file) {
          return res.status(400).json({ message: "No file uploaded", success: false });
      }


      const userId = req.user.id;
        // S3 URL of uploaded file
        const resumePath = req.file.location;

      const skills = await extractSkillsFromResume(resumePath);

      // Update user's skills in the database
      await User.findByIdAndUpdate(userId, { $set: { resume: resumePath, skills } }, { new: true });

      res.json({ message: "File uploaded and skills extracted successfully", file: req.file.location, success: true });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.get("/fetch", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.resume) {
      return res.status(404).json({ message: "No resume found", success: false });
    }
    res.json({ resume: user.resume, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});


export default router;