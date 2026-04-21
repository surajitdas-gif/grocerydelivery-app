import { useCart } from '../context/CartContext';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
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
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const scaleAnim = useState(new Animated.Value(1))[0];

  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      name,
      price,
      quantity,
      image,
    });

    setAdded(true);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.25,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setAdded(false);
    }, 800);
  };

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Hot</Text>
      </View>

      {!imgError ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={{ fontSize: 28 }}>🛒</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <Text style={styles.quantity}>{quantity}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{price}</Text>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.button,
                added && { backgroundColor: '#15803d' },
              ]}
              onPress={handleAdd}
            >
              <Text style={styles.buttonText}>
                {added ? '✓' : '+'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#f1f1f1',
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 2,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  image: {
    width: '100%',
    height: 110,
  },

  imageFallback: {
    width: '100%',
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },

  content: {
    padding: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  quantity: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    marginBottom: 8,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },

  button: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});