import "dotenv/config";
import { extractResumeText } from "./resumeAnalysisUtils.js";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeResumeWithDeepSeek } from "./resumeAnalysisUtils.js";
import { findMatchingJobs } from "./jobsUtils.js";
import { connectDB } from "../configs/mongoDBConfig.js";

import axios from "axios";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumePath = path.join(__dirname, "../", "uploads", "testResume.pdf"); // Change filename as needed

extractResumeText(resumePath)
    .then(async (text) => {

        try {
            const analysisResult = await analyzeResumeWithDeepSeek(text);
            
            await connectDB();
            console.log("Connected to database");

            const matchingJobs = await findMatchingJobs(analysisResult.skills);
            console.log(matchingJobs.slice(0, 10));
        } catch (error) {
            console.log("Failed to analyse resume text: ", error);
        }
    })
    .catch(err => console.error("Error extracting text:", err));

