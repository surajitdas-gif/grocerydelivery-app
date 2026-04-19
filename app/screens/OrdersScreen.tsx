import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const orders = [
  {
    id: '#FC2041',
    date: 'Today, 9:20 AM',
    status: 'In Transit',
    items: '🍅 Tomatoes ×2, 🥛 Milk ×1',
    total: '₹88',
  },
  {
    id: '#FC2038',
    date: 'Yesterday, 6:15 PM',
    status: 'Delivered',
    items: '🍌 Banana ×1, 🥕 Carrots ×2',
    total: '₹92',
  },
];

export default function OrdersScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Orders 📦</Text>

      {orders.map((order, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.id}>{order.id}</Text>
          <Text>{order.items}</Text>
          <Text>{order.total}</Text>
        </View>
      ))}
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

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },

  id: {
    fontWeight: '700',
    marginBottom: 6,
  },
});