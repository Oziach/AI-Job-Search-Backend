const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/jobs", async (req, res) => {
  const searchQuery = req.query.q || ""; // Example: ?q=react

  try {
    const response = await axios.get(`https://remotive.io/api/remote-jobs?search=${searchQuery}`);
    res.json(response.data.jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

module.exports = router;