import 'dotenv/config'
import aws from "aws-sdk"
import multer from "multer";
import multerS3 from "multer-s3"


// AWS S3 Configuration
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // e.g., "us-east-1"
});

// Configure Multer to Upload to S3
// Configure Multer to Upload to S3
  export const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: "public-read",
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: async (req, file, cb) => {
        try {
          const userId = req.user.id; // Get user ID from authenticated request
          const filename = `resumes/${userId}.pdf`;

          // Delete previous resume if it exists
          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filename,
          }).promise().catch(err => {
            if (err.code !== "NoSuchKey") console.error("S3 Deletion Error:", err);
          });

          cb(null, filename);
        } catch (error) {
          cb(error);
        }
      },
    }),
});


export default upload