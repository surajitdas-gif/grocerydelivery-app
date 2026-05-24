const express =
require("express");

const router =
express.Router();

const {

placeOrder,
getAllOrders,
updateStatus,
updateLocation,
trackOrder,
getMyOrders,
updatePayment

}=require(
"../controllers/orderController"
);

router.post(
"/place-order",
placeOrder
);

router.get(
"/all-orders",
getAllOrders
);

router.put(
"/status/:id",
updateStatus
);

router.put(
"/update-location/:id",
updateLocation
);

router.get(
"/track/:id",
trackOrder
);

router.get(
"/my-orders/:userId",
getMyOrders
);

router.put(
"/payment/:id",
updatePayment
);

module.exports =
router;