// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: "dijegju50",
//   api_key: "358366729127489",
//   api_secret: "Au0sLpPZZ16lbGxzSJP_cVnLzeM",
// });

// module.exports = cloudinary;
const cloudinary =
require("cloudinary").v2;

cloudinary.config({

cloud_name:
process.env.CLOUDINARY_CLOUD_NAME,

api_key:
process.env.CLOUDINARY_API_KEY,

api_secret:
process.env.CLOUDINARY_API_SECRET,

});

module.exports =
cloudinary;