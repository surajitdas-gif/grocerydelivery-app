import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MapView, {
  Marker,
  Polyline,
} from "react-native-maps";

import MapViewDirections from "react-native-maps-directions";

import {
  router,
  useLocalSearchParams,
} from "expo-router";


import { socket } from "@/socket";

import { getFreshLocation } from "@/Utils/freshLocation";

// ─── Haversine distance (metres) ─────────────────────────────────────────────

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m away`;
  return `${(metres / 1000).toFixed(1)} km away`;
}

// ─── Midpoint helper ─────────────────────────────────────────────────────────

function midpoint(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  return {
    latitude: (lat1 + lat2) / 2,
    longitude: (lng1 + lng2) / 2,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL =
  "https://grocerydelivery-backend.onrender.com";

export default function TrackOrder() {

  const params = useLocalSearchParams();

  const orderId =
    params?.id ? String(params.id).trim() : "";

  const mapRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Preparing");

  const normalizedStatus = status?.toLowerCase()?.trim();
  const isTrackingActive =
    normalizedStatus !== "delivered" &&
    normalizedStatus !== "cancelled";

  const [userLocation, setUserLocation] = useState({
    lat: 22.5726,
    lng: 88.3639,
  });

  const [deliveryLocation, setDeliveryLocation] =
    useState({
      lat: 0,
      lng: 0,
    });

  const [history, setHistory] = useState<any[]>([]);

  const distance = haversineDistance(
    userLocation.lat,
    userLocation.lng,
    deliveryLocation.lat,
    deliveryLocation.lng,
  );

  const mid = midpoint(
    userLocation.lat,
    userLocation.lng,
    deliveryLocation.lat,
    deliveryLocation.lng,
  );

  // ======================================================
  // GET REAL USER LOCATION — fresh GPS, no cache
  // ======================================================

  useEffect(() => {
    const getLocation = async () => {
      const loc = await getFreshLocation(15000);
      if (!loc) return;
      setUserLocation({
        lat: loc.latitude,
        lng: loc.longitude,
      });
    };
    getLocation();
  }, []);

  // ======================================================
  // LOAD ORDER
  // ======================================================

  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/api/orders/track/${orderId}`
        );
        const data = await res.json();
        console.log("TRACK DATA:", data);

        if (data?.userLocation) {
          const userLat = Number(data.userLocation.lat);
          const userLng = Number(data.userLocation.lng);
          if (userLat && userLng) {
            setUserLocation({ lat: userLat, lng: userLng });
          }
        }
        if (
          data?.deliveryLocation &&
          Number(data.deliveryLocation.lat) !== 0 &&
          Number(data.deliveryLocation.lng) !== 0
        ) {

          const dLat =
            Number(data.deliveryLocation.lat);

          const dLng =
            Number(data.deliveryLocation.lng);

          setDeliveryLocation({
            lat: dLat,
            lng: dLng,
          });

          setHistory([
            {
              latitude: dLat,
              longitude: dLng,
            },
          ]);
        }

        if (data?.status) setStatus(data.status);

      } catch (err) {
        console.log("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  // ======================================================
  // LIVE SOCKET TRACKING
  // ======================================================

  useEffect(() => {
    if (!orderId) return;

    const handleLocationUpdate = (data: any) => {
      if (data?.orderId === orderId && data?.location) {
        const newLat = Number(data.location.lat);
        const newLng = Number(data.location.lng);
        if (!newLat || !newLng) return;

        setDeliveryLocation({ lat: newLat, lng: newLng });
        setHistory(prev => [
          ...prev,
          { latitude: newLat, longitude: newLng },
        ]);
      }
    };

    const handleOrderUpdate = (order: any) => {
      if (order?._id === orderId) {
        setStatus(order?.status || "Preparing");
      }
    };

    socket.on("locationUpdated", handleLocationUpdate);
    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off("locationUpdated", handleLocationUpdate);
      socket.off("orderUpdated", handleOrderUpdate);
    };
  }, [orderId]);

  // ======================================================
  // AUTO-FIT MAP
  // ======================================================

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.fitToCoordinates(
      [
        { latitude: userLocation.lat, longitude: userLocation.lng },
        { latitude: deliveryLocation.lat, longitude: deliveryLocation.lng },
      ],
      {
        edgePadding: { top: 80, right: 60, bottom: 220, left: 60 },
        animated: true,
      },
    );
  }, [deliveryLocation]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading tracking...</Text>
      </View>
    );
  }

  // ======================================================
  // DELIVERED / CANCELLED VIEW
  // ======================================================

  if (!isTrackingActive) {
    const isDelivered = normalizedStatus === "delivered";
    return (
      <View style={styles.deliveredContainer}>
        <Text style={styles.deliveredEmoji}>
          {isDelivered ? "✅" : "❌"}
        </Text>
        <Text style={[
          styles.deliveredTitle,
          { color: isDelivered ? "#16a34a" : "#dc2626" },
        ]}>
          {isDelivered ? "Order Delivered" : "Order Cancelled"}
        </Text>
        <TouchableOpacity
          style={[
            styles.homeBtn,
            { backgroundColor: isDelivered ? "#16a34a" : "#dc2626" },
          ]}
          onPress={() => router.push("/")}
        >
          <Text style={styles.homeBtnText}>Back To Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ======================================================
  // MAIN MAP UI
  // ======================================================

  return (
    <View style={styles.container}>

      {/* BACK BUTTON */}
      <View style={styles.backContainer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* CUSTOMER MARKER */}
        <Marker
          coordinate={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          }}
          title="You"
          description="Delivery destination"
          pinColor="#2563eb"
        />

        {/* DELIVERY BOY MARKER */}
        <Marker
          coordinate={{
            latitude: deliveryLocation.lat,
            longitude: deliveryLocation.lng,
          }}
          title="Delivery Boy"
          description={formatDistance(distance)}
        >
          <View style={styles.deliveryMarker}>
            <Text style={styles.deliveryEmoji}>🛵</Text>
          </View>
        </Marker>

        {/* DISTANCE MARKER — shown at midpoint */}
        <Marker
          coordinate={mid}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        >
          <View style={styles.distanceBubble}>
            <Text style={styles.distanceText}>
              {formatDistance(distance)}
            </Text>
          </View>
        </Marker>

        {/* REAL DRIVING ROUTE via Google Directions */}

        {
          deliveryLocation.lat !== 0 &&
          deliveryLocation.lng !== 0 && (

            <MapViewDirections
              origin={{
                latitude: deliveryLocation.lat,
                longitude: deliveryLocation.lng,
              }}

              destination={{
                latitude: userLocation.lat,
                longitude: userLocation.lng,
              }}

              apikey={
                process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!
              }

              strokeWidth={5}

              strokeColor="#16a34a"

              mode="DRIVING"

              onError={(err) =>
                console.log(
                  "ROUTE ERROR:",
                  err
                )
              }
            />

          )
        }

        {/* MOVEMENT HISTORY TRAIL */}
        {history.length > 1 && (
          <Polyline
            coordinates={history}
            strokeColor="#2563eb"
            strokeWidth={3}
            lineDashPattern={[6, 4]}
          />
        )}
      </MapView>

      {/* BOTTOM CARD */}
      <View style={styles.bottomCard}>

        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <View>
            <Text style={styles.statusLabel}>ORDER STATUS</Text>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.distanceRow}>
          <Text style={styles.distanceLabel}>📍 Distance</Text>
          <Text style={styles.distanceValue}>
            {formatDistance(distance)}
          </Text>
        </View>

      </View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  // ── Back button ────────────────────────────────────────

  backContainer: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 999,
  },

  backBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  backText: {
    color: "#16a34a",
    fontWeight: "800",
    fontSize: 16,
  },

  // ── Markers ────────────────────────────────────────────

  deliveryMarker: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  deliveryEmoji: {
    fontSize: 28,
  },

  distanceBubble: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 3,
  },

  distanceText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Bottom card ────────────────────────────────────────

  bottomCard: {
    position: "absolute",
    bottom: 36,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 22,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#16a34a",
  },

  statusLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 1.2,
  },

  statusText: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 14,
  },

  distanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  distanceLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },

  distanceValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  // ── Delivered / Cancelled ──────────────────────────────

  deliveredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },

  deliveredEmoji: {
    fontSize: 70,
    marginBottom: 20,
  },

  deliveredTitle: {
    fontSize: 28,
    fontWeight: "900",
  },

  homeBtn: {
    marginTop: 30,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 16,
  },

  homeBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});