const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");

const verifyOtp = async (req, res) => {

    try {

        const { phone, otp } = req.body;

        if (!phone || !otp) {

            return res.status(400).json({

                success: false,
                message: "Phone and OTP required"

            });

        }

        const otpData = await Otp.findOne({ phone });

        if (!otpData) {

            return res.status(400).json({

                success: false,
                message: "OTP not found"

            });

        }

        if (Date.now() > otpData.expiresAt) {

            await Otp.deleteMany({ phone });

            return res.status(400).json({

                success: false,
                message: "OTP expired"

            });

        }

        if (otpData.otp !== otp) {

            return res.status(400).json({

                success: false,
                message: "Wrong OTP"

            });

        }

        const token = jwt.sign(

            {
                phone
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        await Otp.deleteMany({ phone });

        res.json({

            success: true,
            message: "Login success",
            token

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = verifyOtp;