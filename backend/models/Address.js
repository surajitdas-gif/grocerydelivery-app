const mongoose =
  require('mongoose');

const addressSchema =
  new mongoose.Schema({

    userId: {
      type: String,
      required: true,
    },

    name: String,

    phone: String,

    altPhone: String,

    address: String,

    lat: Number,

    lng: Number,

    isDefault: {
      type: Boolean,
      default: true,
    },

  }, {
    timestamps: true,
  });

module.exports =
  mongoose.model(
    'Address',
    addressSchema
  );