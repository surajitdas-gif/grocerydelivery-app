import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const INFO_ITEMS = [
  { label: 'Full name', value: 'Rahul Sharma', iconBg: '#E8F5E9', icon: '👤' },
  { label: 'Phone', value: '+91 98765 43210', iconBg: '#E3F2FD', icon: '📞' },
  { label: 'Email', value: 'rahul.sharma@gmail.com', iconBg: '#FFF3E0', icon: '📧' },
  { label: 'Date of birth', value: '14 March 1995', iconBg: '#FCE4EC', icon: '📅' },
  { label: 'Address', value: '12, Gandhi Nagar, Lucknow', iconBg: '#EDE7F6', icon: '📍' },
];

const MENU_ITEMS = [
  { label: 'My orders', sub: '24 orders placed', iconBg: '#E8F5E9', icon: '🛍️' },
  { label: 'Payments', sub: 'UPI · Cards · Wallets', iconBg: '#E3F2FD', icon: '💳' },
  { label: 'Support', sub: 'Help & live chat', iconBg: '#FFF3E0', icon: '💬' },
];

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('token');

            setTimeout(() => {
              router.replace('/auth/login' as any);
            }, 500);
          } catch (error) {
            console.log('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RS</Text>
        </View>

        <Text style={styles.headerName}>Rahul Sharma</Text>
        <Text style={styles.headerSub}>Member since Jan 2024</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹1,840</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.9★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Info</Text>

        {INFO_ITEMS.map((item, i) => (
          <TouchableOpacity key={i} style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
              <Text>{item.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity key={i} style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
              <Text>{item.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.value}>{item.label}</Text>
              <Text style={styles.label}>{item.sub}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Log out</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    backgroundColor: '#1a4731',
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#2d7a4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  headerName: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 12 },
  headerSub: { color: '#d1d5db', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 18, width: '100%' },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: { color: '#fff', fontWeight: '700' },
  statLabel: { color: '#d1d5db', fontSize: 11, marginTop: 3 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  label: { color: '#9ca3af', fontSize: 12 },
  value: { fontSize: 14, fontWeight: '600' },
  arrow: { fontSize: 20, color: '#ccc' },
  logout: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },
  logoutText: {
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '700',
  },
});