import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductCard from '../components/ProductCard';

import { socket } from "@/socket";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

// ─── Constants & Theme ────────────────────────────────────────────────────────

const BASE_URL = 'http://172.20.10.3:5000/api';
const { width } = Dimensions.get('window');

// Premium App Palette (Swiggy / Zomato Vibe)
const BRAND = '#FC8019'; // Swiggy Orange
const BRAND_LIGHT = '#FFF0E5';
const BRAND_FAINT = '#FFF9F5';
const BG_MAIN = '#F4F5F7';
const SURFACE = '#FFFFFF';
const TEXT_HEAVY = '#02060C';
const TEXT_MID = '#3E4152';
const TEXT_MUTED = '#686B78';
const BORDER = '#E9E9EB';
const SUCCESS = '#16A34A';
const SUCCESS_BG = '#DCFCE7';

const BANNERS = [
  {
    id: '1',
    tag: 'FRESH TODAY',
    title: 'Farm-fresh\nVegetables',
    emoji: '🥦',
    accent: '#16A34A',
    accentFaint: '#DCFCE7',
    bg: '#F0FDF4',
    overlay: '#BBF7D0',
  },
  {
    id: '2',
    tag: 'LIMITED OFFER',
    title: 'Seasonal\nFruits',
    emoji: '🥭',
    accent: '#EA580C',
    accentFaint: '#FFF7ED',
    bg: '#FFF7ED',
    overlay: '#FED7AA',
  },
  {
    id: '3',
    tag: 'DAILY DAIRY',
    title: 'Organic\nDairy',
    emoji: '🥛',
    accent: '#2563EB',
    accentFaint: '#EFF6FF',
    bg: '#EFF6FF',
    overlay: '#BFDBFE',
  },
];

const CATEGORIES = [
  { key: 'All', icon: '🍽️' },
  { key: 'Vegetables', icon: '🥦' },
  { key: 'Fruits', icon: '🍎' },
  { key: 'Milk', icon: '🥛' },
  { key: 'Beauty', icon: '✨' },
];

// ─── Premium Product Card Component ───────────────────────────────────────────

const PremiumProductCard = ({ item, compact }: { item: any, compact?: boolean }) => {
  const imageUrl = item?.image || item?.imageUrl || 'https://via.placeholder.com/150';
  const name = item?.name || 'Fresh Product';
  const price = item?.price || '0';
  const originalPrice = item?.originalPrice || null;
  const unit = item?.unit || item?.weight || '1 pc';
  const productId = item?._id || item?.id;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, compact && styles.cardContainerCompact]}
      activeOpacity={0.9}
      onPress={() => {
        if (productId) {
          router.push(`/product/${productId}`);
        }
      }}
    >
      <View style={styles.cardImageBox}>
        <View style={styles.cardImageBg}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.cardTag}>
          <Text style={styles.cardTagText}>⚡ 12 MINS</Text>
        </View>

        <TouchableOpacity style={styles.cardAddBtn} activeOpacity={0.8}>
          <Text style={styles.cardAddText}>ADD</Text>
          <View style={styles.cardAddPlus}>
            <Text style={styles.cardAddPlusText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle} numberOfLines={2}>{name}</Text>
        <Text style={styles.cardUnit}>{unit}</Text>

        <View style={styles.cardPriceRow}>
          <Text style={styles.cardPrice}>₹{price}</Text>
          {originalPrice && (
            <Text style={styles.cardOriginalPrice}>₹{originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen Component ────────────────────────────────────────────────────

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const { category } = useLocalSearchParams();
  const isCategoryMode = !!category;
  const scrollRef = useRef<ScrollView>(null);

  // ── Auto-rotate banner ────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // ── Handle incoming category navigation ───────────────────────────────────
  useEffect(() => {
    if (category) {
      setSelectedCategory(category as string);
      setTimeout(() => {
        // Scroll down slightly to show products when coming from categories screen
        scrollRef.current?.scrollTo({ y: 550, animated: true });
      }, 400);
    }
  }, [category]);

  useFocusEffect(
    React.useCallback(() => {
      loadLatestOrder();
      loadProducts();
    }, [])
  );

  // ── Socket: live order status updates ────────────────────────────────────
  useEffect(() => {
    const handleOrderUpdate = (order: any) => {
      if (latestOrder && order?._id === latestOrder._id) {
        setLatestOrder((prev: any) => ({
          ...prev,
          status: order.status,
        }));
      }
    };

    socket.on("orderUpdated", handleOrderUpdate);
    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
    };
  }, [latestOrder?._id]);

  // ── API Calls ─────────────────────────────────────────────────────────────
  const loadLatestOrder = async () => {
    try {
      const user = JSON.parse(
        (await AsyncStorage.getItem('user')) || '{}'
      );
      const res = await fetch(`${BASE_URL}/orders/my-orders/${user._id}`);
      const data = await res.json();

      if (data?.success && Array.isArray(data.orders) && data.orders.length > 0) {
        setLatestOrder(data.orders[0]);
      } else if (Array.isArray(data) && data.length > 0) {
        setLatestOrder(data[0]);
      } else {
        setLatestOrder(null);
      }
    } catch (error) {
      console.log('Order fetch error:', error);
      setLatestOrder(null);
    }
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${BASE_URL}/products/all-products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (error) {
      console.log('Products fetch error:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const searchProducts = async (text: string) => {
    setSearch(text);
    if (text.length === 0) { loadProducts(); return; }
    try {
      const res = await fetch(`${BASE_URL}/products/search/${text}`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (error) {
      console.log('Search error:', error);
    }
  };

  // ── Derived State ─────────────────────────────────────────────────────────
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
        (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

  const banner = BANNERS[activeIndex];
  const normalizedOrderStatus = latestOrder?.status?.toLowerCase().trim();
  const showTrackingSection =
    latestOrder &&
    normalizedOrderStatus !== 'delivered' &&
    normalizedOrderStatus !== 'cancelled';

  // ── Route to Categories Screen function ───────────────────────────────────
  const goToCategories = () => {
    router.push('/screens/CategoriesScreen'); // Update path if your screen is named differently
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={SURFACE} />

      {/* ══ HEADER (Swiggy Style Location) ════════════════════════════════ */}
      {!isCategoryMode && (
        <View style={styles.headerArea}>
          <View style={styles.header}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <View>
                <View style={styles.locationRow}>
                  <Text style={styles.locationTitle}>Home</Text>
                  <Text style={styles.dropdownIcon}> ▾</Text>
                </View>
                <Text style={styles.locationSub} numberOfLines={1}>
                  Village Delivery, Sector 4, Block A...
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.profileOrb}
              onPress={() => router.push('/screens/ProfileScreen' as any)}
              activeOpacity={0.7}
            >
              <Image
                source={require('../assets/logo.jpeg')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          {/* ══ SEARCH BAR ══════════════════════════════════════════════ */}
          <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search for groceries, veggies..."
              placeholderTextColor={TEXT_MUTED}
              style={styles.searchInput}
              value={search}
              onChangeText={searchProducts}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {search.length > 0 ? (
              <TouchableOpacity onPress={() => searchProducts('')} style={styles.clearBtn}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.searchDivider} />
                <Text style={styles.micIcon}>🎙️</Text>
              </>
            )}
          </View>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isCategoryMode && (
          <>
            {/* ══ TRACK DELIVERY CARD (Floating) ═══════════════════════════ */}
            {showTrackingSection && (
              <TouchableOpacity
                style={styles.trackCard}
                onPress={() => {
                  if (latestOrder?._id) {
                    router.push(`/track?id=${latestOrder._id}`);
                  }
                }}
                activeOpacity={0.9}
              >
                <View style={styles.trackLeft}>
                  <View style={styles.trackPulseOuter}>
                    <View style={styles.trackPulseInner} />
                  </View>
                  <View>
                    <Text style={styles.trackTitle}>Track your active order</Text>
                    <Text style={styles.trackSub}>
                      Status: <Text style={styles.statusHighlight}>{latestOrder.status}</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.trackRightBtn}>
                  <Text style={styles.trackRightText}>View Map</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* ══ HERO BANNER ═════════════════════════════════════════════ */}
            <View style={[styles.banner, { backgroundColor: banner.bg }]}>
              <View style={[styles.bannerBlob, { backgroundColor: banner.overlay }]} />
              <View style={styles.bannerInner}>
                <View style={styles.bannerLeft}>
                  <Text style={[styles.bannerTitle, { color: TEXT_HEAVY }]}>{banner.title}</Text>
                  <TouchableOpacity
                    style={[styles.bannerBtn, { backgroundColor: banner.accent }]}
                    activeOpacity={0.8}
                    onPress={goToCategories}
                  >
                    <Text style={styles.bannerBtnText}>Explore Now</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
              </View>

              <View style={styles.dotsRow}>
                {BANNERS.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === activeIndex && { ...styles.dotActive, backgroundColor: banner.accent }
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* ══ CATEGORY GRID ══════════════════════════════════════════ */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              <TouchableOpacity onPress={goToCategories}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {CATEGORIES.map((cat, i) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelectedCategory(cat.key)}
                    style={styles.categoryItem}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryCircle, isActive && styles.categoryCircleActive]}>
                      <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                    </View>
                    <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                      {cat.key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.divider} />

            {/* ══ FEATURED SCROLL (Today's Picks - Premium Vibe) ═══════════ */}
            <View style={styles.featuredSection}>
              <View style={[styles.sectionHeader, { marginBottom: 16, paddingHorizontal: 16 }]}>
                <View>
                  <Text style={styles.sectionTitle}>Today's Picks 🔥</Text>
                  <Text style={styles.sectionSubtitle}>Handpicked fresh for you</Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hRow}
              >
                {products.slice(0, 6).map((item, i) => (
                  <View
                    key={i}
                    style={{ width: 150 }}
                  >
                    <ProductCard
                      {...item}
                      compact
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.divider} />
          </>
        )}

        {/* ══ ALL PRODUCTS GRID ═══════════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'Explore Everything' : selectedCategory}
          </Text>
          <Text style={styles.itemCount}>{filteredProducts.length} items</Text>
        </View>

        {loadingProducts ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={BRAND} />
            <Text style={styles.loaderText}>Fetching fresh products...</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>Nothing here yet</Text>
            <Text style={styles.emptySub}>We couldn't find items in this category.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((item, i) => (
              <View
                key={i}
                style={{
                  width: (width - 48) / 2,
                }}
              >
                <ProductCard {...item} />
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const RADIUS_LG = 24;
const RADIUS_MD = 16;
const RADIUS_SM = 12;

const SHADOW_LIGHT = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 2,
};

const SHADOW_ELEVATED = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 5,
};

const SHADOW_CARD_BTN = {
  shadowColor: BRAND,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG_MAIN,
  },
  headerArea: {
    backgroundColor: SURFACE,
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...SHADOW_LIGHT,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  locationIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: TEXT_HEAVY,
  },
  dropdownIcon: {
    fontSize: 18,
    color: BRAND,
    fontWeight: 'bold',
  },
  locationSub: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginTop: 2,
  },
  profileOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: BORDER,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: RADIUS_SM,
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: BORDER,
    ...SHADOW_LIGHT,
  },
  searchBarFocused: {
    borderColor: BRAND,
    ...SHADOW_ELEVATED,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_HEAVY,
    fontWeight: '500',
  },
  searchDivider: {
    width: 1,
    height: 24,
    backgroundColor: BORDER,
    marginHorizontal: 12,
  },
  micIcon: {
    fontSize: 18,
    color: BRAND,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F1F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 10,
    color: TEXT_MUTED,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE,
    borderRadius: RADIUS_MD,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: SUCCESS_BG,
    ...SHADOW_ELEVATED,
  },
  trackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trackPulseOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SUCCESS_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trackPulseInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: SUCCESS,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_HEAVY,
    marginBottom: 4,
  },
  trackSub: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  statusHighlight: {
    color: SUCCESS,
    textTransform: 'capitalize',
    fontWeight: '800',
  },
  trackRightBtn: {
    backgroundColor: BRAND_LIGHT,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS_SM,
  },
  trackRightText: {
    color: BRAND,
    fontWeight: '800',
    fontSize: 12,
  },
  banner: {
    borderRadius: RADIUS_LG,
    overflow: 'hidden',
    marginBottom: 24,
    minHeight: 160,
  },
  bannerBlob: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: '60%',
    bottom: -30,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 120,
    opacity: 0.5,
  },
  bannerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  bannerLeft: { flex: 1 },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    marginBottom: 16,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
  },
  bannerBtnText: {
    color: SURFACE,
    fontWeight: '800',
    fontSize: 13,
  },
  bannerEmoji: {
    fontSize: 80,
    opacity: 0.9,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dotActive: {
    width: 18,
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: TEXT_HEAVY,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
    marginTop: 2,
  },
  itemCount: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    color: BRAND,
    fontWeight: '800',
  },
  categoryRow: {
    paddingBottom: 8,
    gap: 16,
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
  },
  categoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...SHADOW_LIGHT,
  },
  categoryCircleActive: {
    backgroundColor: BRAND_LIGHT,
    borderWidth: 2,
    borderColor: BRAND,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MID,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: BRAND,
    fontWeight: '800',
  },
  featuredSection: {
    backgroundColor: BRAND_FAINT,
    marginHorizontal: -16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BRAND_LIGHT,
  },
  hRow: {
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cardContainer: {
    width: (width - 48) / 2,
    backgroundColor: SURFACE,
    borderRadius: RADIUS_MD,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardContainerCompact: {
    width: 150,
  },
  cardImageBox: {
    position: 'relative',
    marginBottom: 20,
  },
  cardImageBg: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: BG_MAIN,
    borderRadius: RADIUS_SM,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTag: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: SURFACE,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    ...SHADOW_LIGHT,
  },
  cardTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: TEXT_HEAVY,
  },
  cardAddBtn: {
    position: 'absolute',
    bottom: -16,
    alignSelf: 'center',
    backgroundColor: SURFACE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND_LIGHT,
    paddingLeft: 12,
    paddingRight: 4,
    ...SHADOW_CARD_BTN,
  },
  cardAddText: {
    color: BRAND,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  cardAddPlus: {
    backgroundColor: BRAND_LIGHT,
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAddPlusText: {
    color: BRAND,
    fontWeight: '900',
    fontSize: 16,
    lineHeight: 18,
  },
  cardDetails: {
    paddingHorizontal: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_HEAVY,
    lineHeight: 18,
    marginBottom: 4,
    height: 36,
  },
  cardUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: TEXT_HEAVY,
  },
  cardOriginalPrice: {
    fontSize: 12,
    color: TEXT_MUTED,
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 24,
  },
  loader: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loaderText: {
    color: TEXT_MUTED,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '900',
    color: TEXT_HEAVY,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
});