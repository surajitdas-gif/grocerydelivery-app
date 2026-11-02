const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
  placeOrder,
  getAllOrders,
  updateStatus,
  updateLocation,
  trackOrder,
  getMyOrders,
  updatePayment
} = require("../controllers/orderController");

router.post("/place-order", protect, placeOrder);

// Admin / Delivery routes
router.get("/all-orders", protect, admin, getAllOrders);
router.put("/status/:id", protect, admin, updateStatus);
router.put("/update-location/:id", protect, admin, updateLocation);

// User/General protected routes
router.get("/track/:id", protect, trackOrder);
router.get("/my-orders/:userId", protect, getMyOrders);
router.put("/payment/:id", protect, updatePayment);

module.exports = router;