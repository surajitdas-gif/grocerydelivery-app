


// import React, {
//   useEffect,
//   useState,
//   useRef,
// } from 'react';

// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';

// import MapView, {
//   Marker,
// } from 'react-native-maps';

// import MapViewDirections from 'react-native-maps-directions';

// import {
//   useLocalSearchParams,
//   router,
// } from 'expo-router';

// import { socket } from "@/socket";

// export default function TrackOrder() {

//   const params = useLocalSearchParams();

//   const orderId =
//     params.id ? String(params.id) : "";

//   const mapRef = useRef<any>(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [deliveryLocation, setDeliveryLocation] =
//     useState({
//       lat: 22.5726,
//       lng: 88.3639,
//     });

//   const [userLocation, setUserLocation] =
//     useState({
//       lat: 22.5726,
//       lng: 88.3639,
//     });

//   const [status, setStatus] =
//     useState("Preparing");

//   const [distance, setDistance] =
//     useState(0);

//   const [eta, setEta] =
//     useState(0);

//   const BASE_URL =
//     "http://172.20.10.3:5000";

//   const GOOGLE_MAPS_APIKEY =
//     "AIzaSyB34LD_TXtjI8pWB5NguZ_zetFErX9ywGY";

//   // =========================
//   // LOAD ORDER
//   // =========================
//   useEffect(() => {

//     if (!orderId) return;

//     const loadOrder = async () => {

//       try {

//         setLoading(true);

//         const res = await fetch(
//           `${BASE_URL}/api/orders/track/${orderId}`
//         );

//         const data = await res.json();

//         console.log(
//           "📦 TRACK DATA:",
//           data
//         );

//         let userLat = 0;
//         let userLng = 0;

//         let dLat = 0;
//         let dLng = 0;

//         // USER LOCATION
//         if (data?.userLocation) {

//           userLat = Number(
//             data.userLocation.lat
//           );

//           userLng = Number(
//             data.userLocation.lng
//           );

//           setUserLocation({
//             lat: userLat,
//             lng: userLng,
//           });
//         }

//         // DELIVERY LOCATION
//         if (data?.deliveryLocation) {

//           dLat = Number(
//             data.deliveryLocation.lat
//           );

//           dLng = Number(
//             data.deliveryLocation.lng
//           );

//           setDeliveryLocation({
//             lat: dLat,
//             lng: dLng,
//           });
//         }

//         // STATUS
//         if (data?.status) {
//           setStatus(data.status);
//         }

//         // FIT MAP ONLY ONCE
//         setTimeout(() => {

//           mapRef.current?.fitToCoordinates(
//             [
//               {
//                 latitude: userLat,
//                 longitude: userLng,
//               },
//               {
//                 latitude: dLat,
//                 longitude: dLng,
//               },
//             ],
//             {
//               animated: true,
//               edgePadding: {
//                 top: 120,
//                 right: 60,
//                 bottom: 250,
//                 left: 60,
//               },
//             }
//           );

//         }, 1000);

//       } catch (err) {

//         console.log(
//           "❌ TRACK ERROR:",
//           err
//         );

//       } finally {

//         setLoading(false);
//       }
//     };

//     loadOrder();

//   }, [orderId]);

//   // =========================
//   // LIVE TRACKING
//   // =========================
//   useEffect(() => {

//     if (!orderId) return;

//     socket.on(
//       "locationUpdated",
//       (data) => {

//         if (
//           data?.orderId === orderId &&
//           data?.location
//         ) {

//           const newLat = Number(
//             data.location.lat
//           );

//           const newLng = Number(
//             data.location.lng
//           );

//           console.log(
//             "🚚 LIVE UPDATE:",
//             newLat,
//             newLng
//           );

//           // UPDATE DELIVERY LOCATION
//           setDeliveryLocation({
//             lat: newLat,
//             lng: newLng,
//           });

//           // SMOOTH CAMERA MOVE
//           mapRef.current?.animateCamera(
//             {
//               center: {
//                 latitude: newLat,
//                 longitude: newLng,
//               },
//               zoom: 17,
//             },
//             {
//               duration: 1000,
//             }
//           );
//         }
//       }
//     );

//     socket.on(
//       "orderUpdated",
//       (order) => {

//         if (order?._id === orderId) {
//           setStatus(order.status);
//         }
//       }
//     );

//     return () => {

//       socket.off("locationUpdated");

//       socket.off("orderUpdated");
//     };

//   }, [orderId]);

//   // =========================
//   // LOADING
//   // =========================
//   if (loading) {

//     return (
//       <View style={styles.loader}>

//         <ActivityIndicator
//           size="large"
//           color="#2563eb"
//         />

//         <Text style={{ marginTop: 10 }}>
//           Loading tracking...
//         </Text>

//       </View>
//     );
//   }

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
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         showsUserLocation={false}
//         showsCompass={true}
//         showsTraffic={true}
//         initialRegion={{
//           latitude: userLocation.lat,
//           longitude: userLocation.lng,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >

//         {/* USER MARKER */}
//         <Marker
//           coordinate={{
//             latitude: userLocation.lat,
//             longitude: userLocation.lng,
//           }}
//           title="Your Location"
//           pinColor="blue"
//         />

//         {/* DELIVERY MARKER */}
//         <Marker
//           coordinate={{
//             latitude: deliveryLocation.lat,
//             longitude: deliveryLocation.lng,
//           }}
//           title="Delivery Boy"
//           description={status}
//           flat={true}
//         />

//         {/* ROUTE */}
//         {deliveryLocation.lat !== 0 &&
//         deliveryLocation.lng !== 0 &&
//         userLocation.lat !== 0 &&
//         userLocation.lng !== 0 && (


// <MapViewDirections
//   origin={{
//     latitude: deliveryLocation.lat,
//     longitude: deliveryLocation.lng,
//   }}

//   destination={{
//     latitude: userLocation.lat,
//     longitude: userLocation.lng,
//   }}

//   apikey={GOOGLE_MAPS_APIKEY}

//   strokeWidth={6}

//   strokeColor="green"

//   precision="high"

//   timePrecision="now"

//   resetOnChange={false}

//   optimizeWaypoints={false}

//   onReady={(result) => {

//     console.log(
//       "🛣 DISTANCE:",
//       result.distance
//     );

//     console.log(
//       "⏱ ETA:",
//       result.duration
//     );

//     setDistance(result.distance);

//     setEta(result.duration);
//   }}

//   onError={(err) => {

//     console.log(
//       "❌ DIRECTIONS ERROR:",
//       err
//     );
//   }}
// />  

// )}
//  </MapView>

//       {/* INFO BOX */}
//       <View style={styles.infoBox}>

//         <Text style={styles.status}>
//           {status}
//         </Text>

//         <Text style={styles.distance}>
//           🚚 {distance.toFixed(2)} km away
//         </Text>

//         <Text style={styles.distance}>
//           ⏱ ETA: {eta.toFixed(0)} mins
//         </Text>

//       </View>

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
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   infoBox: {
//     position: 'absolute',
//     bottom: 40,
//     left: 20,
//     right: 20,
//     backgroundColor: '#fff',
//     padding: 18,
//     borderRadius: 18,
//     elevation: 5,
//   },

//   status: {
//     fontSize: 18,
//     fontWeight: '800',
//     textAlign: 'center',
//   },

//   distance: {
//     marginTop: 8,
//     fontSize: 15,
//     textAlign: 'center',
//     color: '#4b5563',
//   },

//   backContainer: {
//     position: 'absolute',
//     top: 55,
//     left: 20,
//     zIndex: 20,
//   },

//   backBtn: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 14,
//     elevation: 4,
//   },

//   backText: {
//     color: '#2563eb',
//     fontWeight: '800',
//     fontSize: 16,
//   },
// });
import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import MapView, {
  Marker,
} from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

import {
  useLocalSearchParams,
  router,
} from 'expo-router';

import { socket } from "@/socket";

export default function TrackOrder() {

  const params = useLocalSearchParams();

  const orderId =
    params.id ? String(params.id) : "";

  const mapRef = useRef<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [routeKey, setRouteKey] =
    useState(0);

  const [deliveryLocation, setDeliveryLocation] =
    useState({
      lat: 22.5726,
      lng: 88.3639,
    });

  const [userLocation, setUserLocation] =
    useState({
      lat: 22.5726,
      lng: 88.3639,
    });

  const [status, setStatus] =
    useState("Preparing");

  const [distance, setDistance] =
    useState(0);

  const [eta, setEta] =
    useState(0);

  const BASE_URL =
    "http://172.20.10.3:5000";

  const GOOGLE_MAPS_APIKEY =
    "AIzaSyB34LD_TXtjI8pWB5NguZ_zetFErX9ywGY";

  // =========================
  // LOAD ORDER
  // =========================
  useEffect(() => {

    if (!orderId) return;

    const loadOrder = async () => {

      try {

        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/api/orders/track/${orderId}`
        );

        const data = await res.json();

        console.log(
          "📦 TRACK DATA:",
          data
        );

        let userLat = 0;
        let userLng = 0;

        let dLat = 0;
        let dLng = 0;

        // USER LOCATION
        if (data?.userLocation) {

          userLat = Number(
            data.userLocation.lat
          );

          userLng = Number(
            data.userLocation.lng
          );

          setUserLocation({
            lat: userLat,
            lng: userLng,
          });
        }

        // DELIVERY LOCATION
        if (data?.deliveryLocation) {

          dLat = Number(
            data.deliveryLocation.lat
          );

          dLng = Number(
            data.deliveryLocation.lng
          );

          setDeliveryLocation({
            lat: dLat,
            lng: dLng,
          });
        }

        // STATUS
        if (data?.status) {
          setStatus(data.status);
        }

        // INITIAL MAP FIT
        setTimeout(() => {

          mapRef.current?.fitToCoordinates(
            [
              {
                latitude: userLat,
                longitude: userLng,
              },
              {
                latitude: dLat,
                longitude: dLng,
              },
            ],
            {
              animated: true,
              edgePadding: {
                top: 120,
                right: 80,
                bottom: 250,
                left: 80,
              },
            }
          );

        }, 1000);

      } catch (err) {

        console.log(
          "❌ TRACK ERROR:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    loadOrder();

  }, [orderId]);

  // =========================
  // LIVE TRACKING
  // =========================
  useEffect(() => {

    if (!orderId) return;

    socket.on(
      "locationUpdated",
      (data) => {

        if (
          data?.orderId === orderId &&
          data?.location
        ) {

          const newLat = Number(
            data.location.lat
          );

          const newLng = Number(
            data.location.lng
          );

          console.log(
            "🚚 LIVE UPDATE:",
            newLat,
            newLng
          );

          // UPDATE LOCATION
          setDeliveryLocation({
            lat: newLat,
            lng: newLng,
          });

          // FORCE ROAD RECALCULATION
          setRouteKey(prev => prev + 1);

          // KEEP BOTH VISIBLE
          mapRef.current?.fitToCoordinates(
            [
              {
                latitude: newLat,
                longitude: newLng,
              },
              {
                latitude: userLocation.lat,
                longitude: userLocation.lng,
              },
            ],
            {
              animated: true,
              edgePadding: {
                top: 120,
                right: 80,
                bottom: 250,
                left: 80,
              },
            }
          );
        }
      }
    );

    socket.on(
      "orderUpdated",
      (order) => {

        if (order?._id === orderId) {
          setStatus(order.status);
        }
      }
    );

    return () => {

      socket.off("locationUpdated");

      socket.off("orderUpdated");
    };

  }, [orderId, userLocation]);

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#2563eb"
        />

        <Text style={{ marginTop: 10 }}>
          Loading tracking...
        </Text>

      </View>
    );
  }

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
        showsTraffic={true}
        showsCompass={true}
        initialRegion={{
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >

        {/* USER MARKER */}
        <Marker
          coordinate={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          }}
          title="Your Location"
          pinColor="blue"
        />

        {/* DELIVERY MARKER */}
        <Marker.Animated
          coordinate={{
            latitude: deliveryLocation.lat,
            longitude: deliveryLocation.lng,
          }}
          title="Delivery Boy"
          description={status}
          flat={true}
        />

        {/* LIVE ROAD ROUTE */}
        {deliveryLocation.lat !== 0 &&
        deliveryLocation.lng !== 0 &&
        userLocation.lat !== 0 &&
        userLocation.lng !== 0 && (

          <MapViewDirections

            key={routeKey}

            origin={{
              latitude: deliveryLocation.lat,
              longitude: deliveryLocation.lng,
            }}

            destination={{
              latitude: userLocation.lat,
              longitude: userLocation.lng,
            }}

            apikey={GOOGLE_MAPS_APIKEY}

            mode="DRIVING"

            precision="high"

            timePrecision="now"

            strokeWidth={6}

            strokeColor="#16a34a"

            optimizeWaypoints={false}

            resetOnChange={false}

            splitWaypoints={false}

            onStart={(params) => {

              console.log(
                "🚚 ROUTE START:",
                params
              );
            }}

            onReady={(result) => {

              console.log(
                "🛣 ACTUAL ROAD DISTANCE:",
                result.distance
              );

              console.log(
                "⏱ REAL ETA:",
                result.duration
              );

              setDistance(result.distance);

              setEta(result.duration);
            }}

            onError={(err) => {

              console.log(
                "❌ DIRECTIONS ERROR:",
                err
              );
            }}
          />
        )}

      </MapView>

      {/* INFO BOX */}
      <View style={styles.infoBox}>

        <Text style={styles.status}>
          {status}
        </Text>

        <Text style={styles.distance}>
          🚚 {
            distance < 1
              ? `${Math.round(distance * 1000)} m away`
              : `${distance.toFixed(1)} km away`
          }
        </Text>

        <Text style={styles.distance}>
          ⏱ ETA: {eta.toFixed(0)} mins
        </Text>

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
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoBox: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    elevation: 5,
  },

  status: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  distance: {
    marginTop: 8,
    fontSize: 15,
    textAlign: 'center',
    color: '#4b5563',
  },

  backContainer: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 20,
  },

  backBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 4,
  },

  backText: {
    color: '#2563eb',
    fontWeight: '800',
    fontSize: 16,
  },
});