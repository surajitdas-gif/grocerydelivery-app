
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { io } from "socket.io-client";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  {
    bg: string;
    text: string;
    dot: string;
    icon: string;
  }
> = {

  Preparing: {
    bg: "#eff6ff",
    text: "#1d4ed8",
    dot: "#3b82f6",
    icon: "⚙"
  },

  Pending: {
    bg: "#fffbeb",
    text: "#b45309",
    dot: "#f59e0b",
    icon: "⏳"
  },

  "Out for Delivery": {
    bg: "#f0fdf4",
    text: "#0369a1",
    dot: "#0ea5e9",
    icon: "🚚"
  },

  Delivered: {
    bg: "#f0fdf4",
    text: "#15803d",
    dot: "#22c55e",
    icon: "✓"
  },

  Cancelled: {
    bg: "#fef2f2",
    text: "#dc2626",
    dot: "#ef4444",
    icon: "✕"
  }

};

const getStatusConfig =
  (status: string) => {

    return STATUS_CONFIG[
      status
    ]
      ||
      STATUS_CONFIG[
      "Pending"
      ];

  };
const socket = io(
  "http://172.20.10.3:5000",
  {
    transports: ["websocket"]
  }
);
// ── Component ─────────────────────────────────────────────────────────────────

export default function OrdersScreen() {
  const [backendOrders, setBackendOrders] = useState<any[]>([]);


  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  useEffect(() => {

    const handleOrderUpdate =
      (updatedOrder: any) => {

        setBackendOrders(
          (prev) =>

            prev.map(
              (order) =>

                order._id ===
                  updatedOrder._id

                  ?

                  updatedOrder

                  :

                  order

            )

        );

      };

    socket.on(
      "orderUpdated",
      handleOrderUpdate
    );

    return () => {

      socket.off(
        "orderUpdated",
        handleOrderUpdate
      );

    };

  }, []);

  const loadOrders = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');

      if (!userData) {
        setBackendOrders([]);
        return;
      }

      const user = JSON.parse(userData);

      if (!user?._id) {
        setBackendOrders([]);
        return;
      }

      const res = await fetch(
        `http://172.20.10.3:5000/api/orders/my-orders/${user._id}`
      );

      const data = await res.json();

      console.log('Orders loaded:', data);

      if (Array.isArray(data)) {
        setBackendOrders(data);
      } else if (Array.isArray(data.orders)) {
        setBackendOrders(data.orders);
      } else {
        setBackendOrders([]);
      }
    } catch (error) {
      console.log('Load order error:', error);
      setBackendOrders([]);
    }
  };
  const finalOrders =
    Array.isArray(
      backendOrders
    )
      ?
      backendOrders
      :
      [];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.topTitle}>My Orders</Text>
          <Text style={styles.topSub}>
            {finalOrders.length} {finalOrders.length === 1 ? 'order' : 'orders'} placed
          </Text>
        </View>

        <View style={styles.packageIcon}>
          <Text style={styles.packageEmoji}>📦</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {finalOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySub}>
              Your order history will appear here
            </Text>

            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.browseBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          finalOrders.map((order: any, index: number) => {
            const cfg = getStatusConfig(order.status);

            const orderTotal =
              order.items?.reduce(
                (sum: number, item: any) =>
                  sum + item.price * (item.qty || 1),
                0
              ) ?? order.total ?? 0;

            return (
              <View key={index} style={styles.orderCard}>
                {/* ── Order Header ── */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderId} numberOfLines={1}>
                      #{(order._id || order.id || '—')
                        .toString()
                        .slice(-8)
                        .toUpperCase()}
                    </Text>

                    <Text style={styles.orderDate}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                        : order.date || '—'}
                    </Text>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <View
                      style={[styles.statusDot, { backgroundColor: cfg.dot }]}
                    />
                    <Text style={[styles.statusText, { color: cfg.text }]}>
                      {order.status
                        ? order.status.charAt(0).toUpperCase() +
                        order.status.slice(1).toLowerCase()
                        : 'Pending'}
                    </Text>
                  </View>
                </View>

                {/* ── Address ── */}
                <View style={styles.addressRow}>
                  <Text style={styles.addressPin}>📍</Text>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {order.address || 'No address provided'}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* ── Items ── */}
                {order.items && order.items.length > 0 ? (
                  <View style={styles.itemsList}>
                    {order.items.map((item: any, i: number) => (
                      <View key={i} style={styles.itemRow}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.itemImage}
                        />

                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName} numberOfLines={2}>
                            {item.name}
                          </Text>
                          <Text style={styles.itemQty}>
                            Qty: {item.qty || 1}
                          </Text>
                        </View>

                        <Text style={styles.itemPrice}>
                          ₹{item.price * (item.qty || 1)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noItems}>No items found</Text>
                )}

                {/* ── Footer ── */}
                <View style={styles.orderFooter}>
                  <View>
                    <Text style={styles.footerLabel}>Order Total</Text>
                    <Text style={styles.footerTotal}>₹{orderTotal}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.reorderBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/CartScreen",
                        params: {
                          reorder: JSON.stringify(order.items),
                        },
                      })
                    }
                  >
                    <Text style={styles.reorderText}>
                      Reorder
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

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

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    fontSize: 24,
    color: '#111827',
    lineHeight: 30,
  },

  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
    textAlign: 'center',
  },

  topSub: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 1,
  },

  packageIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  packageEmoji: {
    fontSize: 18,
  },

  scrollContent: {
    padding: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 90,
    gap: 10,
  },

  emptyEmoji: {
    fontSize: 58,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  emptySub: {
    fontSize: 14,
    color: '#9ca3af',
  },

  browseBtn: {
    marginTop: 16,
    backgroundColor: '#052e16',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
  },

  browseBtnText: {
    color: '#4ade80',
    fontWeight: '700',
    fontSize: 14,
  },

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  orderHeaderLeft: {
    gap: 3,
  },

  orderId: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },

  orderDate: {
    fontSize: 12,
    color: '#9ca3af',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },

  addressPin: {
    fontSize: 13,
  },

  addressText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
  },

  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },

  itemsList: {
    gap: 12,
    marginBottom: 14,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  itemImage: {
    width: 62,
    height: 62,
    borderRadius: 13,
    backgroundColor: '#f3f4f6',
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  itemQty: {
    fontSize: 12,
    color: '#9ca3af',
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#052e16',
  },

  noItems: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 12,
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    marginTop: 4,
  },

  footerLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },

  footerTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#052e16',
  },

  reorderBtn: {
    backgroundColor: '#052e16',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  reorderText: {
    color: '#4ade80',
    fontWeight: '700',
    fontSize: 13,
  },
});









