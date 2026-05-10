const express = require('express');

const router = express.Router();

const Cart = require('../models/Cart');


// =================================================
// GET USER CART
// =================================================

router.get('/:userId', async (req, res) => {

  try {

    const cart =
      await Cart.findOne({
        userId: req.params.userId,
      });

    if (!cart) {

      return res.json({
        items: [],
      });
    }

    res.json(cart);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
});


// =================================================
// SAVE USER CART
// =================================================

router.post('/save', async (req, res) => {

  try {

    const {
      userId,
      items,
    } = req.body;

    let cart =
      await Cart.findOne({
        userId,
      });

    if (cart) {

      cart.items = items;

      await cart.save();

    } else {

      cart = new Cart({
        userId,
        items,
      });

      await cart.save();
    }

    res.json({
      success: true,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
});


// =================================================
// CLEAR CART
// =================================================

router.delete('/:userId', async (req, res) => {

  try {

    await Cart.findOneAndDelete({
      userId: req.params.userId,
    });

    res.json({
      success: true,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;