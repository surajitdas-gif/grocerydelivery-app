const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getCart,
  saveCart,
  clearCart
} = require("../controllers/cartController");

router.get("/:userId", protect, getCart);
router.post("/save", protect, saveCart);
router.delete("/:userId", protect, clearCart);

module.exports = router;