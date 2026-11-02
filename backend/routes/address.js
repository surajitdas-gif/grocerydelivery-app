const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getUserAddress,
  saveAddress
} = require("../controllers/addressController");

router.get("/:userId", protect, getUserAddress);
router.post("/save", protect, saveAddress);

module.exports = router;