const express =
require("express");

const router =
express.Router();

const {

addProduct,
searchProduct,
getAllProducts,
deleteProduct,
updateProduct

} =
require(
"../controllers/productController"
);

router.post(
"/add-product",
addProduct
);

router.get(
"/search/:keyword",
searchProduct
);

router.get(
"/all-products",
getAllProducts
);

router.delete(
"/delete-product/:id",
deleteProduct
);

router.put(
"/update-product/:id",
updateProduct
);

module.exports =
router;