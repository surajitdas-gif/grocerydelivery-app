const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadImage
} = require("../controllers/uploadController");

// Only admins should upload product images
router.post("/", protect, admin, upload.single("image"), uploadImage);

module.exports = router;