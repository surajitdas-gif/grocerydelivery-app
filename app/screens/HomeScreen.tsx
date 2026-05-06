
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, router } from 'expo-router';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'http://172.20.10.3:5000/api';

const BANNERS = [
  {
    id: '1',
    tag: 'FRESH TODAY',
    title: 'Farm-fresh\nVegetables',
    emoji: '🥦',
    accent: '#4ade80',
    bg: '#052e16',
    overlay: '#14532d',
  },
  {
    id: '2',
    tag: 'LIMITED OFFER',
    title: 'Seasonal\nFruits',
    emoji: '🥭',
    accent: '#fb923c',
    bg: '#431407',
    overlay: '#7c2d12',
  },
  {
    id: '3',
    tag: 'DAILY DAIRY',
    title: 'Organic\nDairy',
    emoji: '🥛',
    accent: '#60a5fa',
    bg: '#172554',
    overlay: '#1e3a8a',
  },
];

const CATEGORIES = [
  { key: 'All', icon: '✦' },
  { key: 'Vegetables', icon: '🥕' },
  { key: 'Fruits', icon: '🍓' },
  { key: 'Milk', icon: '🥛' },
  { key: 'Beauty', icon: '✨' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadLatestOrder();
      loadProducts();
    }, [])
  );

  // ── API Calls (unchanged logic) ──────────────────────────────────────────

  const loadLatestOrder = async () => {
    try {
      const user = JSON.parse(
        (await AsyncStorage.getItem('user')) || '{}'
      );
      const res = await fetch(
        `${BASE_URL}/orders/my-orders/${user._id}`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLatestOrder(data[0]);
      }
    } catch (error) {
      console.log('Order fetch error:', error);
    }
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${BASE_URL}/products/all-products`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.log('Products fetch error:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const searchProducts = async (text: string) => {
    setSearch(text);
    if (text.length === 0) {
      loadProducts();
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/products/search/${text}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.log('Search error:', error);
    }
  };

  // ── Derived State ────────────────────────────────────────────────────────

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          (item) =>
            item.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  const banner = BANNERS[activeIndex];

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreet}>Good morning 👋</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>Village Delivery</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileOrb}
            onPress={() => router.push('/screens/ProfileScreen' as any)}
          >
            <Text style={styles.profileOrbText}>U</Text>
          </TouchableOpacity>
        </View>

        {/* ── Search ── */}
        <View
          style={[
            styles.searchBar,
            searchFocused && styles.searchBarFocused,
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search vegetables, fruits, dairy…"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            value={search}
            onChangeText={searchProducts}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => searchProducts('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Track Delivery Card ── */}
        <TouchableOpacity
          style={styles.trackCard}
          onPress={() => {
  if (latestOrder?._id) {
    router.push(`/track?id=${latestOrder._id}`);
  } else {
    alert("No active order to track");
  }
}}
          activeOpacity={0.85}
        >
          <View style={styles.trackLeft}>
            <View style={styles.trackIconWrap}>
              <Text style={styles.trackIconText}>🗺</Text>
            </View>
            <View>
              <Text style={styles.trackTitle}>Track Delivery</Text>
              <Text style={styles.trackSub}>Tap to open live route</Text>
            </View>
          </View>
          <View style={styles.trackChevron}>
            <Text style={styles.trackChevronText}>›</Text>
          </View>
        </TouchableOpacity>

        {/* ── Banner ── */}
        <View style={[styles.banner, { backgroundColor: banner.bg }]}>
          <View
            style={[styles.bannerAccentBar, { backgroundColor: banner.overlay }]}
          />
          <View style={styles.bannerContent}>
            <View>
              <View
                style={[
                  styles.bannerTag,
                  { backgroundColor: banner.accent + '22' },
                ]}
              >
                <Text
                  style={[styles.bannerTagText, { color: banner.accent }]}
                >
                  {banner.tag}
                </Text>
              </View>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <TouchableOpacity
                style={[
                  styles.bannerBtn,
                  { backgroundColor: banner.accent },
                ]}
              >
                <Text style={styles.bannerBtnText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
          </View>

          {/* Dots */}
          <View style={styles.bannerDots}>
            {BANNERS.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveIndex(i)}
                style={[
                  styles.dot,
                  i === activeIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* ── Latest Order ── */}
        {latestOrder && (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push('/screens/Orders' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.orderLeft}>
              <View style={styles.orderIconWrap}>
                <Text style={styles.orderIcon}>🚚</Text>
              </View>
              <View>
                <Text style={styles.orderLabel}>Active Order</Text>
                <Text style={styles.orderStatus}>
                  Status:{' '}
                  <Text style={styles.orderStatusValue}>
                    {latestOrder.status}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderAmount}>₹{latestOrder.total}</Text>
              <Text style={styles.orderTrack}>Track ›</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Section Header ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Browse</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* ── Categories ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedCategory(cat.key)}
              style={[
                styles.categoryBtn,
                selectedCategory === cat.key && styles.categoryBtnActive,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.key &&
                    styles.categoryTextActive,
                ]}
              >
                {cat.key}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Products Grid ── */}
        {loadingProducts ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={styles.loaderText}>Loading products…</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySub}>Try a different category or search</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((item, i) => (
              <View key={i} style={styles.gridItem}>
                <ProductCard {...item} />
              </View>
            ))}
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 56,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerGreet: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 3,
    letterSpacing: 0.2,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  locationPin: {
    fontSize: 14,
  },

  locationText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },

  profileOrb: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileOrbText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    gap: 8,
  },

  searchBarFocused: {
    borderColor: '#16a34a',
  },

  searchIcon: {
    fontSize: 16,
  },

  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: '#111827',
  },

  clearIcon: {
    fontSize: 13,
    color: '#9ca3af',
    padding: 4,
  },

  // Track Delivery Card
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  trackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  trackIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trackIconText: {
    fontSize: 20,
  },

  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },

  trackSub: {
    fontSize: 12,
    color: '#9ca3af',
  },

  trackChevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trackChevronText: {
    fontSize: 20,
    color: '#16a34a',
    lineHeight: 26,
  },

  // Banner
  banner: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 170,
  },

  bannerAccentBar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '40%',
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 80,
  },

  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 22,
    paddingBottom: 36,
  },

  bannerTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },

  bannerTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },

  bannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: 14,
  },

  bannerBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },

  bannerBtnText: {
    color: '#052e16',
    fontWeight: '700',
    fontSize: 12,
  },

  bannerEmoji: {
    fontSize: 72,
  },

  bannerDots: {
    position: 'absolute',
    bottom: 12,
    left: 22,
    flexDirection: 'row',
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  dotActive: {
    width: 18,
    backgroundColor: '#fff',
  },

  // Order Card
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },

  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  orderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderIcon: {
    fontSize: 18,
  },

  orderLabel: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  orderStatus: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },

  orderStatusValue: {
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
  },

  orderRight: {
    alignItems: 'flex-end',
  },

  orderAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  orderTrack: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 2,
  },

  // Section Header
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },

  sectionLink: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
  },

  // Categories
  categoryRow: {
    paddingBottom: 16,
    gap: 8,
  },

  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },

  categoryBtnActive: {
    backgroundColor: '#052e16',
    borderColor: '#052e16',
  },

  categoryIcon: {
    fontSize: 14,
  },

  categoryText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#374151',
  },

  categoryTextActive: {
    color: '#4ade80',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  gridItem: {
    width: (width - 48) / 2,
  },

  // Loader
  loader: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },

  loaderText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 52,
  },

  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },

  emptySub: {
    fontSize: 13,
    color: '#9ca3af',
  },
});