const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  items: {
    type: Array,
    required: true,
  },

  total: {
    type: Number,
    required: true,
  },

  address: {
    type: String,
    default: '',
  },

  status: {
    type: String,
    default: 'Pending',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);