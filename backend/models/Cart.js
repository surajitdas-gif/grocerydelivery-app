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

cartSchema.index({ userId: 1 });

module.exports =
  mongoose.model(
    'Cart',
    cartSchema
  );