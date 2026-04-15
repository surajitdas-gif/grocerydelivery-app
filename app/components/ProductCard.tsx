import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  quantity: string;
}

export default function ProductCard({
  name,
  image,
  price,
  quantity,
}: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.quantity}>{quantity}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{price}</Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },

  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },

  content: {
    padding: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  quantity: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    marginBottom: 10,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111',
  },

  button: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});