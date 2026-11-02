
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { socket } from "@/socket";
import { getFreshLocation } from '@/Utils/freshLocation';
import { secureFetch } from '../../src/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import {
  router,
  useFocusEffect
} from 'expo-router';

const BASE_URL =
  "https://grocerydelivery-backend.onrender.com";

// ─────────────────────────────────────────────────────

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {

  const R = 6371000;

  const toRad =
    (d: number) =>
      (d * Math.PI) / 180;

  const dLat =
    toRad(lat2 - lat1);

  const dLng =
    toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

function formatDistance(m: number) {

  return m < 1000
    ? `${Math.round(m)} m`
    : `${(m / 1000).toFixed(1)} km`;
}

// ─────────────────────────────────────────────────────

const STATUS_CONFIG:
  Record<
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
  },
};

const getStatusStyle =
  (s: string) =>
    STATUS_CONFIG[s] ?? {
      color: "#374151",
      bg: "#f3f4f6",
      dot: "#9ca3af"
    };

// ─────────────────────────────────────────────────────

export default function DeliveryDashboard() {

  const [orders, setOrders] =
    useState<any[]>([]);

  const [deliveryLocation,
    setDeliveryLocation] =
    useState<{
      lat: number;
      lng: number;
    } | null>(null);

  const locationSubscriptionRef =
    useRef<any>(null);

  // ─────────────────────────────────────────────

  useEffect(() => {

    const getLocation =
      async () => {

        const loc =
          await getFreshLocation(30000);

        if (!loc) {

          console.log(
            "Could not get delivery location"
          );

          return;
        }

        setDeliveryLocation({
          lat: loc.latitude,
          lng: loc.longitude,
        });

        console.log(
          "📍 DELIVERY LOCATION:",
          loc.latitude,
          loc.longitude
        );
      };

    getLocation();

  }, []);

  // ─────────────────────────────────────────────

  useFocusEffect(

    useCallback(() => {

      loadOrders();

    }, [])

  );

  useEffect(() => {

    socket.on(
      "newOrder",
      (order) => {

        setOrders(
          (prev) => [order, ...prev]
        );
      }
    );

    socket.on(
      "orderUpdated",
      (updatedOrder) => {

        setOrders((prev) =>
          prev.map((o) =>
            o._id === updatedOrder._id
              ? updatedOrder
              : o
          )
        );
      }
    );

    return () => {

      socket.off("newOrder");

      socket.off("orderUpdated");
    };

  }, []);

  // ─────────────────────────────────────────────

  const loadOrders =
    async () => {

      try {

        const res =
          await secureFetch(
            `${BASE_URL}/api/orders/all-orders`
          );

        const data =
          await res.json();

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      }

      catch (err) {

        console.log(err);

      }
    };

  // ─────────────────────────────────────────────

  const startTracking =
    async (orderId: string) => {

      try {

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {

          Alert.alert(
            "Location permission denied"
          );

          return;
        }

        if (
          locationSubscriptionRef.current
        ) {

          await locationSubscriptionRef.current.remove();

          locationSubscriptionRef.current = null;
        }

        locationSubscriptionRef.current =

          await Location.watchPositionAsync(

            {
              accuracy:
                Location.Accuracy.Balanced,

              timeInterval: 5000,

              distanceInterval: 10,
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

              setDeliveryLocation({
                lat,
                lng
              });

              await secureFetch(

                `${BASE_URL}/api/orders/update-location/${orderId}`,

                {
                  method: 'PUT',

                  headers: {
                    'Content-Type':
                      'application/json'
                  },

                  body: JSON.stringify({
                    lat,
                    lng
                  }),
                }
              );
            }
          );

      }

      catch (err) {

        console.log(
          "TRACKING ERROR:",
          err
        );
      }
    };

  // ─────────────────────────────────────────────

  const stopTracking =
    async () => {

      if (
        locationSubscriptionRef.current
      ) {

        await locationSubscriptionRef.current.remove();

        locationSubscriptionRef.current = null;
      }
    };

  // ─────────────────────────────────────────────

  const updateStatus =
    async (
      id: string,
      status: string
    ) => {

      try {

        const userData =
          await AsyncStorage.getItem("user");

        const user =
          userData
            ? JSON.parse(userData)
            : null;

        if (!user?._id) {

          Alert.alert(
            "User not found"
          );

          return;
        }

        const res =
          await secureFetch(

            `${BASE_URL}/api/orders/status/${id}`,

            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({

                status,

                deliveryBoyId:
                  user._id

              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          Alert.alert(
            data.message ||
            "Update failed"
          );

          return;
        }

        if (
          status ===
          "Out for Delivery"
        ) {

          await startTracking(id);
        }

        if (
          status === "Delivered"
          ||
          status === "Cancelled"
        ) {

          await stopTracking();
        }

        Alert.alert(
          "Updated",
          status
        );

        loadOrders();

      }

      catch (err) {

        console.log(
          "STATUS ERROR:",
          err
        );
      }
    };

  // ─────────────────────────────────────────────

  const markPaymentReceived =
    async (id: string) => {

      try {

        const res =
          await secureFetch(

            `${BASE_URL}/api/orders/payment/${id}`,

            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                paymentReceived: true
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

      }

      catch (err) {

        console.log(err);

        Alert.alert(
          "Payment update failed"
        );
      }
    };

  // ─────────────────────────────────────────────

  const logout =
    async () => {

      await AsyncStorage.clear();

      router.replace(
        '/auth/login' as any
      );
    };

  // ─────────────────────────────────────────────

  return (

    <View style={styles.root}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#0a1628"
      />

      {/* HEADER */}

      <View style={styles.header}>

        <View>

          <Text style={styles.headerEyebrow}>
            DELIVERY PARTNER
          </Text>

          <Text style={styles.headerTitle}>
            Dashboard
          </Text>

          {deliveryLocation && (

            <Text style={styles.headerLocation}>
              📍 GPS Active
            </Text>

          )}

        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={logout}
        >

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>

      </View>

      {/* LIST */}

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >

        {orders.map((order) => {

          const st =
            getStatusStyle(order.status);

          const isTerminal =
            order.status === "Delivered"
            ||
            order.status === "Cancelled";

          const customerLat =
            order?.userLocation?.lat
              ? Number(order.userLocation.lat)
              : null;

          const customerLng =
            order?.userLocation?.lng
              ? Number(order.userLocation.lng)
              : null;

          const distText =

            deliveryLocation &&
              customerLat &&
              customerLng

              ? formatDistance(

                haversineDistance(

                  deliveryLocation.lat,
                  deliveryLocation.lng,

                  customerLat,
                  customerLng

                )
              )

              : null;

          return (

            <View
              key={order._id}
              style={styles.card}
            >

              <View style={styles.cardTop}>

                <Text style={styles.amount}>
                  ₹{order.total}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        st.bg
                    }
                  ]}
                >

                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: st.color
                      }
                    ]}
                  >
                    {order.status}
                  </Text>

                </View>

              </View>

              <Text style={styles.info}>
                👤 {order.customerName}
              </Text>

              <Text style={styles.info}>
                📞 {order.customerPhone}
              </Text>

              <Text style={styles.info}>
                📍 {order.address}
              </Text>

              {distText && (

                <Text style={styles.distance}>
                  📏 {distText} away
                </Text>

              )}

              {/* ACTIONS */}

              <View style={styles.actionRow}>

                <TouchableOpacity
                  style={styles.callBtn}

                  onPress={() => {

                    if (
                      !order.customerPhone
                    ) {

                      Alert.alert(
                        "No phone number"
                      );

                      return;
                    }

                    Linking.openURL(
                      `tel:${order.customerPhone}`
                    );
                  }}
                >

                  <Text style={styles.actionBtnText}>
                    📞 Call
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.trackBtn,
                    isTerminal &&
                    styles.disabledBtn,
                  ]}

                  disabled={isTerminal}

                  onPress={() => {

                    if (
                      !order?.userLocation?.lat ||
                      !order?.userLocation?.lng
                    ) {

                      Alert.alert(
                        "Customer location missing"
                      );

                      return;
                    }

                    const lat =
                      Number(
                        order.userLocation.lat
                      );

                    const lng =
                      Number(
                        order.userLocation.lng
                      );

                    const url =
                      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

                    Linking.openURL(url);

                  }}
                >

                  <Text style={styles.actionBtnText}>
                    🗺 Navigate
                  </Text>

                </TouchableOpacity>

              </View>

              {/* STATUS */}

              <View style={styles.statusRow}>

                <TouchableOpacity
                  style={styles.statusBtn}

                  disabled={isTerminal}

                  onPress={() =>
                    updateStatus(
                      order._id,
                      "Preparing"
                    )
                  }
                >

                  <Text style={styles.statusBtnText}>
                    Preparing
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statusBtn}

                  disabled={isTerminal}

                  onPress={() =>
                    updateStatus(
                      order._id,
                      "Out for Delivery"
                    )
                  }
                >

                  <Text style={styles.statusBtnText}>
                    Out
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statusBtn}

                  disabled={isTerminal}

                  onPress={() =>
                    updateStatus(
                      order._id,
                      "Delivered"
                    )
                  }
                >

                  <Text style={styles.statusBtnText}>
                    Done
                  </Text>

                </TouchableOpacity>

              </View>

            </View>
          );
        })}

        <View style={{ height: 40 }} />

      </ScrollView>

    </View>
  );
}

// ─────────────────────────────────────────────────────

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: '#f0f2f7'
  },

  header: {
    backgroundColor: '#0a1628',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerEyebrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '700',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },

  headerLocation: {
    color: '#10b981',
    marginTop: 5,
  },

  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },

  list: {
    padding: 16,
    gap: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  amount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },

  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },

  info: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },

  distance: {
    color: '#16a34a',
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 14,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },

  callBtn: {
    flex: 1,
    backgroundColor: '#065f46',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  trackBtn: {
    flex: 1,
    backgroundColor: '#1d4ed8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },

  statusBtn: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  statusBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },

  disabledBtn: {
    opacity: 0.4,
  },

});