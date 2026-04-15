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
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantity: {
    color: 'gray',
    fontSize: 13,
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});