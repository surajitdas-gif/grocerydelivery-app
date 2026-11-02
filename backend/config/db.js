
const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000, 
      }
    );

    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected!');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

  } catch (error) {

    console.error(
      "MongoDB Connection Error:",
      error.message
    );
    // In production, we typically don't exit the whole app on first db failure if we want auto-reconnect,
    // but on INITIAL startup failure, exiting is standard so the process manager (like PM2/Docker) can restart it.
    process.exit(1);

  }
};

module.exports = connectDB;