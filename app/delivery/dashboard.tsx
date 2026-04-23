import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, router } from 'expo-router';
import * as Location from 'expo-location';

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  'Pending':         { color: '#f59e0b', bg: '#fef3c7', dot: '#f59e0b' },
  'Preparing':       { color: '#3b82f6', bg: '#dbeafe', dot: '#3b82f6' },
  'Out for Delivery':{ color: '#8b5cf6', bg: '#ede9fe', dot: '#8b5cf6' },
  'Delivered':       { color: '#10b981', bg: '#d1fae5', dot: '#10b981' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { color: '#6b7280', bg: '#f3f4f6', dot: '#6b7280' };
  return (
    <View style={[badgeStyles.badge, { backgroundColor: cfg.bg }]}>
      <View style={[badgeStyles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[badgeStyles.label, { color: cfg.color }]}>{status}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

function OrderCard({ order, onUpdateStatus }: { order: any; onUpdateStatus: (id: string, status: string) => void }) {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const actions = [
    { label: 'Preparing', emoji: '🍳', status: 'Preparing', accent: '#3b82f6' },
    { label: 'Out for Delivery', emoji: '🚚', status: 'Out for Delivery', accent: '#8b5cf6' },
    { label: 'Delivered', emoji: '✅', status: 'Delivered', accent: '#10b981' },
  ];

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>ORDER</Text>
          <Text style={styles.orderId}>#{String(order._id).slice(-8).toUpperCase()}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.divider} />

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>👤 Customer</Text>
          <Text style={styles.infoValue} numberOfLines={1}>{order.userId}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>💰 Total</Text>
          <Text style={[styles.infoValue, styles.totalValue]}>₹{order.total}</Text>
        </View>
      </View>

      <View style={styles.addressRow}>
        <Text style={styles.infoLabel}>📍 Address</Text>
        <Text style={styles.addressValue}>{order.address}</Text>
      </View>

      {/* Items */}
      {order.items?.length > 0 && (
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Items</Text>
          {order.items.map((item: any, i: number) => (
            <View key={i} style={styles.itemRow}>
              <View style={styles.itemDot} />
              <Text style={styles.itemText}>{item.name}</Text>
              <View style={styles.itemQtyBadge}>
                <Text style={styles.itemQty}>×{item.qty}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.status}
            style={[styles.actionBtn, { borderColor: action.accent }]}
            onPress={() => onUpdateStatus(order._id, action.status)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.75}
          >
            <Text style={styles.actionEmoji}>{action.emoji}</Text>
            <Text style={[styles.actionLabel, { color: action.accent }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  useEffect(() => {
    let interval: any;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location permission denied');
        return;
      }

      interval = setInterval(async () => {
        const activeOrder = orders.find((o) => o.status === 'Out for Delivery');
        if (!activeOrder) return;

        const location = await Location.getCurrentPositionAsync({});
        await fetch(`http://172.20.10.4:5000/api/orders/update-location/${activeOrder._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: location.coords.latitude, lng: location.coords.longitude }),
        });

        console.log('GPS updated');
      }, 3000);
    };

    startTracking();
    return () => clearInterval(interval);
  }, [orders]);

  const loadOrders = async () => {
    try {
      const res = await fetch('http://172.20.10.4:5000/api/orders/all-orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Dashboard error:', error);
      setOrders([]);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://172.20.10.4:5000/api/orders/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      Alert.alert('✅ Updated', `Status set to "${status}"`);
      loadOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'user', 'deliveryUser', 'adminUser']);
    router.replace('/auth/login' as any);
  };

  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const active = orders.filter((o) => o.status === 'Out for Delivery').length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.headerTitle}>Delivery Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#8b5cf6' }]}>{active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#10b981' }]}>{delivered}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>New orders will appear here</Text>
          </View>
        ) : (
          orders.map((order: any, index: number) => (
            <OrderCard key={order._id ?? index} order={order} onUpdateStatus={updateStatus} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // ─── Header ───────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#0f172a',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  greeting: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: -0.5,
  },

  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },

  logoutText: {
    color: '#f87171',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  // ─── Stats Bar ────────────────────────────────────────────────────────────
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 18,
    paddingVertical: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -1,
  },

  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },

  // ─── Scroll ───────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
    marginTop: 4,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ─── Card ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderIdContainer: {
    flex: 1,
  },

  orderIdLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  orderId: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },

  // ─── Info ─────────────────────────────────────────────────────────────────
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },

  totalValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '800',
  },

  addressRow: {
    marginBottom: 14,
  },

  addressValue: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 3,
  },

  // ─── Items ────────────────────────────────────────────────────────────────
  itemsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  itemsTitle: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },

  itemDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
    marginRight: 8,
  },

  itemText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },

  itemQtyBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  itemQty: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },

  // ─── Actions ──────────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  actionBtn: {
    flex: 1,
    minWidth: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    gap: 4,
  },

  actionEmoji: {
    fontSize: 13,
  },

  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ─── Empty ────────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
});