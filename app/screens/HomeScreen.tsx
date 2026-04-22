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
import { router, useFocusEffect } from 'expo-router';
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

const categories = [
  { name: 'Vegetables', emoji: '🥦', bg: '#E8F5E9' },
  { name: 'Fruits', emoji: '🍎', bg: '#FFF3E0' },
  { name: 'Milk', emoji: '🥛', bg: '#E3F2FD' },
  { name: 'Eggs', emoji: '🥚', bg: '#FCE4EC' },
  { name: 'Grains', emoji: '🌾', bg: '#F3E5F5' },
];

const products = [
  {
    name: 'Fresh Tomatoes',
    price: 25,
    quantity: '500 g',
    image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99',
  },
  {
    name: 'Fresh Milk',
    price: 28,
    quantity: '500 ml',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505',
  },
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [latestOrder, setLatestOrder] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadLatestOrder();
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/auth/login');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <View>
          <Text style={styles.deliverLabel}>Delivering to</Text>
          <Text style={styles.location}>📍 Rampur Village, Sitapur</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.cartBtn}>
            <Text>🛒</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search vegetables, fruits, milk..."
          style={styles.searchInput}
        />
      </View>

      <View style={[styles.bannerSlide, { backgroundColor: banners[activeIndex].bg }]}>
        <View>
          <Text style={styles.bannerSubtitle}>{banners[activeIndex].subtitle}</Text>
          <Text style={styles.bannerTitle}>{banners[activeIndex].title}</Text>
          <Text style={styles.shopNow}>Shop now →</Text>
        </View>
        <Text style={styles.bannerEmoji}>{banners[activeIndex].emoji}</Text>
      </View>

      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, activeIndex === i && styles.activeDot]}
          />
        ))}
      </View>

      {latestOrder && (
        <View style={styles.deliveryCard}>
          <Text style={styles.deliverySmall}>
            Your order is {latestOrder.status}
          </Text>
          <Text style={styles.deliveryBig}>
            ₹{latestOrder.total}
          </Text>
          <Text style={styles.deliverySub}>
            Address: {latestOrder.address}
          </Text>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat, i) => (
          <TouchableOpacity key={i} style={styles.categoryCard}>
            <View style={[styles.categoryIconBox, { backgroundColor: cat.bg }]}>
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            </View>
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Best Sellers</Text>
      </View>

      <View style={styles.bestSellerGrid}>
        {products.map((item, i) => (
          <View key={i} style={styles.bestSellerItem}>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },

  deliverLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },

  location: {
    fontSize: 15,
    fontWeight: '700',
  },

  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 16,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    height: 45,
  },

  searchIcon: {
    marginRight: 8,
  },

  bannerSlide: {
    width: width - 32,
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

  shopNow: {
    color: '#fff',
    marginTop: 10,
  },

  bannerEmoji: {
    fontSize: 48,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },

  activeDot: {
    width: 18,
    backgroundColor: '#111',
  },

  deliveryCard: {
    backgroundColor: '#f0fdf4',
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },

  deliverySmall: {
    color: '#16a34a',
    fontSize: 12,
  },

  deliveryBig: {
    fontSize: 20,
    fontWeight: '700',
  },

  deliverySub: {
    color: '#6b7280',
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  seeAll: {
    color: '#1a7a4c',
  },

  categoryCard: {
    alignItems: 'center',
    marginRight: 12,
    width: 80,
  },

  categoryIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryEmoji: {
    fontSize: 28,
  },

  categoryText: {
    fontSize: 12,
    marginTop: 6,
  },

  bestSellerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  bestSellerItem: {
    width: '48%',
    marginBottom: 14,
  },
});