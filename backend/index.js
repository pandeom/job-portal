import dotenv from "dotenv";
dotenv.config();  // Moved to the top before other imports
import aiRoute from "./routes/ai.route.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import chatbotRoute from "./routes/chatbot.route.js";
import { chatbotResponse } from './controllers/chatbot.controller.js';
import { getRecommendedJobs } from "./controllers/ai.controller.js";  // ✅ Corrected import

const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Fixed CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5173',  // ✅ Fixed: Removed "https://"
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
app.use(cors(corsOptions));

// APIs
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/chatbot", chatbotRoute);
app.post('/api/chatbot', chatbotResponse);
app.get("/api/recommendations/:userId", getRecommendedJobs);
app.use("/api/v1/ai", aiRoute);

// Serve frontend files
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectDB();
    console.log(`✅ Server running at port ${PORT}`);
});