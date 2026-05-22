const mongoose = require('mongoose');

const reportSchema =
  new mongoose.Schema(
    {
      userId: String,

      userName: String,

      issue: String,

      status: {
        type: String,
        default: 'Pending',
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    'Report',
    reportSchema
  );