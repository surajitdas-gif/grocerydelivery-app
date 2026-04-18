const express = require('express');
const router = express.Router();
const User = require('../models/User');


//create users
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//if user exist login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    res.json({
      message: 'Login successful',
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;