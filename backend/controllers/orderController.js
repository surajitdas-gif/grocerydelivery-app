
const Order = require("../models/Order");
const User = require("../models/User");

// ======================================================
// PLACE ORDER
// ======================================================

const placeOrder = async (req, res) => {

  try {

    const {
      items,
      total,
      address,
      paymentMethod,
      userLocation,
      customerName,
      customerPhone,
      customerAltPhone
    } = req.body;

    const finalUserId = req.body.userId || req.user._id.toString();

    if (!total) {
      return res.status(400).json({
        message: "Missing required fields: total"
      });
    }

    if (req.user.role !== "admin" && req.user._id.toString() !== finalUserId.toString()) {
      return res.status(403).json({ message: "Not authorized to place order for this user" });
    }

    const newOrder = new Order({

      userId: finalUserId,

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

      // Send to specific user
      io.to(newOrder.userId).emit(
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

      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .lean();

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

          io.to(updatedOrder.userId).emit(
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

        io.to(updatedOrder.userId).emit(
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

        const order = await Order.findById(req.params.id);
        if (order) {
          io.to(order.userId).emit(
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

      if (req.user.role !== "admin" && req.user._id.toString() !== order.userId.toString()) {
        return res.status(403).json({ message: "Not authorized to track this order" });
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

      if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Not authorized to view these orders" });
      }

      const orders = await Order.find({
        userId: req.params.userId
      })
        .sort({ createdAt: -1 })
        .lean();

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

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (req.user.role !== "admin" && req.user._id.toString() !== order.userId.toString()) {
        return res.status(403).json({ message: "Not authorized to update payment for this order" });
      }

      order.paymentReceived = req.body.paymentReceived;
      await order.save();

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
