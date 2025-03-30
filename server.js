import "dotenv/config";
import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import {connectDB} from "./configs/mongoDBConfig.js";

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/user', authRoutes);
app.use('/resume',resumeRoutes);
app.use('/jobs', jobRoutes);

//configs
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on pot: ${PORT}`);
});
