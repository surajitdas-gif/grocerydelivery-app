
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cartRoutes = require('./routes/cart');
const addressRoutes = require('./routes/address');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

const Order = require("./models/Order");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/api/address', addressRoutes);
app.use('/api/admin', adminRoutes);
app.use(
  '/api/reports',
  reportRoutes
);

// ROUTES
app.use("/api", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/cart', cartRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running");
});

// MONGODB CONNECTION
mongoose
  .connect("mongodb://127.0.0.1:27017/villageDelivery")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// CREATE HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // LIVE LOCATION UPDATE
  socket.on("send-location", (data) => {
    console.log("Location received:", data);

    io.emit("receive-location", data);
  });

  // ORDER STATUS UPDATE
  socket.on("order-status", (data) => {
    io.emit("order-status-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MAKE IO AVAILABLE GLOBALLY
app.set("io", io);

const SUPPORT_PHONE = '+91 9876543210';

const SUPPORT_EMAIL =
  'dasantu@gmail.com';

app.post('/chat', async (req, res) => {

  try {

    const userMessage = req.body.message;

    const lowerMsg =
      userMessage.toLowerCase();


    // HUMAN SUPPORT

    if (
      lowerMsg.includes('human') ||
      lowerMsg.includes('agent') ||
      lowerMsg.includes('support')
    ) {

      return res.json({
        reply:
          `You can contact our support team:\n\n📞 ${SUPPORT_PHONE}\n📧 ${SUPPORT_EMAIL}`,
      });

    }


    // TRACK ORDER
    if (
      lowerMsg.includes('track') ||
      lowerMsg.includes('order status')
    ) {

      const latestOrder = await Order
        .findOne()
        .sort({ createdAt: -1 });

      if (!latestOrder) {

        return res.json({
          reply:
            'No active orders found for tracking.',
        });

      }

      return res.json({
        reply:
          `Your latest order status is "${latestOrder.status}" 🚚`,
      });

    }
    // CHANGE ADDRESS

    if (
      lowerMsg.includes('change address') ||
      lowerMsg.includes('delivery address')
    ) {

      return res.json({
        reply:
          'You can change your delivery address before order confirmation.',
      });

    }

    console.log("User Message:", userMessage);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are an AI assistant for a food delivery app.

Help users politely and briefly.

User:
${userMessage}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(
      "Gemini Response:",
      JSON.stringify(data, null, 2)
    );

    // HANDLE API ERROR

    if (data.error) {

      return res.json({
        reply:
          "AI service quota exceeded. Please try again later.",
      });

    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // HANDLE EMPTY RESPONSE

    if (!reply) {

      return res.json({
        reply:
          "AI could not generate a response.",
      });

    }

    res.json({
      reply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply:
        "Server error while contacting AI.",
    });

  }

});


// START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});