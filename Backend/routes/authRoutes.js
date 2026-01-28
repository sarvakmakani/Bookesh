import express from "express";
import user from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", async (req, res,next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(202).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
    // console.log(error);
    // res.status(500).json({ message: "Server error" });
  }
});
router.post("/login", async (req, res,next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
      },
    });
  } catch (error) {
    next(error);
    // console.log(error);
    // res.status(500).json({ message: "Server error" });
  }
});

export default router;
