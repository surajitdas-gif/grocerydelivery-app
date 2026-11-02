
require("dotenv").config();

// Environment Validation
const envValidator = require("./utils/envValidator");
envValidator();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Production Middleware
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/ProductRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/address");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Database Connection
connectDB();

// Security and Performance Middleware
app.use(helmet()); // Sets secure headers, disables x-powered-by
app.use(compression()); // Gzip payload compression
app.use(morgan("combined")); // Request logging

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use("/api", limiter); // Apply to API routes

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["*"]; // Fallback to * if not specified in env

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check Endpoint (Versioned)
app.get("/api/v1/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.status(200).json({
    success: true,
    message: "Food Saver Backend Running",
    dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Alias old health check for backward compatibility
app.get("/", (req, res) => res.redirect("/api/v1/health"));

// API Versioning Setup
const v1Router = express.Router();

// Mount Routes on v1Router
v1Router.use("/auth", authRoutes);
v1Router.use("/orders", orderRoutes);
v1Router.use("/products", productRoutes);
v1Router.use("/upload", uploadRoutes);
v1Router.use("/cart", cartRoutes);
v1Router.use("/address", addressRoutes);
v1Router.use("/admin", adminRoutes);
v1Router.use("/reports", reportRoutes);

// Mount main routes under /api/v1 and alias to /api for backward compatibility
app.use("/api/v1", v1Router);
app.use("/api", v1Router); // Backward compatibility

app.use("/chat", chatRoutes); // Keep chat at root level as before

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// Middleware to authenticate socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; 
    } catch (err) {
      console.log("Invalid socket token");
    }
  }
  // Proceed to support backward compatibility for unauthenticated sockets
  next();
});

io.on("connection", (socket) => {
  let userId = socket.handshake.query.userId;
  
  if (socket.user && socket.user.id) {
    userId = socket.user.id;
  }

  if (userId && socket.user) {
    socket.join(userId);
    console.log(`Authenticated user ${userId} joined their private room.`);
  } else if (userId) {
    console.log(`Unauthenticated client tried to join room ${userId} - Denied.`);
  } else {
    console.log(`Socket Connected: ${socket.id} (Unauthenticated)`);
  }

  socket.on("send-location", (data) => {
    // Ensure only authenticated users can send locations
    if (!socket.user) {
       console.log("Unauthorized location send attempt");
       return;
    }
    // Send location only to the specific order's user room
    if (data.userId) {
      io.to(data.userId).emit("receive-location", data);
    }
  });

  socket.on("order-status", (data) => {
    // Ensure only authenticated users can update order status
    if (!socket.user) {
       console.log("Unauthorized order-status send attempt");
       return;
    }
    if (data.userId) {
      io.to(data.userId).emit("order-status-updated", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket Disconnected: ${socket.id}`);
  });
});

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API Route Not Found" });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown
const shutdown = () => {
  console.log('SIGTERM/SIGINT received. Shutting down gracefully...');
  
  server.close(() => {
    console.log('HTTP server closed.');
    
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after 10s');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);