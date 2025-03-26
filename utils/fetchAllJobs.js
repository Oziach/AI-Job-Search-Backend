require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const connectDB = require("../configs/mongoDBConfig"); // Import MongoDB connection
const Job = require("../models/Job")

// Fetch and store jobs
const fetchAndStoreJobs = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    console.log("Connected to MongoDB");

    const response = await axios.get("https://remotive.com/api/remote-jobs");
    const jobs = response.data.jobs;

    if (!jobs || jobs.length === 0) {
      console.log("⚠️ No jobs found.");
      return;
    }

    // Insert jobs into MongoDB (avoid duplicates using 'upsert')
    const insertOps = jobs.map((job) => ({
      updateOne: {
        filter: { url: job.url }, // Avoid duplicate jobs
        update: { $set: job },
        upsert: true, // Insert if not exists
      },
    }));

    await Job.bulkWrite(insertOps);
    console.log(`${jobs.length} jobs stored in MongoDB!`);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  } finally {
    mongoose.connection.close(); // Close DB connection after execution
  }
};

// Run the script
fetchAndStoreJobs();
