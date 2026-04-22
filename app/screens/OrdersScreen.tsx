import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCart } from '../context/CartContext';

export default function OrdersScreen() {
  const [backendOrders, setBackendOrders] = useState<any[]>([]);
  const { orders } = useCart();

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
      const user = JSON.parse(
        (await AsyncStorage.getItem('user')) || '{}'
      );

      const res = await fetch(
        `http://172.20.10.4:5000/api/orders/my-orders/${user._id}`
      );

      const data: any = await res.json();

      console.log('Orders loaded:', data);

      if (Array.isArray(data)) {
        setBackendOrders(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const finalOrders =
    backendOrders.length > 0 ? backendOrders : orders;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Orders 📦</Text>

      {finalOrders.length === 0 ? (
        <Text style={styles.empty}>No orders yet</Text>
      ) : (
        finalOrders.map((order: any, index: number) => (
          <View key={index} style={styles.orderBox}>
            <Text style={styles.id}>
              {order._id || order.id}
            </Text>

            <Text style={styles.date}>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : order.date}
            </Text>

            <Text style={styles.status}>
              Status: {order.status} 🚚
            </Text>

            <Text style={styles.extra}>
              Address: {order.address || 'No address'}
            </Text>

            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, i: number) => (
                <View key={i} style={styles.card}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                  />

                  <View style={styles.info}>
                    <Text style={styles.name}>
                      {item.name}
                    </Text>

                    <Text>
                      Qty: {item.qty || 1}
                    </Text>

                    <Text>
                      ₹{item.price * (item.qty || 1)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.extra}>No items found</Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 35,
  },

  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },

  empty: {
    textAlign: 'center',
    marginTop: 100,
    color: '#666',
    fontSize: 18,
  },

  orderBox: {
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },

  id: {
    fontWeight: '700',
  },

  date: {
    color: '#666',
    marginTop: 4,
  },

  status: {
    color: '#16a34a',
    marginTop: 6,
    marginBottom: 8,
  },

  extra: {
    color: '#555',
    marginBottom: 10,
  },

  card: {
    flexDirection: 'row',
    marginTop: 10,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },

  info: {
    marginLeft: 12,
  },

  name: {
    fontWeight: '700',
  },
});