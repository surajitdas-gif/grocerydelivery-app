const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: String,
    default: '',
  },

  image: {
    type: String,
    default: '',
  },

  category: {
    type: String,
    default: 'Vegetables',
  },
});

productSchema.index({ category: 1 });
productSchema.index({ name: 1 });

module.exports = mongoose.model('Product', productSchema);