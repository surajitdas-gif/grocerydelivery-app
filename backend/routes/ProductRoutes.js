const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
  addProduct,
  searchProduct,
  getAllProducts,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

router.post("/add-product", protect, admin, addProduct);
router.get("/search/:keyword", searchProduct); // Public
router.get("/all-products", getAllProducts); // Public
router.delete("/delete-product/:id", protect, admin, deleteProduct);
router.put("/update-product/:id", protect, admin, updateProduct);

module.exports = router;