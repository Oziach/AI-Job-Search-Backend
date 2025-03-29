import express from "express";
import { extractResumeText, analyzeResumeWithDeepSeek } from "../utils/resumeAnalysisUtils.js";
import { findMatchingJobs } from "../utils/jobsUtils.js";
import { fileURLToPath } from "url";
import path from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testResumePath = path.join(__dirname,'..', 'uploads', 'testResume.pdf');


// Upload Endpoint
router.post("/fetch", async (req, res) => {
    //for now I'll just dump all jobs related to our resume.
    //what should be done instead is get the token from the req, and find corresponding resume/skills
    try{
        const extractedResumeText = await extractResumeText(testResumePath);
        if(!extractedResumeText){
            res.json({message: "Failed to analyze resume!", success: false});
        }

        const resumeData = await analyzeResumeWithDeepSeek(extractedResumeText);
        if(!resumeData){
            res.json({message: "Failed to extract skills!", success:false});
        }

        const skills = resumeData.skills;
        const matchedJobs = await findMatchingJobs(skills, 0.25);
        
        res.json({matchedJobs, success:false});

    } catch (error){
        console.log(error);
        res.json({message: error.message, success:false});
    }

  });

export default router;