const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// ✅ SIGNUP (Register a new user)
router.post("/signup", async (req, res) => {
    try {
        const { loginId, username, email, password, securityQuestion, securityAnswer } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ loginId }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Login ID or Email already exists" });
        }

        // Hash password & security answer
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

        // Create new user
        const newUser = new User({
            loginId,
            username,
            email,
            password: hashedPassword,
            securityQuestion,
            securityAnswer: hashedSecurityAnswer,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


router.post("/signin", async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Find user
        const user = await User.findOne({ loginId });
        if (!user) {
            return res.status(400).json({ message: "Invalid login ID or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid login ID or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // console.log("User logged in:", user); // Debugging log

        res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                loginId: user.loginId,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// ✅ GET SECURITY QUESTION
router.get("/get-security-question/:loginId", async (req, res) => {
    try {
        const { loginId } = req.params;

        // Find user
        const user = await User.findOne({ loginId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ securityQuestion: user.securityQuestion });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ VERIFY SECURITY QUESTION
router.post("/verify-security", async (req, res) => {
    try {
        const { loginId, securityQuestion, securityAnswer } = req.body;

        // Find user
        const user = await User.findOne({ loginId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check security question
        if (user.securityQuestion !== securityQuestion) {
            return res.status(400).json({ message: "Security question is incorrect" });
        }

        // Verify security answer
        const isAnswerCorrect = await bcrypt.compare(securityAnswer, user.securityAnswer);
        if (!isAnswerCorrect) {
            return res.status(400).json({ message: "Security answer is incorrect" });
        }

        res.json({ message: "Security question verified successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { loginId, newPassword } = req.body;

        // Find user
        const user = await User.findOne({ loginId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash new password (Fix applied here)
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save(); // Ensure the new password is saved

        res.json({ message: "Password reset successful. Try logging in with your new password!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

  


module.exports = router;


