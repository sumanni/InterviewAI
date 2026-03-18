// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ── Helper: generate JWT token ──
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ── Helper: send token response ──
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      createdAt: user.createdAt,
    },
  });
};

/* ════════════════════════════════════════
   POST /api/auth/register
   Register a new user
════════════════════════════════════════ */
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Name too long"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      // Validate inputs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      // Create user
      const user = new User({ name, email, password, role: role || "" });
      await user.save();

      sendTokenResponse(user, 201, res);
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: err.message,
      });
    }
  },
);

/* ════════════════════════════════════════
   POST /api/auth/login
   Login existing user
════════════════════════════════════════ */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      // Validate inputs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { email, password } = req.body;

      // Find user and include password
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      sendTokenResponse(user, 200, res);
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
      });
    }
  },
);

/* ════════════════════════════════════════
   GET /api/auth/me
   Get current logged in user
════════════════════════════════════════ */
router.get("/me", authMiddleware, async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      photo: req.user.photo,
      createdAt: req.user.createdAt,
    },
  });
});

/* ════════════════════════════════════════
   PUT /api/auth/update
   Update user profile
════════════════════════════════════════ */
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, role, photo } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, role, photo },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

/* ════════════════════════════════════════
   PUT /api/auth/change-password
   Change user password
════════════════════════════════════════ */
router.put(
  "/change-password",
  authMiddleware,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id).select("+password");

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect.",
        });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully.",
      });
    } catch (err) {
      console.error("Change password error:", err);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
      });
    }
  },
);

/* ════════════════════════════════════════
   DELETE /api/auth/delete
   Delete user account
════════════════════════════════════════ */
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
