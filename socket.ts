import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const socket = io("https://grocerydelivery-backend.onrender.com", {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectSocket = async () => {
  if (socket.connected) return;
  
  const token = await AsyncStorage.getItem("token");
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};