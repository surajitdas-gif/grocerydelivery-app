
const Order = require("../models/Order");
const User = require("../models/User");

// ======================================================
// PLACE ORDER
// ======================================================

const placeOrder = async (req, res) => {

  try {

    const {
      userId,
      items,
      total,
      address,
      paymentMethod,
      userLocation,
      customerName,
      customerPhone,
      customerAltPhone
    } = req.body;

    if (!userId || !total) {

      return res.status(400).json({
        message: "Missing required fields"
      });

    }

    const newOrder = new Order({

      userId,

      items: items || [],

      total,

      address: address || "",

      paymentMethod:
        paymentMethod || "UPI",

      status: "Preparing",

      userLocation:
        userLocation || {
          lat: 0,
          lng: 0
        },

      customerName:
        customerName || "",

      customerPhone:
        customerPhone || "",

      customerAltPhone:
        customerAltPhone || "",

      deliveryBoy: "",
      deliveryPhone: "",
      deliveryBoyId: "",

      deliveryLocation: {
        lat: 0,
        lng: 0
      }

    });

    await newOrder.save();

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
      order: newOrder

    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// ======================================================
// ALL ORDERS
// ======================================================

const getAllOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find()
          .sort({
            createdAt: -1
          });

      res.json(
        orders
      );

    }

    catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };


// ======================================================
// UPDATE STATUS
// ======================================================

const updateStatus =
  async (req, res) => {

    try {

      const {
        status,
        deliveryBoyId
      } = req.body;

      const existingOrder =
        await Order.findById(
          req.params.id
        );

      if (!existingOrder) {

        return res.status(404)
          .json({
            message: "Order not found"
          });

      }

      // ==========================================
      // DELIVERED / CANCELLED
      // ==========================================

      if (
        status === "Delivered"
        ||
        status === "Cancelled"
      ) {

        const updatedOrder =
          await Order.findByIdAndUpdate(

            req.params.id,

            {
              status
            },

            {
              new: true
            }

          );

        const io =
          req.app.get("io");

        if (io) {

          io.emit(
            "orderUpdated",
            updatedOrder
          );

        }

        return res.json(
          updatedOrder
        );

      }

      // ==========================================
      // DELIVERY ASSIGNMENT
      // ==========================================

      let deliveryData = {};

      if (deliveryBoyId) {

        const user =
          await User.findById(
            deliveryBoyId
          );

        if (user) {

          deliveryData = {

            deliveryBoyId,

            deliveryBoy:
              user.name || "",

            deliveryPhone:
              user.phone || ""

          };

        }

      }

      // ==========================================
      // UPDATE ORDER
      // ==========================================

      const updatedOrder =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            status,
            ...deliveryData
          },

          {
            new: true
          }

        );

      const io =
        req.app.get("io");

      if (io) {

        io.emit(
          "orderUpdated",
          updatedOrder
        );

      }

      res.json(
        updatedOrder
      );

    }

    catch (error) {

      res.status(500)
        .json({
          message: error.message
        });

    }

  };


// ======================================================
// UPDATE DELIVERY LOCATION
// ======================================================

const updateLocation =
  async (req, res) => {

    try {

      const lat =
        Number(req.body.lat);

      const lng =
        Number(req.body.lng);

      if (
        isNaN(lat) ||
        isNaN(lng)
      ) {

        return res.status(400).json({
          message:
            "Invalid coordinates"
        });

      }

      const updatedOrder =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            deliveryLocation: {
              lat,
              lng
            }
          },

          {
            new: true
          }

        );

      const io =
        req.app.get("io");

      if (io) {

        io.emit(
          "locationUpdated",
          {
            orderId: req.params.id,

            location: {
              lat,
              lng
            }
          }
        );

      }

      res.json(
        updatedOrder
      );

    }

    catch (error) {

      res.status(500)
        .json({
          message: error.message
        });

    }

  };


// ======================================================
// TRACK ORDER
// ======================================================

const trackOrder =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404)
          .json({
            message: "Order not found"
          });

      }

      res.json({

        deliveryLocation:
          order.deliveryLocation,

        status:
          order.status,

        userLocation:
          order.userLocation

      });

    }

    catch (error) {

      res.status(500)
        .json({
          message: error.message
        });

    }

  };


// ======================================================
// MY ORDERS
// ======================================================

const getMyOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find({

          userId:
            req.params.userId

        })
          .sort({
            createdAt: -1
          });

      const uniqueOrders =
        Array.from(

          new Map(

            orders.map(
              order => [
                order._id.toString(),
                order
              ]
            )

          ).values()

        );

      res.json({

        success: true,
        orders: uniqueOrders

      });

    }

    catch (error) {

      res.status(500)
        .json({

          success: false,
          message: "Failed to fetch orders"

        });

    }

  };


// ======================================================
// PAYMENT
// ======================================================

const updatePayment =
  async (req, res) => {

    try {

      const order =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            paymentReceived:
              req.body.paymentReceived
          },

          {
            new: true
          }

        );

      res.json({

        success: true,
        order

      });

    }

    catch (error) {

      res.status(500)
        .json({

          success: false,
          message: "Payment update failed"

        });

    }

  };


// ======================================================

module.exports = {

  placeOrder,
  getAllOrders,
  updateStatus,
  updateLocation,
  trackOrder,
  getMyOrders,
  updatePayment

};
