
// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   StatusBar,
//   Linking,
// } from 'react-native';

// import { socket } from "@/socket";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect, router } from 'expo-router';
// import * as Location from 'expo-location';

// const BASE_URL = "http://172.20.10.3:5000";

// export default function DeliveryDashboard() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const trackingOrderRef = useRef<string | null>(null);
 

//   useFocusEffect(
//     useCallback(() => {
//       loadOrders();
//     }, [])
//   );

//   useEffect(() => {
//     socket.on("newOrder", (order) => {
//       setOrders((prev) => [order, ...prev]);
//     });

//     socket.on("orderUpdated", (updatedOrder) => {
//       setOrders((prev) =>
//         prev.map((o) =>
//           o._id === updatedOrder._id ? updatedOrder : o
//         )
//       );
//     });

//     return () => {
//       socket.off("newOrder");
//       socket.off("orderUpdated");
//     };
//   }, []);

//   const startTracking = async (
//   orderId: string
// ) => {

//   trackingOrderRef.current =
//     orderId;

//   const { status } =
//     await Location.requestForegroundPermissionsAsync();

//   if (status !== 'granted') {
//     return;
//   }

//   const subscription =
//     await Location.watchPositionAsync(
//       {
//         accuracy:
//           Location.Accuracy.High,

//         timeInterval: 3000,

//         distanceInterval: 5,
//       },

//       async (location) => {

//         const lat =
//           location.coords.latitude;

//         const lng =
//           location.coords.longitude;

//         console.log(
//           "📍 SENDING LOCATION:",
//           lat,
//           lng
//         );

//         await fetch(
//           `${BASE_URL}/api/orders/update-location/${orderId}`,
//           {
//             method: 'PUT',

//             headers: {
//               'Content-Type':
//                 'application/json',
//             },

//             body: JSON.stringify({
//               lat,
//               lng,
//             }),
//           }
//         );
//       }
//     );

//   return subscription;
// };
//   const stopTracking = () => {
//     trackingOrderRef.current = null;
//     if (intervalRef.current) clearInterval(intervalRef.current);
//   };

//   const loadOrders = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/orders/all-orders`);
//       const data = await res.json();
//       setOrders(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const updateStatus = async (
//   id: string,
//   status: string
// ) => {
//   try {

//     console.log("🚀 CLICKED:", status);

//     const userData =
//       await AsyncStorage.getItem("user");

//     console.log(
//       "📦 STORAGE:",
//       userData
//     );

//     const user = userData
//       ? JSON.parse(userData)
//       : null;

//     console.log(
//       "👤 USER:",
//       user
//     );

//     if (!user || !user._id) {
//       Alert.alert(
//         "User _id missing"
//       );

//       return;
//     }

//     console.log(
//       "✅ deliveryBoyId:",
//       user._id
//     );

//     const res = await fetch(
//       `${BASE_URL}/api/orders/status/${id}`,
//       {
//         method: "PUT",

//         headers: {
//           "Content-Type":
//             "application/json",
//         },

//         body: JSON.stringify({
//           status,
//           deliveryBoyId:
//             user._id,
//         }),
//       }
//     );

//     const data = await res.json();

//     console.log(
//       "📡 RESPONSE:",
//       data
//     );

//     if (!res.ok) {
//       Alert.alert(
//         data.message ||
//           "Update failed"
//       );

//       return;
//     }

//     // 🚚 START LIVE TRACKING
//     if (
//       status ===
//       "Out for Delivery"
//     ) {

//       console.log(
//         "🚚 STARTING LIVE TRACKING"
//       );

//       startTracking(id);
//     }

//     // ✅ STOP TRACKING
//     if (
//       status === "Delivered"
//     ) {

//       console.log(
//         "🛑 STOP TRACKING"
//       );

//       stopTracking();
//     }

//     Alert.alert(
//       "Updated",
//       status
//     );

//     loadOrders();

//   } catch (err) {

//     console.log(
//       "❌ STATUS ERROR:",
//       err
//     );
//   }
// };

//   // ✅ FIXED CALL FUNCTION
//   const callUser = async (phone: string) => {
//     if (!phone) {
//       Alert.alert("No phone number");
//       return;
//     }

//     try {
//       await Linking.openURL(`tel:${phone}`);
//     } catch {
//       Alert.alert("Call failed");
//     }
//   };

//   const logout = async () => {
//     await AsyncStorage.clear();
//     router.replace('/auth/login' as any);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

//       <View style={styles.header}>
//         <Text style={styles.title}>Delivery Dashboard</Text>
//         <TouchableOpacity onPress={logout}>
//           <Text style={styles.logout}>Logout</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView>
//         {orders.map((order) => (
//           <View key={order._id} style={styles.card}>

//             <Text style={styles.orderId}>🆔 {order._id.slice(-6)}</Text>
//             <Text style={styles.status}>📦 {order.status}</Text>
//             <Text style={styles.total}>💰 ₹{order.total}</Text>

//             {/* ✅ FIXED USER INFO */}
//             <Text>👤 {order.customerName || "No Name"}</Text>
//             <Text>📞 {order.customerPhone || "No phone"}</Text>

//             {order.customerAltPhone ? (
//               <Text>☎️ {order.customerAltPhone}</Text>
//             ) : null}

//             <Text>📍 {order.address || "No address"}</Text>

//             <Text>📦 Items:</Text>
//             {order.items?.map((item: any, i: number) => (
//               <Text key={i}>• {item.name} x {item.qty}</Text>
//             ))}

//             {/* ACTION BUTTONS */}
//             <View style={styles.buttonRow}>

//               {/* ✅ FIXED CALL BUTTON */}
//               <TouchableOpacity
//                 style={styles.callBtn}
//                 onPress={() => callUser(order.customerPhone)}
//               >
//                 <Text style={styles.btnText}>📞 Call</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.mapBtn}
//                 onPress={() => router.push(`/track?id=${order._id}`)}
//               >
//                 <Text style={styles.btnText}>🗺 Track</Text>
//               </TouchableOpacity>

//             </View>

//             <View style={styles.statusRow}>
//               <TouchableOpacity
//                 style={styles.smallBtn}
//                 onPress={() => updateStatus(order._id, "Preparing")}
//               >
//                 <Text>🍳</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.smallBtn}
//                 onPress={() => updateStatus(order._id, "Out for Delivery")}
//               >
//                 <Text>🚚</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.smallBtn}
//                 onPress={() => updateStatus(order._id, "Delivered")}
//               >
//                 <Text>✅</Text>
//               </TouchableOpacity>
//             </View>

//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f1f5f9" },

//   header: {
//     backgroundColor: "#0f172a",
//     padding: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   title: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//   },

//   logout: {
//     color: "red",
//     fontWeight: "600",
//   },

//   card: {
//     backgroundColor: "#fff",
//     margin: 10,
//     padding: 15,
//     borderRadius: 12,
//     elevation: 3,
//   },

//   orderId: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },

//   status: {
//     fontWeight: "600",
//     color: "#1d4ed8",
//   },

//   total: {
//     marginBottom: 8,
//   },

//   buttonRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 10,
//   },

//   callBtn: {
//     backgroundColor: "#16a34a",
//     padding: 8,
//     borderRadius: 8,
//     flex: 1,
//   },

//   mapBtn: {
//     backgroundColor: "#2563eb",
//     padding: 8,
//     borderRadius: 8,
//     flex: 1,
//   },

//   btnText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "600",
//   },

//   statusRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 12,
//   },

//   smallBtn: {
//     backgroundColor: "#e5e7eb",
//     padding: 10,
//     borderRadius: 8,
//   },
// });
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Linking,
} from 'react-native';

import { socket } from "@/socket";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  useFocusEffect,
  router,
} from 'expo-router';

import * as Location from 'expo-location';

const BASE_URL =
  "http://172.20.10.3:5000";

export default function DeliveryDashboard() {

  const [orders, setOrders] =
    useState<any[]>([]);

  const trackingOrderRef =
    useRef<string | null>(null);

  const locationSubscriptionRef =
    useRef<any>(null);

  // =========================
  // LOAD ORDERS
  // =========================
  useFocusEffect(
    useCallback(() => {

      loadOrders();

    }, [])
  );

  // =========================
  // SOCKET EVENTS
  // =========================
  useEffect(() => {

    socket.on(
      "newOrder",
      (order) => {

        setOrders((prev) => [
          order,
          ...prev,
        ]);
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

  // =========================
  // START LIVE TRACKING
  // =========================
  const startTracking = async (
    orderId: string
  ) => {

    try {

      trackingOrderRef.current =
        orderId;

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {

        Alert.alert(
          "Location permission denied"
        );

        return;
      }

      // REMOVE OLD WATCH
      if (
        locationSubscriptionRef.current
      ) {

        await locationSubscriptionRef.current.remove();

        locationSubscriptionRef.current =
          null;
      }

      // START NEW WATCH
      locationSubscriptionRef.current =
        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,

            timeInterval: 3000,

            distanceInterval: 5,
          },

          async (location) => {

            const lat =
              location.coords.latitude;

            const lng =
              location.coords.longitude;

            console.log(
              "📍 SENDING LOCATION:",
              lat,
              lng
            );

            await fetch(
              `${BASE_URL}/api/orders/update-location/${orderId}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json',
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

      console.log(
        "❌ TRACKING ERROR:",
        err
      );
    }
  };

  // =========================
  // STOP TRACKING
  // =========================
  const stopTracking = async () => {

    trackingOrderRef.current =
      null;

    if (
      locationSubscriptionRef.current
    ) {

      await locationSubscriptionRef.current.remove();

      locationSubscriptionRef.current =
        null;
    }
  };

  // =========================
  // LOAD ALL ORDERS
  // =========================
  const loadOrders = async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/api/orders/all-orders`
      );

      const data = await res.json();

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (
    id: string,
    status: string
  ) => {

    try {

      console.log(
        "🚀 CLICKED:",
        status
      );

      const userData =
        await AsyncStorage.getItem(
          "user"
        );

      console.log(
        "📦 STORAGE:",
        userData
      );

      const user = userData
        ? JSON.parse(userData)
        : null;

      console.log(
        "👤 USER:",
        user
      );

      if (!user || !user._id) {

        Alert.alert(
          "User _id missing"
        );

        return;
      }

      const res = await fetch(
        `${BASE_URL}/api/orders/status/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,

            deliveryBoyId:
              user._id,
          }),
        }
      );

      const data =
        await res.json();

      console.log(
        "📡 RESPONSE:",
        data
      );

      if (!res.ok) {

        Alert.alert(
          data.message ||
            "Update failed"
        );

        return;
      }

      // START GPS
      if (
        status ===
        "Out for Delivery"
      ) {

        console.log(
          "🚚 STARTING LIVE TRACKING"
        );

        startTracking(id);
      }

      // STOP GPS
      if (
        status ===
        "Delivered"
      ) {

        console.log(
          "🛑 STOP TRACKING"
        );

        stopTracking();
      }

      Alert.alert(
        "Updated",
        status
      );

      loadOrders();

    } catch (err) {

      console.log(
        "❌ STATUS ERROR:",
        err
      );
    }
  };

  // =========================
  // CALL CUSTOMER
  // =========================
  const callUser = async (
    phone: string
  ) => {

    if (!phone) {

      Alert.alert(
        "No phone number"
      );

      return;
    }

    try {

      await Linking.openURL(
        `tel:${phone}`
      );

    } catch {

      Alert.alert(
        "Call failed"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {

    await AsyncStorage.clear();

    router.replace(
      '/auth/login' as any
    );
  };

  return (
    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#0f172a"
      />

      {/* HEADER */}
      <View style={styles.header}>

        <Text style={styles.title}>
          Delivery Dashboard
        </Text>

        <TouchableOpacity
          onPress={logout}
        >

          <Text style={styles.logout}>
            Logout
          </Text>

        </TouchableOpacity>

      </View>

      {/* ORDERS */}
      <ScrollView>

        {orders.map((order) => (

          <View
            key={order._id}
            style={styles.card}
          >

            <Text style={styles.orderId}>
              🆔 {order._id.slice(-6)}
            </Text>

            <Text style={styles.status}>
              📦 {order.status}
            </Text>

            <Text style={styles.total}>
              💰 ₹{order.total}
            </Text>

            <Text>
              👤 {order.customerName || "No Name"}
            </Text>

            <Text>
              📞 {order.customerPhone || "No phone"}
            </Text>

            {order.customerAltPhone ? (
              <Text>
                ☎️ {order.customerAltPhone}
              </Text>
            ) : null}

            <Text>
              📍 {order.address || "No address"}
            </Text>

            <Text style={{ marginTop: 8 }}>
              📦 Items:
            </Text>

            {order.items?.map(
              (
                item: any,
                i: number
              ) => (

                <Text key={i}>
                  • {item.name} x {item.qty}
                </Text>
              )
            )}

            {/* BUTTONS */}
            <View style={styles.buttonRow}>

              <TouchableOpacity
                style={styles.callBtn}
                onPress={() =>
                  callUser(
                    order.customerPhone
                  )
                }
              >

                <Text style={styles.btnText}>
                  📞 Call
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mapBtn}
                onPress={() =>
                  router.push(
                    `/track?id=${order._id}`
                  )
                }
              >

                <Text style={styles.btnText}>
                  🗺 Track
                </Text>

              </TouchableOpacity>

            </View>

            {/* STATUS BUTTONS */}
            <View style={styles.statusRow}>

              <TouchableOpacity
                style={styles.smallBtn}
                onPress={() =>
                  updateStatus(
                    order._id,
                    "Preparing"
                  )
                }
              >

                <Text>🍳</Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallBtn}
                onPress={() =>
                  updateStatus(
                    order._id,
                    "Out for Delivery"
                  )
                }
              >

                <Text>🚚</Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallBtn}
                onPress={() =>
                  updateStatus(
                    order._id,
                    "Delivered"
                  )
                }
              >

                <Text>✅</Text>

              </TouchableOpacity>

            </View>

          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  header: {
    backgroundColor: "#0f172a",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  logout: {
    color: "red",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },

  orderId: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  status: {
    fontWeight: "600",
    color: "#1d4ed8",
  },

  total: {
    marginBottom: 8,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  callBtn: {
    backgroundColor: "#16a34a",
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },

  mapBtn: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },

  smallBtn: {
    backgroundColor: "#e5e7eb",
    padding: 10,
    borderRadius: 8,
  },
});