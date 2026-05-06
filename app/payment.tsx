
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useCart } from '../src/context/CartContext';

export default function PaymentScreen() {
  const { cart, checkout } = useCart();
  const params = useLocalSearchParams();

  // ✅ RECEIVE ALL PARAMS (IMPORTANT FIX)
  const lat = params.lat ? String(params.lat) : '';
  const lng = params.lng ? String(params.lng) : '';
  const address = params.address ? String(params.address) : '';

  // 🔥 THIS WAS MISSING
  const name = params.name ? String(params.name) : '';
  const phone = params.phone ? String(params.phone) : '';
  const altPhone = params.altPhone ? String(params.altPhone) : '';

  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

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

      if (!lat || !lng) {
        Alert.alert('Location missing');
        return;
      }

      if (!name || !phone) {
        Alert.alert('User details missing');
        return;
      }

      setLoading(true);

      console.log("📥 RECEIVED:", { name, phone, altPhone });
      console.log("📍 LOCATION:", lat, lng);

      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      if (!user || !user._id) {
        Alert.alert('User not found');
        return;
      }

      const payload = {
        userId: user._id,
        items: cart,
        total,
        address: address || 'No address',
        paymentMethod: method,

        userLocation: {
          lat: Number(lat),
          lng: Number(lng),
        },

        // 🔥 MAIN FIX (THIS WAS MISSING)
        customerName: name,
        customerPhone: phone,
        customerAltPhone: altPhone,
      };

      console.log("📤 SENDING TO BACKEND:", payload);

      const res = await fetch(
        'http://172.20.10.3:5000/api/orders/place-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      console.log('📦 Order saved:', data);

      if (data.success) {
        checkout();

        Alert.alert(
          'Order Successful ✅',
          `Payment via ${method}`
        );

        router.replace('/orders');
      } else {
        Alert.alert('Order failed');
      }

    } catch (error) {
      console.log('❌ Payment error:', error);
      Alert.alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment 💳</Text>

      {/* 🔥 SHOW USER INFO */}
      <Text style={styles.address}>👤 {name || 'No Name'}</Text>
      <Text style={styles.address}>📞 {phone || 'No Phone'}</Text>
      {altPhone ? (
        <Text style={styles.address}>☎️ {altPhone}</Text>
      ) : null}

      <Text style={styles.address}>
        📍 {address || 'No address selected'}
      </Text>

      <Text style={styles.amount}>₹{total}</Text>

      {['UPI', 'Card', 'COD'].map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.option,
            method === type && styles.active,
          ]}
          onPress={() => setMethod(type)}
        >
          <Text style={styles.optionText}>{type}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.payBtn, loading && { opacity: 0.6 }]}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.payText}>
          {loading ? 'Processing...' : `Pay ₹${total}`}
        </Text>
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
    marginBottom: 20,
  },

  address: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
    color: '#374151',
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