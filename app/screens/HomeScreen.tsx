import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';

import ProductCard from '../../components/ProductCard';

export default function HomeScreen() {
  const categories = [
    {
      name: 'Vegetables',
      image:
        'https://images.unsplash.com/photo-1725483990707-1584a62acd0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      name: 'Fruits',
      image:
        'https://images.unsplash.com/photo-1624835020719-deec76c86249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      name: 'Milk',
      image:
        'https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
  ];

  const products = [
    {
      name: 'Fresh Tomatoes',
      price: 25,
      quantity: '500 g',
      image:
        'https://images.unsplash.com/photo-1725483990707-1584a62acd0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
    {
      name: 'Fresh Milk',
      price: 28,
      quantity: '500 ml',
      image:
        'https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Text style={styles.delivery}>Deliver in 10 mins 🚀</Text>
      <Text style={styles.location}>📍 Rampur Village, Sitapur</Text>

      <TextInput
        placeholder="Search vegetables, fruits, milk..."
        style={styles.searchBar}
      />

      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
        }}
        style={styles.banner}
      />

      <Text style={styles.sectionTitle}>Shop by Category</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item, index) => (
          <View key={index} style={styles.categoryCard}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Best Sellers</Text>

      {products.map((item, index) => (
        <ProductCard key={index} {...item} />
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

  delivery: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
  },

  location: {
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },

  searchBar: {
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
    fontSize: 15,
  },

  banner: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
    color: '#111',
  },

  categoryCard: {
    width: 100,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 12,
  },

  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  categoryText: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 13,
  },
});