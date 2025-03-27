import Job from "../models/Job.js";

export async function findMatchingJobs(resumeSkills, minMatchScore = 0.1) {
    try {
        // MongoDB aggregation to calculate match scores directly
        const jobs = await Job.aggregate([
            {
                $addFields: {
                    jobSkills: { $concatArrays: [["$category"], "$tags"] }, // Merge category and tags
                },
            },
            {
                $addFields: {
                    matchingSkills: {
                        $setIntersection: ["$jobSkills", resumeSkills], // Find common skills
                    },
                },
            },
            {
                $addFields: {
                    matchScore: {
                        $divide: [{ $size: "$matchingSkills" }, { $size: "$jobSkills" }], // matchScore = matchingSkills / jobSkills
                    },
                },
            },
            {
                $match: {
                    matchScore: { $gte: minMatchScore }, // Only keep jobs above threshold
                },
            },
            {
                $sort: { matchScore: -1 }, // Sort by matchScore (descending)
            },
        ]);

        return jobs;
    } catch (error) {
        console.error("Error finding matching jobs:", error.message);
        throw error;
    }
}