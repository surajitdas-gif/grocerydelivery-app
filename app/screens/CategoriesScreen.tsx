import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const categories = [
  { name: 'Vegetables', emoji: '🥦', count: '48 items', bg: '#E8F5E9' },
  { name: 'Fruits', emoji: '🍎', count: '32 items', bg: '#FFF3E0' },
  { name: 'Milk & Dairy', emoji: '🥛', count: '24 items', bg: '#E3F2FD' },
  { name: 'Eggs', emoji: '🥚', count: '18 items', bg: '#FCE4EC' },
  { name: 'Grains', emoji: '🌾', count: '56 items', bg: '#F3E5F5' },
  { name: 'Beverages', emoji: '🧃', count: '30 items', bg: '#E8EAF6' },
  { name: 'Snacks', emoji: '🍪', count: '22 items', bg: '#FFF8E1' },
  { name: 'Cleaning', emoji: '🧴', count: '15 items', bg: '#E0F2F1' },
];

export default function CategoriesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <Text style={styles.header}>Categories 🗂️</Text>
      <Text style={styles.sub}>Browse all grocery categories</Text>

      {categories.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card}>
          
          <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.count}>{item.count}</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
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

  header: {
    fontSize: 26,
    fontWeight: '700',
  },

  sub: {
    color: '#6b7280',
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emoji: {
    fontSize: 26,
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
  },

  count: {
    color: '#9ca3af',
    marginTop: 4,
    fontSize: 12,
  },

  arrow: {
    fontSize: 20,
    color: '#ccc',
  },
});