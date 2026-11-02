const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
  getAllOrders,
  updateOrderStatus,
  getAllUsers
} = require("../controllers/adminController");

router.get("/orders", protect, admin, getAllOrders);
router.put("/orders/status/:id", protect, admin, updateOrderStatus);
router.get("/users", protect, admin, getAllUsers);

module.exports = router;