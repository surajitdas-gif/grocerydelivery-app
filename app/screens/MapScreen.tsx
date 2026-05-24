import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../../src/context/CartContext';


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
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);

      const res = await fetch(
        `http://172.20.10.3:5000/api/orders/my-orders/${user._id}`
      );

      const data = await res.json();

      setBackendOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  const finalOrders = [...backendOrders, ...orders];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {finalOrders.map((order: any, index: number) => {


          return (
            <View key={index} style={styles.orderCard}>

              <Text style={styles.orderId}>
                #{(order._id || '').slice(-6)}
              </Text>

              <Text>Status: {order.status}</Text>

              {/* 🔥 TRACK BUTTON */}
              {order.status === "Out for Delivery" && (
                <TouchableOpacity
                  style={styles.trackBtn}
                  onPress={() =>
                    router.push(`/orders/track?id=${order._id}`)
                  }
                >
                  <Text style={styles.trackText}>Track Order 🚚</Text>
                </TouchableOpacity>
              )}

            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  scrollContent: { padding: 20 },

  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  orderId: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  trackBtn: {
    marginTop: 10,
    backgroundColor: "#1d4ed8",
    padding: 10,
    borderRadius: 8,
  },

  trackText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});