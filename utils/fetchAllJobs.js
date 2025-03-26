import "dotenv/config";
import mongoose from "mongoose";
import axios from "axios";
import connectDB from "../configs/mongoDBConfig.js"; // Import MongoDB connection
import Job from "../models/Job.js";

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
