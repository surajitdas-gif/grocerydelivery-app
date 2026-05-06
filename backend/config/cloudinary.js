const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dijegju50",
  api_key: "358366729127489",
  api_secret: "Au0sLpPZZ16lbGxzSJP_cVnLzeM",
});

module.exports = cloudinary;