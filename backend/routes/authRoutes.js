const express =
require("express");

const router =
express.Router();

const {

signup,
login,
updateProfile,
logout,
sendOtp,
loginWithOtp

} =
require(
"../controllers/authController"
);

router.post(
"/signup",
signup
);

router.post(
"/login",
login
);

router.put(
"/update-profile/:id",
updateProfile
);

router.post(
"/logout",
logout
);

router.post(
"/send-otp",
sendOtp
);

router.post(
"/login-with-otp",
loginWithOtp
);

module.exports =
router;