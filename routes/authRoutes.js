import express from 'express'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from '../models/User.js';
import 'dotenv/config';
const router = express.Router();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
};

// Register Route
router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: "User already exists", success: false});
  
      // Create new user
      const newUser = new User({ username, password });
      await newUser.save();
  
       // Generate JWT Token
       const token = generateToken(newUser);
       res.json({ token, username: newUser.username, success: true });

    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message, success:false });
    }
  });

  
// Login Route
router.post("/login", async (req, res) => {
    console.log("Login request recieved");

    try {
      const { username, password } = req.body;
  
      // Find user
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: "Invalid credentials", succes: false });
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials", success: false});
  
      // Generate JWT Token
      const token = generateToken(user);
      console.log("Generated token: ", token);
      res.json({ token, username: user.username, success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message, success:false });
    }
  });
  
 export default router;
  