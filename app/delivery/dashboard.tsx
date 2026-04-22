import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
      const res = await fetch(
        'http://172.20.10.4:5000/api/orders/all-orders'
      );

      const data = await res.json();

      console.log('Dashboard orders:', data);

      if (Array.isArray(data)) {
        const validOrders = data.filter(
          (order: any) =>
            order.items &&
            order.items.length > 0 &&
            order.total > 0
        );

        setOrders(validOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log('Dashboard error:', error);
    }
  };

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {
      await fetch(
        `http://172.20.10.4:5000/api/orders/status/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      loadOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Delivery Dashboard 🚚</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders available</Text>
      ) : (
        orders.map((order: any, index: number) => (
          <View key={index} style={styles.card}>
            <Text style={styles.order}>
              Order ID: {order._id}
            </Text>

            <Text>User ID: {order.userId}</Text>

            <Text>
              Address: {order.address || 'No address'}
            </Text>

            <Text>Total: ₹{order.total}</Text>

            <Text>
              Payment: {order.paymentMethod || 'UPI'}
            </Text>

            <Text>Status: {order.status}</Text>

            <Text style={styles.itemsTitle}>Items:</Text>

            {order.items.map((item: any, i: number) => (
              <Text key={i}>
                • {item.name} × {item.qty || 1}
              </Text>
            ))}

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  updateStatus(order._id, 'Preparing')
                }
              >
                <Text>Preparing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  updateStatus(order._id, 'Out for Delivery')
                }
              >
                <Text>Out 🚚</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  updateStatus(order._id, 'Delivered')
                }
              >
                <Text>Delivered ✅</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  empty: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },

  card: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  order: {
    fontWeight: '700',
    marginBottom: 6,
  },

  itemsTitle: {
    marginTop: 10,
    fontWeight: '700',
  },

  btnRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
    flexWrap: 'wrap',
  },

  btn: {
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 8,
  },
});