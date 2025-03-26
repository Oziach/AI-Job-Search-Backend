const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
const configMulter = () => {
  const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });

  return multer({ storage }); // Return the configured multer instance
};

const upload = configMulter(); // Initialize upload instance

module.exports = { configMulter, upload };
