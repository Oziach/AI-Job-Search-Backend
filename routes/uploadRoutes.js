import express from "express";
import { upload } from "../configs/multerConfig.js";

const router = express.Router();

// Upload Endpoint
router.post("/", upload.single("resume"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded", success:false });
    }
    res.json({ message: "File uploaded successfully", file: req.file.filename, success:true});
  });

export default router;