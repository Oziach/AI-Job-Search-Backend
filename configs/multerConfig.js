import multer from "multer";
import path from "path";

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

export const upload = configMulter(); // Initialize upload instance

