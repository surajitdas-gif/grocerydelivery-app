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
    default: 'Preparing',
  },

  paymentMethod: {
    type: String,
    default: 'UPI',
  },

  deliveryBoy: {
    type: String,
    default: '',
  },

  deliveryPhone: {
    type: String,
    default: '',
  },

  deliveryLocation: {
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);