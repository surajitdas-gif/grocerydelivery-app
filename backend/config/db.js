const mongoose = require("mongoose");
const dns = require("dns");

// Set reliable public DNS resolvers to prevent querySrv ENOTFOUND / ECONNREFUSED
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if custom DNS servers cannot be set
}

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        maxPoolSize: 100, // Handle up to 100 concurrent DB operations
        minPoolSize: 10,  // Keep 10 warm connections ready for low latency
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxIdleTimeMS: 30000,
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