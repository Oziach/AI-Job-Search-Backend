import "dotenv/config";
import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import {connectDB} from "./configs/mongoDBConfig.js";

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/upload',uploadRoutes)

//configs
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
