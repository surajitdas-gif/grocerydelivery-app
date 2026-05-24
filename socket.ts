import { io } from "socket.io-client";

export const socket = io("https://grocerydelivery-backend.onrender.com", {
  transports: ["websocket"],
});