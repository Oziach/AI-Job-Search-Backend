import { extractResumeText } from "./resumeAnalysisUtils.js";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeResumeWithDeepSeek } from "./resumeAnalysisUtils.js";
import axios from "axios";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumePath = path.join(__dirname, "../", "uploads", "testResume.pdf"); // Change filename as needed


extractResumeText(resumePath)
    .then(async (text) => {

        try {
            const analysisResult = await analyzeResumeWithDeepSeek(text);
            console.log(analysisResult);
        } catch (error) {
            console.log("Failed to analyse resume text: ", error);
        }
    })
    .catch(err => console.error("Error extracting text:", err));

