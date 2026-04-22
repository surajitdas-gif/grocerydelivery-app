import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

const banners = [
  {
    id: '1',
    title: 'Farm-fresh vegetables',
    subtitle: 'Fresh today',
    emoji: '🥦',
    bg: '#2d7a4f',
  },
  {
    id: '2',
    title: 'Seasonal fruits',
    subtitle: 'Limited offer',
    emoji: '🥭',
    bg: '#ea580c',
  },
  {
    id: '3',
    title: 'Organic dairy',
    subtitle: 'Daily dairy',
    emoji: '🥛',
    bg: '#3b82f6',
  },
];

const categoryList = [
  'All',
  'Vegetables',
  'Fruits',
  'Milk',
  'Beauty',
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState('All');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadLatestOrder();
      loadProducts();
    }, [])
  );

  const loadLatestOrder = async () => {
    try {
      const user = JSON.parse(
        (await AsyncStorage.getItem('user')) || '{}'
      );

      const res = await fetch(
        `http://172.20.10.4:5000/api/orders/my-orders/${user._id}`
      );

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setLatestOrder(data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(
        'http://172.20.10.4:5000/api/products/all-products'
      );

      const data = await res.json();

      console.log('Products:', data);

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          item =>
            item.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.location}>📍 Village Delivery</Text>

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search products..."
          style={styles.searchInput}
        />
      </View>

      <View
        style={[
          styles.banner,
          { backgroundColor: banners[activeIndex].bg },
        ]}
      >
        <View>
          <Text style={styles.bannerSubtitle}>
            {banners[activeIndex].subtitle}
          </Text>
          <Text style={styles.bannerTitle}>
            {banners[activeIndex].title}
          </Text>
        </View>

        <Text style={styles.bannerEmoji}>
          {banners[activeIndex].emoji}
        </Text>
      </View>

      {latestOrder && (
        <View style={styles.orderCard}>
          <Text style={styles.orderText}>
            Your order is {latestOrder.status}
          </Text>
          <Text>₹{latestOrder.total}</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
      >
        {categoryList.map((cat, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryBtn,
              selectedCategory === cat &&
                styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat &&
                  styles.activeCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.grid}>
        {filteredProducts.map((item, i) => (
          <View key={i} style={styles.item}>
            <ProductCard {...item} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 40,
  },

  location: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },

  searchWrapper: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  searchInput: {
    height: 45,
  },

  banner: {
    height: 150,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bannerSubtitle: {
    color: '#fff',
  },

  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  bannerEmoji: {
    fontSize: 50,
  },

  orderCard: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
  },

  orderText: {
    fontWeight: '700',
  },

  categoryRow: {
    marginTop: 20,
    marginBottom: 16,
  },

  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
  },

  activeCategory: {
    backgroundColor: '#16a34a',
  },

  categoryText: {
    fontWeight: '600',
  },

  activeCategoryText: {
    color: '#fff',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  item: {
    width: '48%',
    marginBottom: 14,
  },
});