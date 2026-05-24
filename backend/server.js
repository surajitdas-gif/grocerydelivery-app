require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB =
require("./config/db");

// ROUTES
const authRoutes =
require("./routes/authRoutes");

const orderRoutes =
require("./routes/orderRoutes");

const productRoutes =
require("./routes/ProductRoutes");

const uploadRoutes =
require("./routes/uploadRoutes");

const cartRoutes =
require("./routes/cart");

const addressRoutes =
require("./routes/address");

const adminRoutes =
require("./routes/adminRoutes");

const reportRoutes =
require("./routes/reportRoutes");

const chatRoutes =
require("./routes/chatRoutes");

const app =
express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api",authRoutes);

app.use(
"/api/orders",
orderRoutes
);

app.use(
"/api/products",
productRoutes
);

app.use(
"/api/upload",
uploadRoutes
);

app.use(
"/api/cart",
cartRoutes
);

app.use(
"/api/address",
addressRoutes
);

app.use(
"/api/admin",
adminRoutes
);

app.use(
"/api/reports",
reportRoutes
);

app.use(
"/chat",
chatRoutes
);

app.get(
"/",
(req,res)=>{
res.send(
"Backend running"
);
}
);

const server =
http.createServer(
app
);

const io =
new Server(
server,
{
cors:{
origin:"*",
methods:[
"GET",
"POST"
]
}
}
);

app.set(
"io",
io
);

io.on(
"connection",
(socket)=>{

socket.on(
"send-location",
(data)=>{
io.emit(
"receive-location",
data
);
}
);

socket.on(
"order-status",
(data)=>{
io.emit(
"order-status-updated",
data
);
}
);

}
);

const PORT =
process.env.PORT
||
5000;

server.listen(
PORT,
"0.0.0.0",
()=>{
console.log(
`Server running on ${PORT}`
);
}
);