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
                    jobSkillsLower: {
                        $map: {
                            input: "$jobSkills",
                            as: "skill",
                            in: { $toLower: "$$skill" }, // Convert each skill to lowercase
                        },
                    },
                },
            },
            {
                $set: {
                    matchingSkills: {
                        $setIntersection: ["$jobSkillsLower", resumeSkills.map(skill => skill.toLowerCase())], // Compare in lowercase
                    },
                },
            },
            {
                $set: {
                    matchScore: {
                        $cond: {
                            if: { $gt: [{ $size: "$jobSkillsLower" }, 0] }, // Prevent division by zero
                            then: { $divide: [{ $size: "$matchingSkills" }, { $size: "$jobSkillsLower" }] },
                            else: 0,
                        },
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