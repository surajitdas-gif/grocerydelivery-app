import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';
import { connectSocket, disconnectSocket } from '@/socket';

export default function RootLayout() {
  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}

