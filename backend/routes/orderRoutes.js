const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const razorpay = require('../config/razorpay');

router.post('/place-order', async (req, res) => {
  console.log('Order body:', req.body);

  try {
    const {
      userId,
      items,
      total,
      address,
      paymentMethod,
    } = req.body;

    const newOrder = new Order({
      userId,
      items,
      total,
      address,
      paymentMethod: paymentMethod || 'UPI',
    });

    await newOrder.save();

    res.json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.log('Order save error:', error);

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