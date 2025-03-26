require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const configMongoDB = require("./configs/mongoDBConfig")

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/upload',uploadRoutes)

//configs
configMongoDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
