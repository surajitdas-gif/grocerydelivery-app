import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

export default function CartScreen() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: 25,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1725483990707-1584a62acd0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      id: 2,
      name: 'Fresh Milk',
      price: 28,
      quantity: 2,
      image:
        'https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
  ]);

  const increaseQty = (id: number) => {
    setCart(
      cart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart(
      cart.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + 35;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>My Cart 🛒</Text>
      <Text style={styles.delivery}>Delivery in 10 mins 🚀</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        cart.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>₹{item.price}</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => decreaseQty(item.id)}
                >
                  <Text>-</Text>
                </TouchableOpacity>

                <Text>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => increaseQty(item.id)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={styles.billBox}>
        <Text style={styles.billTitle}>Bill Details</Text>

        <View style={styles.billRow}>
          <Text>Subtotal</Text>
          <Text>₹{subtotal}</Text>
        </View>

        <View style={styles.billRow}>
          <Text>Delivery Fee</Text>
          <Text>₹30</Text>
        </View>

        <View style={styles.billRow}>
          <Text>Platform Fee</Text>
          <Text>₹5</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.total}>Total</Text>
          <Text style={styles.total}>₹{total}</Text>
        </View>

        <TextInput
          placeholder="Apply coupon"
          style={styles.input}
        />

        <TouchableOpacity style={styles.checkout}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
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
    fontWeight: 'bold',
  },

  delivery: {
    color: '#666',
    marginBottom: 18,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
    alignItems: 'center',
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  price: {
    fontWeight: 'bold',
    marginVertical: 6,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  qtyBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  remove: {
    color: 'red',
    fontSize: 13,
  },

  billBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
  },

  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  total: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },

  checkout: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },

  checkoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  emptyCart: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyText: {
    fontSize: 20,
    color: '#666',
  },
});