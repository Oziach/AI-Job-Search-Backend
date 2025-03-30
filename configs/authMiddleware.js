import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided", success: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = { id: decoded.id }; // Attach user ID to request object
    next(); // Proceed to next middleware (file upload)
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", success: false });
  }
};
