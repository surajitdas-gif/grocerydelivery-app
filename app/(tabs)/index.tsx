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
    {
      name: 'Rice',
      image:
        'https://images.unsplash.com/photo-1705147289789-6df2593f1b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
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

  // ✅ UPDATED: Banner slider images
  const banners = [
    'https://images.unsplash.com/photo-1718547962969-c893b5367450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    'https://images.unsplash.com/photo-1506617420156-8e4536971650?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.delivery}>Deliver in 10 mins 🚀</Text>
      <Text style={styles.location}>📍 Rampur Village, Sitapur</Text>

      <TextInput
        placeholder="Search vegetables, fruits, milk..."
        style={styles.searchBar}
      />

      {/* ✅ UPDATED: Horizontal slider */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        {banners.map((item, index) => (
          <Image
            key={index}
            source={{ uri: item }}
            style={styles.sliderBanner}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Shop by Category</Text>

      <View style={styles.categoryContainer}>
        {categories.map((item, index) => (
          <View key={index} style={styles.categoryCard}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Best Sellers</Text>

      {products.map((item, index) => (
        <ProductCard
          key={index}
          name={item.name}
          image={item.image}
          price={item.price}
          quantity={item.quantity}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 40,
  },
  delivery: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    color: 'gray',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  // ✅ UPDATED: slider banner style
  sliderBanner: {
    width: 300,
    height: 150,
    borderRadius: 15,
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  categoryText: {
    marginTop: 8,
    fontWeight: 'bold',
  },
});