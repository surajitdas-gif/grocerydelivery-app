const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true,
  },

  items: [
    {
      name: String,
      price: Number,
      quantity: String,
      image: String,
      qty: Number,
    },
  ],

}, {
  timestamps: true,
});

module.exports =
  mongoose.model(
    'Cart',
    cartSchema
  );