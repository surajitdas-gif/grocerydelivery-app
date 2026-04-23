const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const razorpay = require('../config/razorpay');

router.post('/place-order', async (req, res) => {
  try {
    const {
      userId,
      items,
      total,
      address,
      paymentMethod,
      userLocation,
    } = req.body;

    if (!userId || !total) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const newOrder = new Order({
      userId,
      items: items || [],
      total,
      address: address || '',
      paymentMethod: paymentMethod || 'UPI',
      status: 'Preparing',

      userLocation: userLocation || {
        lat: 0,
        lng: 0,
      },

      deliveryBoy: '',
      deliveryPhone: '',
      deliveryBoyId: '',

      deliveryLocation: {
        lat: 0,
        lng: 0,
      },
    });

    await newOrder.save();

    res.json({
      success: true,
      order: newOrder,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/my-orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put('/status/:id', async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
      deliveryBoy: req.body.deliveryBoy || '',
      deliveryPhone: req.body.deliveryPhone || '',
      deliveryBoyId: req.body.deliveryBoyId || '',
    });

    res.json({
      message: 'Status updated',
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put('/update-location/:id', async (req, res) => {
  try {
    const { lat, lng } = req.body;

    await Order.findByIdAndUpdate(req.params.id, {
      deliveryLocation: {
        lat,
        lng,
      },
    });

    res.json({
      message: 'Location updated',
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/track/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    res.json({
      deliveryLocation: order.deliveryLocation || {
        lat: 0,
        lng: 0,
      },
      status: order.status || 'Preparing',
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post('/create-payment', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;