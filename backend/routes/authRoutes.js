// const express =
// require("express");

// const router =
// express.Router();

// const {

// signup,
// login,
// updateProfile,
// logout,
// sendOtp,
// loginWithOtp

// } =
// require(
// "../controllers/authController"
// );

// router.post(
// "/signup",
// signup
// );

// router.post(
// "/login",
// login
// );

// router.put(
// "/update-profile/:id",
// updateProfile
// );

// router.post(
// "/logout",
// logout
// );

// router.post(
// "/send-otp",
// sendOtp
// );

// router.post(
// "/login-with-otp",
// loginWithOtp
// );

// module.exports =
// router;

const express = require("express");

const router = express.Router();

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
router.put("/update-profile/:id", updateProfile);

module.exports = router;