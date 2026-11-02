const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
  createReport,
  getAllReports
} = require("../controllers/reportController");

router.post("/create", protect, createReport);
router.get("/all", protect, admin, getAllReports);

module.exports = router;