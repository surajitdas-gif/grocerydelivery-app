// const Otp = require("../models/Otp");
// const jwt = require("jsonwebtoken");

// const verifyOtp = async (req, res) => {

//     try {

//         const { phone, otp } = req.body;

//         if (!phone || !otp) {

//             return res.status(400).json({

//                 success: false,
//                 message: "Phone and OTP required"

//             });

//         }

//         const otpData = await Otp.findOne({ phone });

//         if (!otpData) {

//             return res.status(400).json({

//                 success: false,
//                 message: "OTP not found"

//             });

//         }

//         if (Date.now() > otpData.expiresAt) {

//             await Otp.deleteMany({ phone });

//             return res.status(400).json({

//                 success: false,
//                 message: "OTP expired"

//             });

//         }

//         if (otpData.otp !== otp) {

//             return res.status(400).json({

//                 success: false,
//                 message: "Wrong OTP"

//             });

//         }

//         const token = jwt.sign(

//             {
//                 phone
//             },

//             process.env.JWT_SECRET,

//             {
//                 expiresIn: "7d"
//             }

//         );

//         await Otp.deleteMany({ phone });

//         res.json({

//             success: true,
//             message: "Login success",
//             token

//         });

//     }
//     catch (error) {

//         console.error(error);

//         res.status(500).json({

//             success: false,
//             message: error.message

//         });

//     }

// }

// module.exports = verifyOtp;


// const Otp = require("../models/Otp");
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// const verifyOtp = async (req, res) => {
//   try {
//     const { phone, otp } = req.body;

//     const otpRecord = await Otp.findOne({ phone });

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found",
//       });
//     }

//     if (otpRecord.expiresAt < new Date()) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       });
//     }

//     if (otpRecord.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     let user = await User.findOne({ phone });

//     if (!user) {
//       user = await User.create({
//         phone,
//       });
//     }

//     await Otp.deleteMany({ phone });

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "30d" }
//     );

//     res.json({
//       success: true,
//       token,
//       user,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// module.exports = verifyOtp;