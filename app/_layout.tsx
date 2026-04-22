import { Stack } from 'expo-router';
import { CartProvider } from './context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="payment"
          options={{
            title: 'Payment',
          }}
        />

        <Stack.Screen
          name="screens/OrdersScreen"
          options={{
            title: 'My Orders',
          }}
        />

        <Stack.Screen
          name="delivery/dashboard"
          options={{
            title: 'Delivery Dashboard',
          }}
        />
      </Stack>
    </CartProvider>
  );
}