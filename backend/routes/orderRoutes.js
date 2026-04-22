const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const razorpay = require('../config/razorpay');

router.post('/place-order', async (req, res) => {
  try {
    console.log('Incoming order:', req.body);

    const {
      userId,
      items,
      total,
      address,
      paymentMethod,
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
      deliveryBoy: 'Ravi Kumar',
      deliveryPhone: '9876543210',
    });

    await newOrder.save();

    console.log('Order saved successfully');

    res.json({
      success: true,
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
      deliveryBoy: req.body.deliveryBoy || 'Ravi Kumar',
      deliveryPhone: req.body.deliveryPhone || '9876543210',
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
    console.log('Payment error:', error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;