// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },

//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },

//   password: {
//     type: String,
//     required: true,
//   },

//   role: {
//     type: String,
//     enum: ['user', 'delivery', 'admin'],
//     default: 'user',
//   },

//   phone: {
//     type: String,
//     default: '',
//   },

//   address: {
//     type: String,
//     default: '',
//   },

//   profileImage: {
//     type: String,
//     default: '',
//   },
// });

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },

  phone: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: [
      'user',
      'delivery',
      'admin'
    ],
    default: 'user',
  },

  isPhoneVerified: {
    type: Boolean,
    default: false
  },

  address: {
    type: String,
    default: '',
  },

  profileImage: {
    type: String,
    default: '',
  },

},{
timestamps:true
});

module.exports =
mongoose.model(
'User',
userSchema
);