
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  signup,
  login,
  updateProfile,
  logout,
  sendOtp,
  verifyOtp,
  loginWithOtp,
} = require("../controllers/authController");

// Authentication
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// OTP Authentication
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login-with-otp", loginWithOtp);

// Profile
router.put("/update-profile", protect, updateProfile);

module.exports = router;