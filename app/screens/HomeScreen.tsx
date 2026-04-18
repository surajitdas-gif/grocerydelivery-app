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
import { router } from 'expo-router';
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
  {
    name: 'Potatoes',
    price: 20,
    quantity: '1 kg',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
  },
  {
    name: 'Onions',
    price: 22,
    quantity: '1 kg',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510',
  },
  {
    name: 'Carrots',
    price: 30,
    quantity: '500 g',
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979',
  },
  {
    name: 'Banana',
    price: 40,
    quantity: '1 dozen',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
  },
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
        <TextInput
          placeholder="Search vegetables, fruits, milk..."
          style={styles.searchInput}
        />
      </View>

      <View style={[styles.bannerSlide, { backgroundColor: banners[activeIndex].bg }]}>
        <View>
          <Text style={styles.bannerSubtitle}>{banners[activeIndex].subtitle}</Text>
          <Text style={styles.bannerTitle}>{banners[activeIndex].title}</Text>
        </View>
        <Text style={styles.bannerEmoji}>{banners[activeIndex].emoji}</Text>
      </View>

      <Text style={styles.sectionTitle}>Shop by Category</Text>

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

      <Text style={styles.sectionTitle}>Best Sellers</Text>

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
    padding: 20,
    marginTop: 48,
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
    fontWeight: '600',
    color: '#111',
  },

  cartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchWrapper: {
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 16,
    marginBottom: 20,
  },

  searchInput: {
    height: 45,
  },

  bannerSlide: {
    width: width - 40,
    height: 140,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bannerSubtitle: {
    color: '#fff',
    fontSize: 12,
  },

  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },

  bannerEmoji: {
    fontSize: 48,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    marginTop: 16,
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
    rowGap: 12,
  },

  bestSellerItem: {
    width: '30%',
    marginBottom: 14,
    alignItems: 'center',
  },
});