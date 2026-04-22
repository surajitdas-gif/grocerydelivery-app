import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCart } from './context/CartContext';

export default function PaymentScreen() {
  const { cart, checkout } = useCart();

  const [method, setMethod] = useState('UPI');

  const total =
    cart.reduce(
      (sum, item) => sum + item.price * (item.qty || 1),
      0
    ) + 35;

  const handlePayment = async () => {
    try {
      if (cart.length === 0) {
        Alert.alert('Cart is empty');
        return;
      }

      console.log('Payment clicked');

      const user = JSON.parse(
        (await AsyncStorage.getItem('user')) || '{}'
      );

      console.log('User:', user);

      const address = user.address || 'No address';

      const res = await fetch(
        'http://172.20.10.4:5000/api/orders/place-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
            items: cart,
            total,
            address,
            paymentMethod: method,
          }),
        }
      );

      const data = await res.json();

      console.log('Order saved:', data);

      if (data.success) {
        checkout();

        Alert.alert(
          'Order Successful ✅',
          `Payment via ${method}`
        );

        setTimeout(() => {
          router.push('/screens/OrdersScreen' as any);
        }, 500);
      } else {
        Alert.alert('Order failed');
      }

    } catch (error) {
      console.log('Payment error:', error);
      Alert.alert('Payment failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment 💳</Text>

      <Text style={styles.amount}>₹{total}</Text>

      <TouchableOpacity
        style={[
          styles.option,
          method === 'UPI' && styles.active,
        ]}
        onPress={() => setMethod('UPI')}
      >
        <Text style={styles.optionText}>UPI</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          method === 'Card' && styles.active,
        ]}
        onPress={() => setMethod('Card')}
      >
        <Text style={styles.optionText}>Card</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          method === 'COD' && styles.active,
        ]}
        onPress={() => setMethod('COD')}
      >
        <Text style={styles.optionText}>Cash on Delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.payBtn}
        onPress={handlePayment}
      >
        <Text style={styles.payText}>Pay ₹{total}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },

  amount: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },

  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 14,
  },

  active: {
    borderColor: '#16a34a',
    backgroundColor: '#dcfce7',
  },

  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },

  payBtn: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  payText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
});