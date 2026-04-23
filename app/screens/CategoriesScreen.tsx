import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const categories = [
  {
    name: 'Vegetables',
    emoji: '🥦',
    count: 48,
    tag: 'Farm Fresh',
    accent: '#166534',
    bg: '#052e16',
  },
  {
    name: 'Fruits',
    emoji: '🍎',
    count: 32,
    tag: 'Seasonal',
    accent: '#fb923c',
    bg: '#431407',
  },
  {
    name: 'Milk & Dairy',
    emoji: '🥛',
    count: 24,
    tag: 'Daily Fresh',
    accent: '#60a5fa',
    bg: '#172554',
  },
  {
    name: 'Eggs',
    emoji: '🥚',
    count: 18,
    tag: 'Farm Sourced',
    accent: '#f472b6',
    bg: '#500724',
  },
  {
    name: 'Grains',
    emoji: '🌾',
    count: 56,
    tag: 'Organic',
    accent: '#c084fc',
    bg: '#3b0764',
  },
  {
    name: 'Beverages',
    emoji: '🧃',
    count: 30,
    tag: 'Refreshing',
    accent: '#34d399',
    bg: '#022c22',
  },
  {
    name: 'Snacks',
    emoji: '🍪',
    count: 22,
    tag: 'Tasty Bites',
    accent: '#fbbf24',
    bg: '#451a03',
  },
  {
    name: 'Cleaning',
    emoji: '🧴',
    count: 15,
    tag: 'Home Care',
    accent: '#22d3ee',
    bg: '#083344',
  },
];

export default function CategoriesScreen() {
  const [search, setSearch] = useState('');

  const filtered = categories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.topTitle}>Categories</Text>
          <Text style={styles.topSub}>{categories.length} sections</Text>
        </View>

        <View style={styles.topRight}>
          <Text style={styles.topRightEmoji}>🗂️</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            placeholder="Search categories..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.featuredCard}>
          <View style={styles.featuredLeft}>
            <View style={styles.featuredTag}>
              <Text style={styles.featuredTagText}>ALL CATEGORIES</Text>
            </View>

            <Text style={styles.featuredTitle}>Browse Everything Fresh</Text>

            <Text style={styles.featuredSub}>
              {categories.length} sections · {categories.reduce((sum, item) => sum + item.count, 0)}+ products
            </Text>
          </View>

          <Text style={styles.featuredEmoji}>🛒</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </Text>

        <View style={styles.grid}>
          {filtered.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.catCard, { backgroundColor: item.bg }]}
            >
              <View
                style={[
                  styles.catTag,
                  { backgroundColor: item.accent + '22' },
                ]}
              >
                <Text style={[styles.catTagText, { color: item.accent }]}>
                  {item.tag}
                </Text>
              </View>

              <Text style={styles.catEmoji}>{item.emoji}</Text>
              <Text style={styles.catName}>{item.name}</Text>

              <View style={styles.catCountRow}>
                <Text style={[styles.catCount, { color: item.accent }]}>
                  {item.count} items
                </Text>
                <Text style={[styles.catArrow, { color: item.accent }]}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#fff',
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    fontSize: 24,
  },

  topTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  topSub: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },

  topRight: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  topRightEmoji: {
    fontSize: 18,
  },

  scrollContent: {
    padding: 16,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  searchIcon: {
    fontSize: 15,
  },

  searchInput: {
    flex: 1,
    height: 46,
    marginLeft: 8,
  },

  clearIcon: {
    fontSize: 13,
  },

  featuredCard: {
    backgroundColor: '#052e16',
    borderRadius: 22,
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  featuredLeft: {
    flex: 1,
  },

  featuredTag: {
    backgroundColor: '#4ade8022',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  featuredTagText: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '700',
  },

  featuredTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 10,
  },

  featuredSub: {
    color: '#86efac',
    fontSize: 12,
    marginTop: 8,
  },

  featuredEmoji: {
    fontSize: 64,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  catCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: 16,
    minHeight: 160,
    marginBottom: 12,
  },

  catTag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },

  catTagText: {
    fontSize: 9,
    fontWeight: '700',
  },

  catEmoji: {
    fontSize: 40,
    marginVertical: 10,
  },

  catName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
  },

  catCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  catCount: {
    fontSize: 12,
    fontWeight: '600',
  },

  catArrow: {
    fontSize: 16,
    fontWeight: '700',
  },
});