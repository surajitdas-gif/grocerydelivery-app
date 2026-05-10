import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import ProductCard from '../components/ProductCard';

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'http://172.20.10.3:5000/api';
const { width } = Dimensions.get('window');

// Gold palette
const GOLD        = '#B8962E';
const GOLD_LIGHT  = '#D4AF5A';
const GOLD_FAINT  = '#FDF6E7';
const GOLD_BORDER = '#E8D5A0';
const CREAM       = '#FAFAF7';
const SURFACE     = '#FFFFFF';
const SURFACE2    = '#F5F3EE';
const INK         = '#1A1611';
const INK_MID     = '#4A4238';
const INK_MUTED   = '#9B9082';
const GREEN_DOT   = '#22C55E';

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
  { key: 'All',        icon: '✦' },
  { key: 'Vegetables', icon: '🥕' },
  { key: 'Fruits',     icon: '🍓' },
  { key: 'Milk',       icon: '🥛' },
  { key: 'Beauty',     icon: '✨' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [activeIndex, setActiveIndex]           = useState(0);
  const [latestOrder, setLatestOrder]           = useState<any>(null);
  const [products, setProducts]                 = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch]                     = useState('');
  const [loadingProducts, setLoadingProducts]   = useState(true);
  const [searchFocused, setSearchFocused]       = useState(false);
  const { category }                            = useLocalSearchParams();
  const isCategoryMode                          = !!category;
  const scrollRef                               = useRef<ScrollView>(null);

  // ── Auto-rotate banner ────────────────────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category as string);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 620, animated: true });
      }, 400);
    }
  }, [category]);

  useFocusEffect(
    React.useCallback(() => {
      loadLatestOrder();
      loadProducts();
    }, [])
  );

  // ── API Calls ─────────────────────────────────────────────────────────────

  const loadLatestOrder = async () => {
    try {
      const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
      const res  = await fetch(`${BASE_URL}/orders/my-orders/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setLatestOrder(data[0]);
    } catch (error) {
      console.log('Order fetch error:', error);
    }
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res  = await fetch(`${BASE_URL}/products/all-products`);
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
      const res  = await fetch(`${BASE_URL}/products/search/${text}`);
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

  const showTrackingSection =
    latestOrder &&
    latestOrder.status !== 'Delivered' &&
    latestOrder.status !== 'Cancelled';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={CREAM} />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isCategoryMode && (
          <>
            {/* ══ HEADER ══════════════════════════════════════════════════ */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerGreet}>GOOD MORNING</Text>
                <View style={styles.locationRow}>
                  <View style={styles.locDot} />
                  <Text style={styles.locationText}>Village Delivery</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.profileOrb}
                onPress={() => router.push('/screens/ProfileScreen' as any)}
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
                placeholder="Search vegetables, fruits, dairy…"
                placeholderTextColor={INK_MUTED}
                style={styles.searchInput}
                value={search}
                onChangeText={searchProducts}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => searchProducts('')}
                  style={styles.clearBtn}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ══ TRACK DELIVERY PILL ═════════════════════════════════════ */}
            {showTrackingSection && (
              <TouchableOpacity
                style={styles.trackCard}
                onPress={() => {
                  if (latestOrder?._id) {
                    router.push(`/track?id=${latestOrder._id}`);
                  } else {
                    alert('No active order to track');
                  }
                }}
                activeOpacity={0.82}
              >
                {/* Pulse dot */}
                <View style={styles.trackPulseOuter}>
                  <View style={styles.trackPulseInner} />
                </View>

                <View style={styles.trackTextGroup}>
                  <Text style={styles.trackTitle}>Track your delivery</Text>
                  <Text style={styles.trackSub}>View live route on map</Text>
                </View>

                <View style={styles.trackBadge}>
                  <Text style={styles.trackBadgeText}>Live ›</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* ══ HERO BANNER ═════════════════════════════════════════════ */}
            <View style={[styles.banner, { backgroundColor: banner.bg, borderColor: banner.overlay }]}>
              {/* Decorative blob */}
              <View style={[styles.bannerBlob, { backgroundColor: banner.overlay }]} />

              <View style={styles.bannerInner}>
                {/* Text */}
                <View style={styles.bannerLeft}>
                  <View style={[styles.bannerPill, { backgroundColor: banner.accentFaint, borderColor: banner.overlay }]}>
                    <View style={[styles.bannerPillDot, { backgroundColor: banner.accent }]} />
                    <Text style={[styles.bannerTag, { color: banner.accent }]}>
                      {banner.tag}
                    </Text>
                  </View>

                  <Text style={[styles.bannerTitle, { color: INK }]}>{banner.title}</Text>

                  <TouchableOpacity
                    style={[styles.bannerBtn, { backgroundColor: banner.accent }]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.bannerBtnText}>Shop Now →</Text>
                  </TouchableOpacity>
                </View>

                {/* Emoji */}
                <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
              </View>

              {/* Dots */}
              <View style={styles.dotsRow}>
                {BANNERS.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setActiveIndex(i)}
                    style={[styles.dot, i === activeIndex && { ...styles.dotActive, backgroundColor: banner.accent }]}
                  />
                ))}
              </View>
            </View>

            {/* ══ ACTIVE ORDER CARD ═══════════════════════════════════════ */}
            {showTrackingSection && (
              <TouchableOpacity
                style={styles.orderCard}
                onPress={() => router.push('/screens/Orders' as any)}
                activeOpacity={0.85}
              >
                {/* Gold left stripe */}
                <View style={styles.orderStripe} />

                <View style={styles.orderLeft}>
                  <View style={styles.orderIconBox}>
                    <Text style={styles.orderIconText}>🚚</Text>
                  </View>
                  <View>
                    <Text style={styles.orderLabel}>Active Order</Text>
                    <Text style={styles.orderStatus}>
                      Status:{' '}
                      <Text style={styles.orderStatusValue}>{latestOrder.status}</Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.orderRight}>
                  <Text style={styles.orderAmount}>₹{latestOrder.total}</Text>
                  <Text style={styles.orderTrack}>Track ›</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* ══ BROWSE HEADER ═══════════════════════════════════════════ */}
            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.sectionEyebrow}>WHAT DO YOU NEED?</Text>
                <Text style={styles.sectionTitle}>Browse</Text>
              </View>
              <TouchableOpacity style={styles.seeAllBtn}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {/* ══ CATEGORY CHIPS ══════════════════════════════════════════ */}
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
                    styles.categoryChip,
                    selectedCategory === cat.key && styles.categoryChipActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.key && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.key}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ══ TODAY'S PICKS LABEL ═════════════════════════════════════ */}
            <View style={[styles.sectionRow, { marginBottom: 12 }]}>
              <View>
                <Text style={styles.sectionEyebrow}>FEATURED</Text>
                <Text style={[styles.sectionTitle, { fontSize: 18 }]}>Today's Picks</Text>
              </View>
            </View>

            {/* ══ HORIZONTAL PRODUCT ROW ══════════════════════════════════ */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hRow}
            >
              {products.slice(0, 6).map((item, i) => (
                <View key={i} style={styles.hCard}>
                  <ProductCard {...item} compact />
                </View>
              ))}
            </ScrollView>

            {/* ══ DIVIDER ═════════════════════════════════════════════════ */}
            <View style={styles.divider} />

          </>
        )}

        {/* ══ PRODUCT GRID (filtered) ════════════════════════════════════ */}
        <View style={[styles.sectionRow, { marginBottom: 14 }]}>
          <View>
            <Text style={styles.sectionEyebrow}>ALL PRODUCTS</Text>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'Everything' : selectedCategory}
            </Text>
          </View>
        </View>

        {loadingProducts ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={GOLD} />
            <Text style={styles.loaderText}>Loading products…</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySub}>Try a different category or search term</Text>
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

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const RADIUS    = 20;
const RADIUS_SM = 12;

const SHADOW_SM = {
  shadowColor: '#B8962E',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

const SHADOW_MD = {
  shadowColor: '#1A1611',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.10,
  shadowRadius: 14,
  elevation: 4,
};

const styles = StyleSheet.create({

  // ── Root ───────────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: CREAM,
  },

  scroll: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 56,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerGreet: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 2,
    marginBottom: 5,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  locDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GOLD,
  },

  locationText: {
    fontSize: 20,
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.5,
  },

  profileOrb: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: GOLD_BORDER,
    ...SHADOW_SM,
  },

  logoImage: {
    width: '100%',
    height: '100%',
  },

  // ── Search ─────────────────────────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: 50,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DC',
    ...SHADOW_SM,
  },

  searchBarFocused: {
    borderColor: GOLD,
  },

  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: INK,
    fontWeight: '500',
  },

  clearBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: SURFACE2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearIcon: {
    fontSize: 10,
    color: INK_MUTED,
    fontWeight: '700',
  },

  // ── Track Card ─────────────────────────────────────────────────────────────
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INK,
    borderRadius: RADIUS,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    gap: 12,
    ...SHADOW_MD,
  },

  trackPulseOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(34,197,94,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trackPulseInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN_DOT,
  },

  trackTextGroup: { flex: 1 },

  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },

  trackSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },

  trackBadge: {
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  trackBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: GOLD,
  },

  // ── Banner ─────────────────────────────────────────────────────────────────
  banner: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 165,
    borderWidth: 1.5,
    ...SHADOW_MD,
  },

  bannerBlob: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: '55%',
    bottom: -24,
    borderTopLeftRadius: 80,
    borderBottomLeftRadius: 100,
    opacity: 0.6,
  },

  bannerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 38,
  },

  bannerLeft: { flex: 1 },

  bannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 11,
    gap: 5,
  },

  bannerPillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  bannerTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  bannerTitle: {
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: 15,
  },

  bannerBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: RADIUS_SM,
  },

  bannerBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.2,
  },

  bannerEmoji: {
    fontSize: 74,
    marginRight: 4,
  },

  dotsRow: {
    position: 'absolute',
    bottom: 13,
    left: 22,
    flexDirection: 'row',
    gap: 5,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(26,22,17,0.18)',
  },

  dotActive: {
    width: 20,
    borderRadius: 3,
  },

  // ── Order Card ─────────────────────────────────────────────────────────────
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE,
    borderRadius: RADIUS,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
    overflow: 'hidden',
    ...SHADOW_SM,
  },

  orderStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: GOLD,
    borderTopLeftRadius: RADIUS,
    borderBottomLeftRadius: RADIUS,
  },

  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 8,
  },

  orderIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS_SM,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderIconText: { fontSize: 20 },

  orderLabel: {
    fontSize: 9,
    color: GOLD,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },

  orderStatus: {
    fontSize: 13,
    color: INK_MID,
    fontWeight: '500',
  },

  orderStatusValue: {
    fontWeight: '800',
    color: INK,
    textTransform: 'capitalize',
  },

  orderRight: { alignItems: 'flex-end' },

  orderAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.3,
  },

  orderTrack: {
    fontSize: 12,
    color: GOLD,
    fontWeight: '700',
    marginTop: 3,
  },

  // ── Section Header ─────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },

  sectionEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 2,
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: INK,
    letterSpacing: -0.5,
  },

  seeAllBtn: {
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
  },

  seeAllText: {
    fontSize: 11,
    color: GOLD,
    fontWeight: '700',
  },

  // ── Category Chips ─────────────────────────────────────────────────────────
  categoryRow: {
    paddingBottom: 18,
    gap: 8,
    paddingRight: 4,
  },

  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: SURFACE,
    borderWidth: 1.5,
    borderColor: '#E8E4DC',
    ...SHADOW_SM,
  },

  categoryChipActive: {
    backgroundColor: INK,
    borderColor: INK,
  },

  categoryChipIcon: { fontSize: 14 },

  categoryChipText: {
    fontWeight: '600',
    fontSize: 13,
    color: INK_MID,
  },

  categoryChipTextActive: {
    color: GOLD_LIGHT,
  },

  // ── Horizontal product row ─────────────────────────────────────────────────
  hRow: {
    gap: 12,
    paddingBottom: 4,
    paddingRight: 4,
  },

  hCard: {
    width: 148,
  },

  // ── Divider ────────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: '#EDE9E0',
    marginVertical: 22,
  },

  // ── Grid ───────────────────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },

  gridItem: {
    width: (width - 54) / 2,
  },

  // ── Loader ─────────────────────────────────────────────────────────────────
  loader: {
    alignItems: 'center',
    paddingVertical: 52,
    gap: 14,
  },

  loaderText: {
    color: INK_MUTED,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── Empty State ────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 56,
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 14,
  },

  emptyText: {
    fontSize: 17,
    fontWeight: '800',
    color: INK,
    marginBottom: 6,
  },

  emptySub: {
    fontSize: 13,
    color: INK_MUTED,
    fontWeight: '500',
  },
});