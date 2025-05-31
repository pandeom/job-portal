import express from "express";
import { getRecommendedJobs } from "../controllers/ai.controller.js"; // Import controller function

const router = express.Router();

// Define route to get AI job recommendations
router.get("/recommendations/:userId", getRecommendedJobs);

export default router;