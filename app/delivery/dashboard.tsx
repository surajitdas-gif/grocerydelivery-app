
// // import React, { useState, useCallback, useEffect, useRef } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   Alert,
// //   StatusBar,
// //   Linking,
// // } from 'react-native';

// // import { socket } from "@/socket";
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useFocusEffect, router } from 'expo-router';
// // import * as Location from 'expo-location';

// // const BASE_URL = "http://172.20.10.3:5000";

// // export default function DeliveryDashboard() {
// //   const [orders, setOrders] = useState<any[]>([]);
// //   const trackingOrderRef = useRef<string | null>(null);
 

// //   useFocusEffect(
// //     useCallback(() => {
// //       loadOrders();
// //     }, [])
// //   );

// //   useEffect(() => {
// //     socket.on("newOrder", (order) => {
// //       setOrders((prev) => [order, ...prev]);
// //     });

// //     socket.on("orderUpdated", (updatedOrder) => {
// //       setOrders((prev) =>
// //         prev.map((o) =>
// //           o._id === updatedOrder._id ? updatedOrder : o
// //         )
// //       );
// //     });

// //     return () => {
// //       socket.off("newOrder");
// //       socket.off("orderUpdated");
// //     };
// //   }, []);

// //   const startTracking = async (
// //   orderId: string
// // ) => {

// //   trackingOrderRef.current =
// //     orderId;

// //   const { status } =
// //     await Location.requestForegroundPermissionsAsync();

// //   if (status !== 'granted') {
// //     return;
// //   }

// //   const subscription =
// //     await Location.watchPositionAsync(
// //       {
// //         accuracy:
// //           Location.Accuracy.High,

// //         timeInterval: 3000,

// //         distanceInterval: 5,
// //       },

// //       async (location) => {

// //         const lat =
// //           location.coords.latitude;

// //         const lng =
// //           location.coords.longitude;

// //         console.log(
// //           "📍 SENDING LOCATION:",
// //           lat,
// //           lng
// //         );

// //         await fetch(
// //           `${BASE_URL}/api/orders/update-location/${orderId}`,
// //           {
// //             method: 'PUT',

// //             headers: {
// //               'Content-Type':
// //                 'application/json',
// //             },

// //             body: JSON.stringify({
// //               lat,
// //               lng,
// //             }),
// //           }
// //         );
// //       }
// //     );

// //   return subscription;
// // };
// //   const stopTracking = () => {
// //     trackingOrderRef.current = null;
// //     if (intervalRef.current) clearInterval(intervalRef.current);
// //   };

// //   const loadOrders = async () => {
// //     try {
// //       const res = await fetch(`${BASE_URL}/api/orders/all-orders`);
// //       const data = await res.json();
// //       setOrders(Array.isArray(data) ? data : []);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const updateStatus = async (
// //   id: string,
// //   status: string
// // ) => {
// //   try {

// //     console.log("🚀 CLICKED:", status);

// //     const userData =
// //       await AsyncStorage.getItem("user");

// //     console.log(
// //       "📦 STORAGE:",
// //       userData
// //     );

// //     const user = userData
// //       ? JSON.parse(userData)
// //       : null;

// //     console.log(
// //       "👤 USER:",
// //       user
// //     );

// //     if (!user || !user._id) {
// //       Alert.alert(
// //         "User _id missing"
// //       );

// //       return;
// //     }

// //     console.log(
// //       "✅ deliveryBoyId:",
// //       user._id
// //     );

// //     const res = await fetch(
// //       `${BASE_URL}/api/orders/status/${id}`,
// //       {
// //         method: "PUT",

// //         headers: {
// //           "Content-Type":
// //             "application/json",
// //         },

// //         body: JSON.stringify({
// //           status,
// //           deliveryBoyId:
// //             user._id,
// //         }),
// //       }
// //     );

// //     const data = await res.json();

// //     console.log(
// //       "📡 RESPONSE:",
// //       data
// //     );

// //     if (!res.ok) {
// //       Alert.alert(
// //         data.message ||
// //           "Update failed"
// //       );

// //       return;
// //     }

// //     // 🚚 START LIVE TRACKING
// //     if (
// //       status ===
// //       "Out for Delivery"
// //     ) {

// //       console.log(
// //         "🚚 STARTING LIVE TRACKING"
// //       );

// //       startTracking(id);
// //     }

// //     // ✅ STOP TRACKING
// //     if (
// //       status === "Delivered"
// //     ) {

// //       console.log(
// //         "🛑 STOP TRACKING"
// //       );

// //       stopTracking();
// //     }

// //     Alert.alert(
// //       "Updated",
// //       status
// //     );

// //     loadOrders();

// //   } catch (err) {

// //     console.log(
// //       "❌ STATUS ERROR:",
// //       err
// //     );
// //   }
// // };

// //   // ✅ FIXED CALL FUNCTION
// //   const callUser = async (phone: string) => {
// //     if (!phone) {
// //       Alert.alert("No phone number");
// //       return;
// //     }

// //     try {
// //       await Linking.openURL(`tel:${phone}`);
// //     } catch {
// //       Alert.alert("Call failed");
// //     }
// //   };

// //   const logout = async () => {
// //     await AsyncStorage.clear();
// //     router.replace('/auth/login' as any);
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

// //       <View style={styles.header}>
// //         <Text style={styles.title}>Delivery Dashboard</Text>
// //         <TouchableOpacity onPress={logout}>
// //           <Text style={styles.logout}>Logout</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView>
// //         {orders.map((order) => (
// //           <View key={order._id} style={styles.card}>

// //             <Text style={styles.orderId}>🆔 {order._id.slice(-6)}</Text>
// //             <Text style={styles.status}>📦 {order.status}</Text>
// //             <Text style={styles.total}>💰 ₹{order.total}</Text>

// //             {/* ✅ FIXED USER INFO */}
// //             <Text>👤 {order.customerName || "No Name"}</Text>
// //             <Text>📞 {order.customerPhone || "No phone"}</Text>

// //             {order.customerAltPhone ? (
// //               <Text>☎️ {order.customerAltPhone}</Text>
// //             ) : null}

// //             <Text>📍 {order.address || "No address"}</Text>

// //             <Text>📦 Items:</Text>
// //             {order.items?.map((item: any, i: number) => (
// //               <Text key={i}>• {item.name} x {item.qty}</Text>
// //             ))}

// //             {/* ACTION BUTTONS */}
// //             <View style={styles.buttonRow}>

// //               {/* ✅ FIXED CALL BUTTON */}
// //               <TouchableOpacity
// //                 style={styles.callBtn}
// //                 onPress={() => callUser(order.customerPhone)}
// //               >
// //                 <Text style={styles.btnText}>📞 Call</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.mapBtn}
// //                 onPress={() => router.push(`/track?id=${order._id}`)}
// //               >
// //                 <Text style={styles.btnText}>🗺 Track</Text>
// //               </TouchableOpacity>

// //             </View>

// //             <View style={styles.statusRow}>
// //               <TouchableOpacity
// //                 style={styles.smallBtn}
// //                 onPress={() => updateStatus(order._id, "Preparing")}
// //               >
// //                 <Text>🍳</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.smallBtn}
// //                 onPress={() => updateStatus(order._id, "Out for Delivery")}
// //               >
// //                 <Text>🚚</Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.smallBtn}
// //                 onPress={() => updateStatus(order._id, "Delivered")}
// //               >
// //                 <Text>✅</Text>
// //               </TouchableOpacity>
// //             </View>

// //           </View>
// //         ))}
// //       </ScrollView>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#f1f5f9" },

// //   header: {
// //     backgroundColor: "#0f172a",
// //     padding: 20,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //   },

// //   title: {
// //     color: "#fff",
// //     fontSize: 20,
// //     fontWeight: "bold",
// //   },

// //   logout: {
// //     color: "red",
// //     fontWeight: "600",
// //   },

// //   card: {
// //     backgroundColor: "#fff",
// //     margin: 10,
// //     padding: 15,
// //     borderRadius: 12,
// //     elevation: 3,
// //   },

// //   orderId: {
// //     fontWeight: "bold",
// //     marginBottom: 5,
// //   },

// //   status: {
// //     fontWeight: "600",
// //     color: "#1d4ed8",
// //   },

// //   total: {
// //     marginBottom: 8,
// //   },

// //   buttonRow: {
// //     flexDirection: "row",
// //     gap: 10,
// //     marginTop: 10,
// //   },

// //   callBtn: {
// //     backgroundColor: "#16a34a",
// //     padding: 8,
// //     borderRadius: 8,
// //     flex: 1,
// //   },

// //   mapBtn: {
// //     backgroundColor: "#2563eb",
// //     padding: 8,
// //     borderRadius: 8,
// //     flex: 1,
// //   },

// //   btnText: {
// //     color: "#fff",
// //     textAlign: "center",
// //     fontWeight: "600",
// //   },

// //   statusRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-around",
// //     marginTop: 12,
// //   },

// //   smallBtn: {
// //     backgroundColor: "#e5e7eb",
// //     padding: 10,
// //     borderRadius: 8,
// //   },
// // });
// import React, {
//   useState,
//   useCallback,
//   useEffect,
//   useRef,
// } from 'react';

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

// import {
//   useFocusEffect,
//   router,
// } from 'expo-router';

// import * as Location from 'expo-location';

// const BASE_URL =
//   "http://172.20.10.3:5000";

// export default function DeliveryDashboard() {

//   const [orders, setOrders] =
//     useState<any[]>([]);

//   const trackingOrderRef =
//     useRef<string | null>(null);

//   const locationSubscriptionRef =
//     useRef<any>(null);

//   // =========================
//   // LOAD ORDERS
//   // =========================
//   useFocusEffect(
//     useCallback(() => {

//       loadOrders();

//     }, [])
//   );

//   // =========================
//   // SOCKET EVENTS
//   // =========================
//   useEffect(() => {

//     socket.on(
//       "newOrder",
//       (order) => {

//         setOrders((prev) => [
//           order,
//           ...prev,
//         ]);
//       }
//     );

//     socket.on(
//       "orderUpdated",
//       (updatedOrder) => {

//         setOrders((prev) =>
//           prev.map((o) =>
//             o._id === updatedOrder._id
//               ? updatedOrder
//               : o
//           )
//         );
//       }
//     );

//     return () => {

//       socket.off("newOrder");

//       socket.off("orderUpdated");
//     };

//   }, []);

//   // =========================
//   // START LIVE TRACKING
//   // =========================
//   const startTracking = async (
//     orderId: string
//   ) => {

//     try {

//       trackingOrderRef.current =
//         orderId;

//       const { status } =
//         await Location.requestForegroundPermissionsAsync();

//       if (status !== 'granted') {

//         Alert.alert(
//           "Location permission denied"
//         );

//         return;
//       }

//       // REMOVE OLD WATCH
//       if (
//         locationSubscriptionRef.current
//       ) {

//         await locationSubscriptionRef.current.remove();

//         locationSubscriptionRef.current =
//           null;
//       }

//       // START NEW WATCH
//       locationSubscriptionRef.current =
//         await Location.watchPositionAsync(
//           {
//             accuracy:
//               Location.Accuracy.High,

//             timeInterval: 3000,

//             distanceInterval: 5,
//           },

//           async (location) => {

//             const lat =
//               location.coords.latitude;

//             const lng =
//               location.coords.longitude;

//             console.log(
//               "📍 SENDING LOCATION:",
//               lat,
//               lng
//             );

//             await fetch(
//               `${BASE_URL}/api/orders/update-location/${orderId}`,
//               {
//                 method: 'PUT',

//                 headers: {
//                   'Content-Type':
//                     'application/json',
//                 },

//                 body: JSON.stringify({
//                   lat,
//                   lng,
//                 }),
//               }
//             );
//           }
//         );

//     } catch (err) {

//       console.log(
//         "❌ TRACKING ERROR:",
//         err
//       );
//     }
//   };

//   // =========================
//   // STOP TRACKING
//   // =========================
//   const stopTracking = async () => {

//     trackingOrderRef.current =
//       null;

//     if (
//       locationSubscriptionRef.current
//     ) {

//       await locationSubscriptionRef.current.remove();

//       locationSubscriptionRef.current =
//         null;
//     }
//   };

//   // =========================
//   // LOAD ALL ORDERS
//   // =========================
//   const loadOrders = async () => {

//     try {

//       const res = await fetch(
//         `${BASE_URL}/api/orders/all-orders`
//       );

//       const data = await res.json();

//       setOrders(
//         Array.isArray(data)
//           ? data
//           : []
//       );

//     } catch (err) {

//       console.log(err);
//     }
//   };

//   // =========================
//   // UPDATE STATUS
//   // =========================
//   const updateStatus = async (
//     id: string,
//     status: string
//   ) => {

//     try {

//       console.log(
//         "🚀 CLICKED:",
//         status
//       );

//       const userData =
//         await AsyncStorage.getItem(
//           "user"
//         );

//       console.log(
//         "📦 STORAGE:",
//         userData
//       );

//       const user = userData
//         ? JSON.parse(userData)
//         : null;

//       console.log(
//         "👤 USER:",
//         user
//       );

//       if (!user || !user._id) {

//         Alert.alert(
//           "User _id missing"
//         );

//         return;
//       }

//       const res = await fetch(
//         `${BASE_URL}/api/orders/status/${id}`,
//         {
//           method: "PUT",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             status,

//             deliveryBoyId:
//               user._id,
//           }),
//         }
//       );

//       const data =
//         await res.json();

//       console.log(
//         "📡 RESPONSE:",
//         data
//       );

//       if (!res.ok) {

//         Alert.alert(
//           data.message ||
//             "Update failed"
//         );

//         return;
//       }

//       // START GPS
//       if (
//         status ===
//         "Out for Delivery"
//       ) {

//         console.log(
//           "🚚 STARTING LIVE TRACKING"
//         );

//         startTracking(id);
//       }

//       // STOP GPS
//       if (
//         status ===
//         "Delivered"
//       ) {

//         console.log(
//           "🛑 STOP TRACKING"
//         );

//         stopTracking();
//       }

//       Alert.alert(
//         "Updated",
//         status
//       );

//       loadOrders();

//     } catch (err) {

//       console.log(
//         "❌ STATUS ERROR:",
//         err
//       );
//     }
//   };

//   // =========================
//   // CALL CUSTOMER
//   // =========================
//   const callUser = async (
//     phone: string
//   ) => {

//     if (!phone) {

//       Alert.alert(
//         "No phone number"
//       );

//       return;
//     }

//     try {

//       await Linking.openURL(
//         `tel:${phone}`
//       );

//     } catch {

//       Alert.alert(
//         "Call failed"
//       );
//     }
//   };

//   // =========================
//   // LOGOUT
//   // =========================
//   const logout = async () => {

//     await AsyncStorage.clear();

//     router.replace(
//       '/auth/login' as any
//     );
//   };

//   return (
//     <View style={styles.container}>

//       <StatusBar
//         barStyle="light-content"
//         backgroundColor="#0f172a"
//       />

//       {/* HEADER */}
//       <View style={styles.header}>

//         <Text style={styles.title}>
//           Delivery Dashboard
//         </Text>

//         <TouchableOpacity
//           onPress={logout}
//         >

//           <Text style={styles.logout}>
//             Logout
//           </Text>

//         </TouchableOpacity>

//       </View>

//       {/* ORDERS */}
//       <ScrollView>

//         {orders.map((order) => (

//           <View
//             key={order._id}
//             style={styles.card}
//           >

//             <Text style={styles.orderId}>
//               🆔 {order._id.slice(-6)}
//             </Text>

//             <Text style={styles.status}>
//               📦 {order.status}
//             </Text>

//             <Text style={styles.total}>
//               💰 ₹{order.total}
//             </Text>

//             <Text>
//               👤 {order.customerName || "No Name"}
//             </Text>

//             <Text>
//               📞 {order.customerPhone || "No phone"}
//             </Text>

//             {order.customerAltPhone ? (
//               <Text>
//                 ☎️ {order.customerAltPhone}
//               </Text>
//             ) : null}

//             <Text>
//               📍 {order.address || "No address"}
//             </Text>

//             <Text style={{ marginTop: 8 }}>
//               📦 Items:
//             </Text>

//             {order.items?.map(
//               (
//                 item: any,
//                 i: number
//               ) => (

//                 <Text key={i}>
//                   • {item.name} x {item.qty}
//                 </Text>
//               )
//             )}

//             {/* BUTTONS */}
//             <View style={styles.buttonRow}>

//               <TouchableOpacity
//                 style={styles.callBtn}
//                 onPress={() =>
//                   callUser(
//                     order.customerPhone
//                   )
//                 }
//               >

//                 <Text style={styles.btnText}>
//                   📞 Call
//                 </Text>

//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.mapBtn}
//                 onPress={() =>
//                   router.push(
//                     `/track?id=${order._id}`
//                   )
//                 }
//               >

//                 <Text style={styles.btnText}>
//                   🗺 Track
//                 </Text>

//               </TouchableOpacity>

//             </View>

//             {/* STATUS BUTTONS */}
//             <View style={styles.statusRow}>

//               <TouchableOpacity
//                 style={styles.smallBtn}
//                 onPress={() =>
//                   updateStatus(
//                     order._id,
//                     "Preparing"
//                   )
//                 }
//               >

//                 <Text>🍳</Text>

//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.smallBtn}
//                 onPress={() =>
//                   updateStatus(
//                     order._id,
//                     "Out for Delivery"
//                   )
//                 }
//               >

//                 <Text>🚚</Text>

//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.smallBtn}
//                 onPress={() =>
//                   updateStatus(
//                     order._id,
//                     "Delivered"
//                   )
//                 }
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

//   container: {
//     flex: 1,
//     backgroundColor: "#f1f5f9",
//   },

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
  Dimensions,
} from 'react-native';

import { socket } from "@/socket";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, router } from 'expo-router';
import * as Location from 'expo-location';

const BASE_URL = "http://172.20.10.3:5000";
const { width } = Dimensions.get('window');

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  'Pending':          { color: '#92400e', bg: '#fef3c7', dot: '#f59e0b' },
  'Preparing':        { color: '#1e40af', bg: '#dbeafe', dot: '#3b82f6' },
  'Out for Delivery': { color: '#065f46', bg: '#d1fae5', dot: '#10b981' },
  'Delivered':        { color: '#166534', bg: '#dcfce7', dot: '#22c55e' },
};

const getStatusStyle = (status: string) =>
  STATUS_CONFIG[status] ?? { color: '#374151', bg: '#f3f4f6', dot: '#9ca3af' };

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
      locationSubscriptionRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        async (location) => {
          const lat = location.coords.latitude;
          const lng = location.coords.longitude;
          console.log("📍 SENDING LOCATION:", lat, lng);
          await fetch(`${BASE_URL}/api/orders/update-location/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }),
          });
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
                <Text style={styles.amount}>₹{order.total}</Text>

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
                    onPress={() => router.push(`/track?id=${order._id}`)}
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
                  <TouchableOpacity
                    style={styles.statusBtn}
                    onPress={() => updateStatus(order._id, "Preparing")}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusBtnIcon}>🍳</Text>
                    <Text style={styles.statusBtnLabel}>Preparing</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusBtn, styles.statusBtnOrange]}
                    onPress={() => updateStatus(order._id, "Out for Delivery")}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusBtnIcon}>🚚</Text>
                    <Text style={[styles.statusBtnLabel, { color: '#92400e' }]}>Out for{'\n'}Delivery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusBtn, styles.statusBtnGreen]}
                    onPress={() => updateStatus(order._id, "Delivered")}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusBtnIcon}>✅</Text>
                    <Text style={[styles.statusBtnLabel, { color: '#166534' }]}>Delivered</Text>
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
});