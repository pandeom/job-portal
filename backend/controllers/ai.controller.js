import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// ✅ Define the getJobRecommendations function
const getJobRecommendations = async (userSkills) => {
    try {
        const jobs = await Job.find().populate("company", "name");

 // Fetch all jobs from the database

        return jobs.map(job => {
            const jobSkills = job.requirements || []; // Ensure job requirements exist
            const commonSkills = userSkills.filter(skill => jobSkills.includes(skill));

            // Calculate a job fit score
            const fitScore = jobSkills.length > 0 ? (commonSkills.length / jobSkills.length) * 100 : 0;
            return {
                ...job.toObject(),
                fitScore: Math.round(fitScore),
                companyName: job.company?.name || "Unknown Company"
 // ✅ Fetch company name
            };
            
        }).sort((a, b) => b.fitScore - a.fitScore); // Sort jobs by highest fit score
    } catch (error) {
        console.error("Error fetching job recommendations:", error);
        return [];
    }
};

export const getRecommendedJobs = async (req, res) => {
    try {
        let userId = req.params.userId.trim(); // ✅ Trim any extra spaces or newlines

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userSkills = user.profile?.skills || [];
        const recommendedJobs = await getJobRecommendations(userSkills); // ✅ Now this function is defined!

        res.json({ jobs: recommendedJobs.slice(0, 5) });
    } catch (error) {
        console.error("Error in job recommendation API:", error);
        res.status(500).json({ message: "Server Error" });
    }
};