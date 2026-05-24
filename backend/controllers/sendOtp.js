const axios = require("axios");
const Otp = require("../models/Otp");

const sendOtp = async (req, res) => {

    try {

        const { phone } = req.body;

        if (!phone) {

            return res.status(400).json({
                success: false,
                message: "Phone number required"
            });

        }


        // Generate OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();


        // Send SMS
        await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "otp",
                variables_values: otp,
                numbers: phone
            },
            {
                headers: {
                    authorization: process.env.FAST2SMS_KEY
                }
            }
        );


        // Save in MongoDB
        await Otp.deleteMany({ phone });

        await Otp.create({

            phone,
            otp,

            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            )

        });


        res.json({

            success: true,
            message: "OTP sent successfully"

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = sendOtp;