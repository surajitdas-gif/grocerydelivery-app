const express =
require("express");

const router =
express.Router();

const {

getCart,
saveCart,
clearCart

} = require(
"../controllers/cartController"
);

router.get(
"/:userId",
getCart
);

router.post(
"/save",
saveCart
);

router.delete(
"/:userId",
clearCart
);

module.exports =
router;