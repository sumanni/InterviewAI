// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Access denied.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token invalid.",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired.",
    });
  }
};
