const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const VERIFY_SID = process.env.TWILIO_VERIFY_SID;

// SIGNUP
const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role
    } = req.body;

    if ((!email && !phone) || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      role: role || "user",
      isPhoneVerified: true
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: newUser
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


const login = async (req, res) => {

  try {

    const {
      email,
      phone,
      password
    } = req.body;

    const user = await User.findOne(
      email ? { email } : { phone }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


const updateProfile = async (req, res) => {

  try {

    const {
      name,
      phone,
      address
    } = req.body;

    const updatedUser =
      await User.findByIdAndUpdate(
        req.user._id,
        {
          name,
          phone,
          address
        },
        {
          new: true
        }
      );

    res.json(updatedUser);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


const logout = (req, res) => {

  res.json({
    success: true,
    message: "Logout successful"
  });

};

// SEND OTP —
const sendOtp = async (req, res) => {

  try {

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number required"
      });
    }

    // Twilio Verify sends the SMS automatically
    const verification = await twilioClient.verify.v2
      .services(VERIFY_SID)
      .verifications
      .create({
        to: phone,       // must be E.164 format e.g. +919876543210
        channel: "sms"  // sends a real SMS
      });

    console.log(`Twilio Verify started for ${phone} — status: ${verification.status}`);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error("SEND OTP ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// VERIFY OTP (FOR SIGNUP) — checks the code via Twilio Verify
const verifyOtp = async (req, res) => {

  try {

    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required"
      });
    }

    const check = await twilioClient.verify.v2
      .services(VERIFY_SID)
      .verificationChecks
      .create({
        to: phone,
        code: otp
      });

    console.log(`Twilio Verify check for ${phone} — status: ${check.status}`);

    if (check.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (error) {

    console.error("VERIFY OTP ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// LOGIN WITH OTP — verifies code via Twilio, then logs the user in
const loginWithOtp = async (req, res) => {

  try {

    const { phone, otp, role } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required"
      });
    }

    // 1. Check OTP with Twilio Verify
    const check = await twilioClient.verify.v2
      .services(VERIFY_SID)
      .verificationChecks
      .create({
        to: phone,
        code: otp
      });

    console.log(`Twilio login check for ${phone} — status: ${check.status}`);

    if (check.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // 2. Find the user by phone
    const user = await User.findOne({
      phone,
      ...(role ? { role } : {})
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found for this phone number. Please sign up first."
      });
    }

    // 3. Issue JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user
    });

  } catch (error) {

    console.error("LOGIN WITH OTP ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  signup,
  login,
  updateProfile,
  logout,
  sendOtp,
  verifyOtp,
  loginWithOtp
};







