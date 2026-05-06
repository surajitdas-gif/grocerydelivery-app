

const express = require('express');
const router = express.Router();

const Order = require('../models/Order');
const User = require('../models/User');


// ==============================
// PLACE ORDER
// ==============================
router.post('/place-order', async (req, res) => {

  try {

    console.log(
      "📦 BODY RECEIVED:",
      req.body
    );

    const {
      userId,
      items,
      total,
      address,
      paymentMethod,
      userLocation,
      customerName,
      customerPhone,
      customerAltPhone,
    } = req.body;

    // VALIDATION
    if (!userId || !total) {

      return res.status(400).json({
        message:
          'Missing required fields',
      });
    }

    // CREATE ORDER
    const newOrder = new Order({

      userId,

      items: items || [],

      total,

      address: address || '',

      paymentMethod:
        paymentMethod || 'UPI',

      status: 'Preparing',

      userLocation:
        userLocation || {
          lat: 0,
          lng: 0,
        },

      // CUSTOMER INFO
      customerName:
        customerName || "",

      customerPhone:
        customerPhone || "",

      customerAltPhone:
        customerAltPhone || "",

      // DELIVERY INFO
      deliveryBoy: '',

      deliveryPhone: '',

      deliveryBoyId: '',

      deliveryLocation: {
        lat: 0,
        lng: 0,
      },
    });

    await newOrder.save();

    console.log(
      "✅ SAVED ORDER:",
      newOrder
    );

    // SOCKET UPDATE
    const io =
      req.app.get("io");

    if (io) {

      io.emit(
        "newOrder",
        newOrder
      );
    }

    res.json({
      success: true,
      order: newOrder,
    });

  } catch (error) {

    console.log(
      "❌ ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
});


// ==============================
// USER ORDERS
// ==============================
router.get(
  '/my-orders/:userId',
  async (req, res) => {

    try {

      const orders =
        await Order.find({
          userId:
            req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(orders);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ==============================
// ALL ORDERS
// ==============================
router.get(
  '/all-orders',
  async (req, res) => {

    try {

      const orders =
        await Order.find().sort({
          createdAt: -1,
        });

      console.log(
        "📦 ALL ORDERS:",
        orders.length
      );

      res.json(orders);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ==============================
// UPDATE STATUS
// ==============================
router.put(
  '/status/:id',
  async (req, res) => {

    try {

      const {
        status,
        deliveryBoyId,
      } = req.body;

      if (!deliveryBoyId) {

        return res.status(400).json({
          message:
            "deliveryBoyId missing",
        });
      }

      // CHECK ORDER
      const existingOrder =
        await Order.findById(
          req.params.id
        );

      if (!existingOrder) {

        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      // CHECK USER
      const user =
        await User.findById(
          deliveryBoyId
        );

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });
      }

      // UPDATE ORDER
      const updatedOrder =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status,

            deliveryBoyId,

            deliveryBoy:
              user.name || "",

            deliveryPhone:
              user.phone || "",
          },
          {
            new: true,
          }
        );

      // SOCKET UPDATE
      const io =
        req.app.get("io");

      if (io) {

        io.emit(
          "orderUpdated",
          updatedOrder
        );
      }

      res.json(updatedOrder);

    } catch (error) {

      console.log(
        "❌ STATUS ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ==============================
// UPDATE DELIVERY LOCATION
// ==============================
router.put(
  '/update-location/:id',
  async (req, res) => {

    try {

      const lat =
        Number(req.body.lat);

      const lng =
        Number(req.body.lng);

      // VALIDATE
      if (!lat || !lng) {

        return res.status(400).json({
          message:
            "Invalid coordinates",
        });
      }

      // UPDATE LOCATION
      const updatedOrder =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            deliveryLocation: {
              lat,
              lng,
            },
          },
          {
            new: true,
          }
        );

      // SOCKET UPDATE
      const io =
        req.app.get("io");

      if (io) {

        io.emit(
          "locationUpdated",
          {
            orderId:
              req.params.id,

            location: {
              lat,
              lng,
            },
          }
        );
      }

      res.json(updatedOrder);

    } catch (error) {

      console.log(
        "❌ LOCATION ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// ==============================
// TRACK ORDER
// ==============================
router.get(
  '/track/:id',
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({
          message:
            'Order not found',
        });
      }

      console.log(
        "📍 TRACK ORDER:",
        order.deliveryLocation
      );

      res.json({

        deliveryLocation:
          order.deliveryLocation,

        status:
          order.status,

        userLocation:
          order.userLocation,
      });

    } catch (error) {

      console.log(
        "❌ TRACK ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;