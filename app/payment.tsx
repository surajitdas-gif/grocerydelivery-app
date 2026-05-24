
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';

import { useCart } from '../src/context/CartContext';

export default function PaymentScreen() {
  const { cart, checkout } = useCart();

  const params = useLocalSearchParams();

  // LOCATION
  const lat = params.lat ? String(params.lat) : '';
  const lng = params.lng ? String(params.lng) : '';
  const address = params.address
    ? String(params.address)
    : '';

  // USER INFO
  const name = params.name
    ? String(params.name)
    : '';

  const phone = params.phone
    ? String(params.phone)
    : '';

  const altPhone = params.altPhone
    ? String(params.altPhone)
    : '';

  const [method, setMethod] =
    useState('UPI');

  const [loading, setLoading] =
    useState(false);

  // TOTAL
  const subtotal =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
        (item.qty || 1),
      0
    );

  const deliveryFee =
    subtotal < 500 ? 13 : 0;

  const platformFee = 2;

  const total =
    subtotal +
    deliveryFee +
    platformFee;

  // 🔥 OPEN UPI APP
  const openUPI = async () => {
    try {
      const upiUrl =
        `upi://pay?pa=dasantu0118-2@oksbi` +
        `&pn=Village Grocery` +
        `&am=${total}` +
        `&cu=INR`;

      const supported =
        await Linking.canOpenURL(
          upiUrl
        );

      if (!supported) {
        Alert.alert(
          'No UPI app found'
        );
        return false;
      }

      await Linking.openURL(upiUrl);

      return true;

    } catch (error) {
      console.log(error);

      Alert.alert(
        'Failed to open UPI app'
      );

      return false;
    }
  };

  const createOrder = async () => {

    try {

      setLoading(true);

      const userData =
        await AsyncStorage.getItem(
          'user'
        );

      const user = userData
        ? JSON.parse(userData)
        : null;

      if (!user || !user._id) {
        Alert.alert('User not found');
        return;
      }

      const payload = {
        userId: user._id,

        items: cart,

        total,

        address:
          address || 'No address',

        paymentMethod: method,
        paymentReceived:
          method === 'COD'
            ? false
            : true,

        userLocation: {
          lat: Number(lat),
          lng: Number(lng),
        },

        customerName: name,

        customerPhone: phone,

        customerAltPhone: altPhone,
      };


      const BASE_URL =
        'https://grocerydelivery-backend.onrender.com/api';

      const res = await fetch(
        `${BASE_URL}/orders/place-order`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (data.success) {

        checkout();

        Alert.alert(
          'Order Successful ✅'
        );

        router.replace('/orders');

      } else {

        Alert.alert(
          'Order failed'
        );

      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Order failed'
      );

    } finally {

      setLoading(false);

    }

  };

  // 🔥 MAIN PAYMENT FUNCTION
  const handlePayment = async () => {
    try {
      if (cart.length === 0) {
        Alert.alert('Cart is empty');
        return;
      }

      if (!lat || !lng) {
        Alert.alert(
          'Location missing'
        );
        return;
      }

      if (!name || !phone) {
        Alert.alert(
          'User details missing'
        );
        return;
      }

      // 🔥 OPEN UPI FIRST
      if (method === 'UPI') {

        const opened =
          await openUPI();

        if (!opened) return;

        Alert.alert(
          'Payment Confirmation',
          'Did you complete the payment?',
          [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => {
                console.log(
                  'Payment cancelled'
                );
              },
            },

            {
              text: 'Yes',
              onPress: async () => {

                await createOrder();

              },
            },
          ]
        );

        return;
      }
      setLoading(true);

      const userData =
        await AsyncStorage.getItem(
          'user'
        );

      const user = userData
        ? JSON.parse(userData)
        : null;

      if (!user || !user._id) {
        Alert.alert('User not found');
        return;
      }

      // ORDER PAYLOAD
      const payload = {
        userId: user._id,

        items: cart,

        total,

        address:
          address || 'No address',

        paymentMethod: method,
        paymentReceived:
          method === 'COD'
            ? false
            : true,

        userLocation: {
          lat: Number(lat),
          lng: Number(lng),
        },

        customerName: name,

        customerPhone: phone,

        customerAltPhone: altPhone,
      };

      console.log(
        '📤 SENDING:',
        payload
      );

      const res = await fetch(
        'https://grocerydelivery-backend.onrender.com/api/orders/place-order',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data = await res.json();

      console.log(
        '📦 ORDER RESPONSE:',
        data
      );

      if (data.success) {
        checkout();

        Alert.alert(
          'Order Successful ✅',
          method === 'UPI'
            ? 'UPI Payment Initiated'
            : `Payment via ${method}`
        );

        router.replace('/orders');

      } else {
        Alert.alert(
          'Order failed'
        );
      }

    } catch (error) {
      console.log(
        '❌ PAYMENT ERROR:',
        error
      );

      Alert.alert(
        'Payment failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Payment 💳
      </Text>

      {/* USER INFO */}
      <Text style={styles.address}>
        👤 {name || 'No Name'}
      </Text>

      <Text style={styles.address}>
        📞 {phone || 'No Phone'}
      </Text>

      {altPhone ? (
        <Text style={styles.address}>
          ☎️ {altPhone}
        </Text>
      ) : null}

      {/* ADDRESS */}
      <Text style={styles.address}>
        📍{' '}
        {address ||
          'No address selected'}
      </Text>

      {/* TOTAL */}
      <Text style={styles.amount}>
        ₹{total}
      </Text>

      {/* PAYMENT OPTIONS */}
      {['UPI', 'Card', 'COD'].map(
        (type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.option,
              method === type &&
              styles.active,
            ]}
            onPress={() =>
              setMethod(type)
            }
          >
            <Text
              style={
                styles.optionText
              }
            >
              {type}
            </Text>
          </TouchableOpacity>
        )
      )}

      {/* PAY BUTTON */}
      <TouchableOpacity
        style={[
          styles.payBtn,
          loading && {
            opacity: 0.6,
          },
        ]}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.payText}>
          {loading
            ? 'Processing...'
            : method === 'UPI'
              ? `Pay ₹${total} with UPI`
              : `Place Order ₹${total}`}
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