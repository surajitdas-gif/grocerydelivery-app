// import {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import MapView, {
//   Marker,
//   Polyline,
// } from "react-native-maps";

// import {
//   router,
//   useLocalSearchParams,
// } from "expo-router";

// import { socket } from "@/socket";

// export default function TrackOrder() {

//   const params =
//     useLocalSearchParams();

//   const orderId =
//     params?.id
//       ? String(params.id).trim()
//       : "";

//   const mapRef =
//     useRef<any>(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [status, setStatus] =
//     useState("Preparing");

//   const normalizedStatus =
//     status
//       ?.toLowerCase()
//       ?.trim();

//   const isTrackingActive =
//     normalizedStatus !== "delivered" &&
//     normalizedStatus !== "cancelled";

//   const [userLocation, setUserLocation] =
//     useState({
//       lat: 22.5726,
//       lng: 88.3639,
//     });

//   const [deliveryLocation, setDeliveryLocation] =
//     useState({
//       lat: 22.5726,
//       lng: 88.3639,
//     });

//   const [history, setHistory] =
//     useState<any[]>([]);

//   const BASE_URL =
//     "https://grocerydelivery-backend.onrender.com";

//   // ======================================================
//   // LOAD ORDER
//   // ======================================================

//   useEffect(() => {

//     if (!orderId) return;

//     const loadOrder = async () => {

//       try {

//         setLoading(true);

//         const res =
//           await fetch(
//             `${BASE_URL}/api/orders/track/${orderId}`
//           );

//         const data =
//           await res.json();

//         console.log(
//           "TRACK DATA:",
//           data
//         );

//         // USER LOCATION
//         if (data?.userLocation) {

//           const userLat =
//             Number(data.userLocation.lat);

//           const userLng =
//             Number(data.userLocation.lng);

//           if (
//             userLat &&
//             userLng
//           ) {

//             setUserLocation({
//               lat: userLat,
//               lng: userLng,
//             });
//           }
//         }

//         // DELIVERY LOCATION
//         if (data?.deliveryLocation) {

//           const dLat =
//             Number(data.deliveryLocation.lat);

//           const dLng =
//             Number(data.deliveryLocation.lng);

//           if (
//             dLat &&
//             dLng
//           ) {

//             setDeliveryLocation({
//               lat: dLat,
//               lng: dLng,
//             });

//             setHistory([
//               {
//                 latitude: dLat,
//                 longitude: dLng,
//               },
//             ]);
//           }
//         }

//         // STATUS
//         if (data?.status) {
//           setStatus(data.status);
//         }

//       } catch (err) {

//         console.log(
//           "LOAD ERROR:",
//           err
//         );

//       } finally {

//         setLoading(false);
//       }
//     };

//     loadOrder();

//   }, [orderId]);

//   // ======================================================
//   // LIVE SOCKET TRACKING
//   // ======================================================

//   useEffect(() => {

//     if (!orderId) return;

//     const handleLocationUpdate =
//       (data: any) => {

//         if (
//           data?.orderId === orderId &&
//           data?.location
//         ) {

//           const newLat =
//             Number(data.location.lat);

//           const newLng =
//             Number(data.location.lng);

//           console.log(
//             "LIVE LOCATION:",
//             newLat,
//             newLng
//           );

//           if (
//             !newLat ||
//             !newLng
//           ) return;

//           setDeliveryLocation({
//             lat: newLat,
//             lng: newLng,
//           });

//           setHistory(prev => [
//             ...prev,
//             {
//               latitude: newLat,
//               longitude: newLng,
//             },
//           ]);
//         }
//       };

//     const handleOrderUpdate =
//       (order: any) => {

//         if (
//           order?._id === orderId
//         ) {

//           setStatus(
//             order?.status ||
//             "Preparing"
//           );
//         }
//       };

//     socket.on(
//       "locationUpdated",
//       handleLocationUpdate
//     );

//     socket.on(
//       "orderUpdated",
//       handleOrderUpdate
//     );

//     return () => {

//       socket.off(
//         "locationUpdated",
//         handleLocationUpdate
//       );

//       socket.off(
//         "orderUpdated",
//         handleOrderUpdate
//       );
//     };

//   }, [orderId]);

//   // ======================================================
//   // LOADING
//   // ======================================================

//   if (loading) {

//     return (

//       <View style={styles.loader}>

//         <ActivityIndicator
//           size="large"
//           color="#16a34a"
//         />

//         <Text style={styles.loadingText}>
//           Loading tracking...
//         </Text>

//       </View>
//     );
//   }

//   // ======================================================
//   // UI
//   // ======================================================

//   return (

//     <View style={styles.container}>

//       {/* BACK BUTTON */}

//       <View style={styles.backContainer}>

//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => router.back()}
//         >

//           <Text style={styles.backText}>
//             ← Back
//           </Text>

//         </TouchableOpacity>

//       </View>

//       {/* MAP */}

//       {isTrackingActive ? (

//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           initialRegion={{
//             latitude: userLocation.lat,
//             longitude: userLocation.lng,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//         >

//           {/* USER */}

//           <Marker
//             coordinate={{
//               latitude: userLocation.lat,
//               longitude: userLocation.lng,
//             }}
//             title="Customer"
//           />

//           {/* DELIVERY */}

//           <Marker
//             coordinate={{
//               latitude: deliveryLocation.lat,
//               longitude: deliveryLocation.lng,
//             }}
//             title="Delivery Boy"
//           >
//             <Text style={{
//               fontSize: 30,
//             }}>
//               🛵
//             </Text>
//           </Marker>

//           {/* HISTORY */}

//           {history.length > 1 && (

//             <Polyline
//               coordinates={history}
//               strokeColor="#16a34a"
//               strokeWidth={4}
//             />

//           )}

//         </MapView>

//       ) : (

//         <View style={styles.deliveredContainer}>

//           <Text style={styles.deliveredEmoji}>
//             ✅
//           </Text>

//           <Text style={styles.deliveredTitle}>
//             Order Delivered
//           </Text>

//           <TouchableOpacity
//             style={styles.homeBtn}
//             onPress={() => router.push("/")}
//           >

//             <Text style={styles.homeBtnText}>
//               Back To Home
//             </Text>

//           </TouchableOpacity>

//         </View>

//       )}

//       {/* STATUS CARD */}

//       {isTrackingActive && (

//         <View style={styles.bottomCard}>

//           <Text style={styles.statusLabel}>
//             ORDER STATUS
//           </Text>

//           <Text style={styles.statusText}>
//             {status}
//           </Text>

//         </View>

//       )}

//     </View>
//   );
// }

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//   },

//   map: {
//     flex: 1,
//   },

//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f0fdf4",
//   },

//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   backContainer: {
//     position: "absolute",
//     top: 55,
//     left: 20,
//     zIndex: 999,
//   },

//   backBtn: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 14,
//     elevation: 4,
//   },

//   backText: {
//     color: "#16a34a",
//     fontWeight: "800",
//     fontSize: 16,
//   },

//   bottomCard: {
//     position: "absolute",
//     bottom: 36,
//     left: 16,
//     right: 16,
//     backgroundColor: "#fff",
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderRadius: 22,
//     elevation: 8,
//     alignItems: "center",
//   },

//   statusLabel: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#9ca3af",
//     letterSpacing: 1,
//   },

//   statusText: {
//     marginTop: 6,
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   deliveredContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f0fdf4",
//   },

//   deliveredEmoji: {
//     fontSize: 70,
//     marginBottom: 20,
//   },

//   deliveredTitle: {
//     fontSize: 28,
//     fontWeight: "900",
//     color: "#16a34a",
//   },

//   homeBtn: {
//     marginTop: 30,
//     backgroundColor: "#16a34a",
//     paddingHorizontal: 26,
//     paddingVertical: 14,
//     borderRadius: 16,
//   },

//   homeBtnText: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: 16,
//   },

// });



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
  Alert,
  Linking,
} from "react-native";

import MapView, {
  Marker,
  Polyline,
} from "react-native-maps";

import MapViewDirections
from "react-native-maps-directions";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import * as Location
from "expo-location";

import { socket }
from "@/socket";

export default function TrackOrder() {

  const params =
    useLocalSearchParams();

  const orderId =
    params?.id
      ? String(params.id).trim()
      : "";

  const mapRef =
    useRef<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [status, setStatus] =
    useState("Preparing");

  const [userLocation, setUserLocation] =
    useState({
      lat: 22.5726,
      lng: 88.3639,
    });

  const [deliveryLocation, setDeliveryLocation] =
    useState({
      lat: 22.5726,
      lng: 88.3639,
    });

  const [history, setHistory] =
    useState<any[]>([]);

  const BASE_URL =
    "https://grocerydelivery-backend.onrender.com";

  // ======================================================
  // GET REAL USER LOCATION
  // ======================================================

  useEffect(() => {

    const getCurrentLocation =
      async () => {

        try {

          const { status } =
            await Location.requestForegroundPermissionsAsync();

          if (status !== "granted") {
            return;
          }

          const loc =
            await Location.getCurrentPositionAsync({
              accuracy:
                Location.Accuracy.BestForNavigation,
            });

          setUserLocation({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });

        } catch (err) {

          console.log(
            "LOCATION ERROR:",
            err
          );
        }
      };

    getCurrentLocation();

  }, []);

  // ======================================================
  // LOAD ORDER
  // ======================================================

  useEffect(() => {

    if (!orderId) return;

    const loadOrder = async () => {

      try {

        setLoading(true);

        const res =
          await fetch(
            `${BASE_URL}/api/orders/track/${orderId}`
          );

        const data =
          await res.json();

        console.log(
          "TRACK DATA:",
          data
        );

        // CUSTOMER LOCATION

        if (data?.userLocation) {

          const userLat =
            Number(data.userLocation.lat);

          const userLng =
            Number(data.userLocation.lng);

          if (
            userLat &&
            userLng
          ) {

            setUserLocation({
              lat: userLat,
              lng: userLng,
            });
          }
        }

        // DELIVERY LOCATION

        if (data?.deliveryLocation) {

          const dLat =
            Number(data.deliveryLocation.lat);

          const dLng =
            Number(data.deliveryLocation.lng);

          if (
            dLat &&
            dLng
          ) {

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
        }

        // STATUS

        if (data?.status) {
          setStatus(data.status);
        }

      } catch (err) {

        console.log(
          "LOAD ERROR:",
          err
        );

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

    const handleLocationUpdate =
      (data: any) => {

        if (
          data?.orderId === orderId &&
          data?.location
        ) {

          const newLat =
            Number(data.location.lat);

          const newLng =
            Number(data.location.lng);

          console.log(
            "LIVE LOCATION:",
            newLat,
            newLng
          );

          if (
            !newLat ||
            !newLng
          ) return;

          setDeliveryLocation({
            lat: newLat,
            lng: newLng,
          });

          setHistory(prev => [
            ...prev,
            {
              latitude: newLat,
              longitude: newLng,
            },
          ]);
        }
      };

    const handleOrderUpdate =
      (order: any) => {

        if (
          order?._id === orderId
        ) {

          setStatus(
            order?.status ||
            "Preparing"
          );
        }
      };

    socket.on(
      "locationUpdated",
      handleLocationUpdate
    );

    socket.on(
      "orderUpdated",
      handleOrderUpdate
    );

    return () => {

      socket.off(
        "locationUpdated",
        handleLocationUpdate
      );

      socket.off(
        "orderUpdated",
        handleOrderUpdate
      );
    };

  }, [orderId]);

  // ======================================================
  // OPEN GOOGLE MAPS
  // ======================================================

  const openNavigation = async () => {

    try {

      const url =
        `https://www.google.com/maps/dir/?api=1&destination=${userLocation.lat},${userLocation.lng}&travelmode=driving`;

      await Linking.openURL(url);

    } catch {

      Alert.alert(
        "Failed to open navigation"
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#16a34a"
        />

        <Text style={styles.loadingText}>
          Loading tracking...
        </Text>

      </View>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <View style={styles.container}>

      {/* BACK BUTTON */}

      <View style={styles.backContainer}>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >

          <Text style={styles.backText}>
            ← Back
          </Text>

        </TouchableOpacity>

      </View>

      {/* MAP */}

      <MapView
        ref={mapRef}
        style={styles.map}

        initialRegion={{
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >

        {/* CUSTOMER */}

        <Marker
          coordinate={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          }}
          title="Customer"
        />

        {/* DELIVERY BOY */}

        <Marker
          coordinate={{
            latitude: deliveryLocation.lat,
            longitude: deliveryLocation.lng,
          }}
          title="Delivery Boy"
        >
          <Text style={{
            fontSize: 30,
          }}>
            🛵
          </Text>
        </Marker>

        {/* REAL ROUTE */}

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

          onError={(err) => {
            console.log(
              "ROUTE ERROR:",
              err
            );
          }}
        />

        {/* HISTORY */}

        {history.length > 1 && (

          <Polyline
            coordinates={history}
            strokeColor="#2563eb"
            strokeWidth={4}
          />

        )}

      </MapView>

      {/* BOTTOM CARD */}

      <View style={styles.bottomCard}>

        <Text style={styles.statusLabel}>
          ORDER STATUS
        </Text>

        <Text style={styles.statusText}>
          {status}
        </Text>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={openNavigation}
        >

          <Text style={styles.navBtnText}>
            Open Navigation
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

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
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },

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
  },

  backText: {
    color: "#16a34a",
    fontWeight: "800",
    fontSize: 16,
  },

  bottomCard: {
    position: "absolute",
    bottom: 36,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 22,
    elevation: 8,
    alignItems: "center",
  },

  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 1,
  },

  statusText: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  navBtn: {
    marginTop: 16,
    backgroundColor: "#16a34a",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },

  navBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

});