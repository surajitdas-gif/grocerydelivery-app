

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { socket } from "@/socket";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';

const BASE_URL = "https://grocerydelivery-backend.onrender.com";
const { width } = Dimensions.get('window');

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    bg: string;
    dot: string;
  }
> = {

  Pending: {
    color: "#92400e",
    bg: "#fef3c7",
    dot: "#f59e0b"
  },

  Preparing: {
    color: "#1e40af",
    bg: "#dbeafe",
    dot: "#3b82f6"
  },

  "Out for Delivery": {
    color: "#065f46",
    bg: "#d1fae5",
    dot: "#10b981"
  },

  Delivered: {
    color: "#166534",
    bg: "#dcfce7",
    dot: "#22c55e"
  },

  Cancelled: {
    color: "#991b1b",
    bg: "#fee2e2",
    dot: "#ef4444"
  }

};

const getStatusStyle =
  (status: string) =>

    STATUS_CONFIG[status]
    ??

    {
      color: "#374151",
      bg: "#f3f4f6",
      dot: "#9ca3af"
    };

// ─────────────────────────────────────────────────────────────────────────────

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const trackingOrderRef = useRef<string | null>(null);
  const locationSubscriptionRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => { loadOrders(); }, [])
  );

  useEffect(() => {
    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });
    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  const startTracking = async (orderId: string) => {
    try {
      trackingOrderRef.current = orderId;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Location permission denied");
        return;
      }
      if (locationSubscriptionRef.current) {
        await locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }
      locationSubscriptionRef.current =
        await Location.watchPositionAsync(

          {
            accuracy:
              Location.Accuracy.BestForNavigation,

            timeInterval: 3000,

            distanceInterval: 5,
          },

          async (location) => {

            const lat =
              location.coords.latitude;

            const lng =
              location.coords.longitude;

            console.log(
              "📍 LIVE DELIVERY LOCATION:",
              lat,
              lng
            );

            await fetch(
              `${BASE_URL}/api/orders/update-location/${orderId}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json'
                },

                body: JSON.stringify({
                  lat,
                  lng,
                }),
              }
            );
          }
        );
    } catch (err) {
      console.log("❌ TRACKING ERROR:", err);
    }
  };

  const stopTracking = async () => {
    trackingOrderRef.current = null;
    if (locationSubscriptionRef.current) {
      await locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/orders/all-orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      console.log("🚀 CLICKED:", status);
      const userData = await AsyncStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      if (!user || !user._id) {
        Alert.alert("User _id missing");
        return;
      }
      const res = await fetch(`${BASE_URL}/api/orders/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, deliveryBoyId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert(data.message || "Update failed");
        return;
      }
      if (status === "Out for Delivery") startTracking(id);
      if (status === "Delivered") stopTracking();
      Alert.alert("Updated", status);
      loadOrders();
    } catch (err) {
      console.log("❌ STATUS ERROR:", err);
    }
  };

  const markPaymentReceived =
    async (id: string) => {

      try {

        const res = await fetch(
          `${BASE_URL}/api/orders/payment/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              paymentReceived: true,
            }),
          }
        );

        const data =
          await res.json();

        if (data.success) {

          Alert.alert(
            "Payment received ✅"
          );

          loadOrders();
        }

      } catch (err) {

        console.log(
          "PAYMENT UPDATE ERROR:",
          err
        );

        Alert.alert(
          "Payment update failed"
        );
      }
    };

  const callUser = async (phone: string) => {
    if (!phone) { Alert.alert("No phone number"); return; }
    try {
      await Linking.openURL(`tel:${phone}`);
    } catch {
      Alert.alert("Call failed");
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace('/auth/login' as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />

      {/* ══ HEADER ════════════════════════════════════════════ */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>DELIVERY PARTNER</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ══ ORDER COUNT STRIP ══════════════════════════════════ */}
      <View style={styles.strip}>
        <Text style={styles.stripText}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} assigned
        </Text>
      </View>

      {/* ══ ORDER LIST ════════════════════════════════════════ */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySub}>New orders will appear here in real time</Text>
          </View>
        ) : (
          orders.map((order) => {
            const st = getStatusStyle(order.status);
            return (
              <View key={order._id} style={styles.card}>

                {/* ── Card Top Row ── */}
                <View style={styles.cardTop}>
                  <View style={styles.orderIdBadge}>
                    <Text style={styles.orderIdText}>#{order._id.slice(-6).toUpperCase()}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: st.dot }]} />
                    <Text style={[styles.statusText, { color: st.color }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                {/* ── Amount ── */}
                <Text style={styles.amount}>
                  ₹{order.total}
                </Text>

                {/* ── PAYMENT STATUS ── */}
                {order?.paymentMethod === "COD" && (

                  <View style={styles.paymentSection}>

                    <View style={styles.paymentTop}>

                      <Text style={styles.paymentTitle}>
                        Cash on Delivery
                      </Text>

                      {order?.paymentReceived ? (

                        <View style={styles.paidBadge}>
                          <Text style={styles.paidBadgeText}>
                            ✓ Paid
                          </Text>
                        </View>

                      ) : (

                        <View style={styles.unpaidBadge}>
                          <Text style={styles.unpaidBadgeText}>
                            Pending
                          </Text>
                        </View>

                      )}

                    </View>

                    {!order?.paymentReceived && (
                      <>

                        <View style={styles.qrBox}>

                          <Image
                            source={{
                              uri:
                                `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                                  `upi://pay?pa=dasantu0118-2@oksbi&pn=Village Grocery&am=${order.total}&tn=Order-${order._id}&cu=INR`
                                )}`,
                            }}
                            style={styles.qrImage}
                          />
                          <Text style={styles.qrText}>
                            Scan QR to Pay
                          </Text>

                          <Text style={styles.qrSub}>
                            UPI Accepted
                          </Text>

                        </View>
                        <TouchableOpacity
                          style={styles.paymentBtn}
                          onPress={() =>
                            markPaymentReceived(order._id)
                          }
                        >
                          <Text style={styles.paymentBtnText}>
                            Payment Received
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}

                  </View>
                )}

                <View style={styles.divider} />

                {/* ── Customer Info ── */}
                <View style={styles.infoBlock}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>👤</Text>
                    <Text style={styles.infoValue}>
                      {order.customerName || 'No Name'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📞</Text>
                    <Text style={styles.infoValue}>
                      {order.customerPhone || 'No phone'}
                    </Text>
                  </View>
                  {order.customerAltPhone ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>☎️</Text>
                      <Text style={styles.infoValue}>{order.customerAltPhone}</Text>
                    </View>
                  ) : null}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={[styles.infoValue, { flex: 1 }]}>
                      {order.address || 'No address'}
                    </Text>
                  </View>
                </View>

                {/* ── Items ── */}
                <View style={styles.itemsBlock}>
                  <Text style={styles.itemsLabel}>ORDER ITEMS</Text>
                  {order.items?.map((item: any, i: number) => (
                    <View key={i} style={styles.itemRow}>
                      <View style={styles.itemDot} />
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQty}>×{item.qty}</Text>
                    </View>
                  ))}
                </View>

                {/* ── Action Buttons ── */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => callUser(order.customerPhone)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionIcon}>📞</Text>
                    <Text style={styles.actionBtnText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => {

                      if (
                        order?.userLocation?.lat &&
                        order?.userLocation?.lng
                      ) {

                        Linking.openURL(
                          `https://www.google.com/maps/dir/?api=1&destination=${order.userLocation.lat},${order.userLocation.lng}&travelmode=driving`
                        );

                      } else {

                        Alert.alert(
                          "Customer location missing"
                        );
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.actionIcon}>🗺</Text>
                    <Text style={styles.actionBtnText}>Track</Text>
                  </TouchableOpacity>
                </View>

                {/* ── Status Updater ── */}
                <View style={styles.statusUpdaterLabel}>
                  <Text style={styles.statusUpdaterTitle}>UPDATE STATUS</Text>
                </View>

                <View style={styles.statusRow}>

                  {/* PREPARING */}
                  <TouchableOpacity
                    style={[
                      styles.statusBtn,
                      (
                        order.status === "Out for Delivery" ||
                        order.status === "Delivered"
                      ) && styles.disabledBtn,
                    ]}
                    disabled={
                      order.status === "Out for Delivery" ||
                      order.status === "Delivered"
                    }
                    onPress={() =>
                      updateStatus(order._id, "Preparing")
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusBtnIcon}>
                      🍳
                    </Text>

                    <Text style={styles.statusBtnLabel}>
                      Preparing
                    </Text>
                  </TouchableOpacity>

                  {/* OUT FOR DELIVERY */}
                  <TouchableOpacity
                    style={[
                      styles.statusBtn,
                      styles.statusBtnOrange,
                      order.status === "Delivered" &&
                      styles.disabledBtn,
                    ]}
                    disabled={
                      order.status === "Delivered"
                    }
                    onPress={() =>
                      updateStatus(
                        order._id,
                        "Out for Delivery"
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusBtnIcon}>
                      🚚
                    </Text>

                    <Text
                      style={[
                        styles.statusBtnLabel,
                        { color: '#92400e' },
                      ]}
                    >
                      Out for{"\n"}Delivery
                    </Text>
                  </TouchableOpacity>

                  {/* DELIVERED */}
                  <TouchableOpacity
                    style={[
                      styles.statusBtn,
                      styles.statusBtnGreen,
                      order.status === "Delivered" &&
                      styles.disabledBtn,
                    ]}
                    disabled={
                      order.status === "Delivered"
                    }
                    onPress={() =>
                      updateStatus(
                        order._id,
                        "Delivered"
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusBtnIcon}>
                      ✅
                    </Text>

                    <Text
                      style={[
                        styles.statusBtnLabel,
                        { color: '#166534' },
                      ]}
                    >
                      Delivered
                    </Text>
                  </TouchableOpacity>
                  {/* CANCEL */}

                  <TouchableOpacity
                    style={[
                      styles.statusBtn,
                      styles.cancelBtn,
                      (
                        order.status === "Delivered" ||
                        order.status === "Cancelled"
                      ) && styles.disabledBtn
                    ]}

                    disabled={
                      order.status === "Delivered" ||
                      order.status === "Cancelled"
                    }

                    onPress={() =>
                      updateStatus(
                        order._id,
                        "Cancelled"
                      )
                    }

                    activeOpacity={0.8}
                  >

                    <Text style={styles.statusBtnIcon}>
                      ❌
                    </Text>

                    <Text
                      style={[
                        styles.statusBtnLabel,
                        {
                          color: "#991b1b"
                        }
                      ]}
                    >
                      Cancel
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

const CARD_SHADOW = {
  shadowColor: '#0a1628',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f0f2f7',
  },

  // ── Header ──────────────────────────────────────────
  header: {
    backgroundColor: '#0a1628',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  headerEyebrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 4,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  headerRight: {
    alignItems: 'flex-end',
    gap: 10,
  },

  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },

  liveText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },

  logoutText: {
    color: '#f87171',
    fontWeight: '700',
    fontSize: 12,
  },

  // ── Strip ────────────────────────────────────────────
  strip: {
    backgroundColor: '#0a1628',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  stripText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontWeight: '500',
  },

  // ── List ──────────────────────────────────────────────
  list: {
    padding: 16,
    gap: 16,
  },

  // ── Empty State ───────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },

  emptyEmoji: { fontSize: 52, marginBottom: 14 },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0a1628',
    marginBottom: 6,
  },

  emptySub: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Card ──────────────────────────────────────────────
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    ...CARD_SHADOW,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  orderIdBadge: {
    backgroundColor: '#0a1628',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  orderIdText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  amount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0a1628',
    letterSpacing: -0.8,
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f3f7',
    marginBottom: 14,
  },

  // ── Info Block ────────────────────────────────────────
  infoBlock: {
    gap: 8,
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  infoIcon: {
    fontSize: 14,
    width: 20,
    marginTop: 1,
  },

  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    lineHeight: 20,
  },

  // ── Items Block ───────────────────────────────────────
  itemsBlock: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  itemsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1.4,
    marginBottom: 10,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },

  itemDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#d1d5db',
  },

  itemName: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },

  itemQty: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '700',
  },

  // ── Action Buttons ─────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#0f2d1f',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#0f2d1f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  trackBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#1e3a8a',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  actionIcon: { fontSize: 16 },

  actionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Status Updater ──────────────────────────────────────
  statusUpdaterLabel: {
    marginBottom: 10,
  },

  statusUpdaterTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1.4,
  },

  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },

  statusBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    gap: 4,
  },

  statusBtnOrange: {
    backgroundColor: '#fef3c7',
  },

  statusBtnGreen: {
    backgroundColor: '#dcfce7',
  },
  cancelBtn: {
    backgroundColor: '#fee2e2',
  },

  statusBtnIcon: {
    fontSize: 20,
  },

  statusBtnLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.2,
    textAlign: 'center',
    lineHeight: 14,
  },

  disabledBtn: {
    opacity: 0.45,
  },


  paymentSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  paymentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  paymentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  paidBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },

  paidBadgeText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 11,
  },

  unpaidBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },

  unpaidBadgeText: {
    color: '#92400e',
    fontWeight: '700',
    fontSize: 11,
  },

  qrBox: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  qrEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },

  qrText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  qrImage: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },

  qrSub: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    fontWeight: '500',
  },

  paymentBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  paymentBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});