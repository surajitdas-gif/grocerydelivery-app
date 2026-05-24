const express =
require("express");

const router =
express.Router();

const {

getAllOrders,
updateOrderStatus,
getAllUsers

}
=
require(
"../controllers/adminController"
);

router.get(
"/orders",
getAllOrders
);

router.put(
"/orders/status/:id",
updateOrderStatus
);

router.get(
"/users",
getAllUsers
);

module.exports =
router;