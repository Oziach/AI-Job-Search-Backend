const express = require("express");
const {upload} = require("../configs/multerConfig");

const router = express.Router();

// Upload Endpoint
router.post("/", upload.single("resume"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ message: "File uploaded successfully", file: req.file.filename });
  });

  module.exports = router;