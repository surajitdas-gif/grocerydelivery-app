
// import { router } from 'expo-router';

// import {
//   useState,
// } from 'react';

// import {
//   Alert,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import MapView, {
//   Marker,
// } from 'react-native-maps';

// export default function SelectLocation() {

//   // ======================================================
//   // TEMPORARY MANUAL LOCATION
//   // ======================================================

//   const [region, setRegion] =
//     useState({

//       latitude: 22.3727,

//       longitude: 87.8644,

//       latitudeDelta: 0.01,

//       longitudeDelta: 0.01,
//     });

//   const [marker, setMarker] =
//     useState({

//       latitude: 22.3727,

//       longitude: 87.8644,
//     });

//   // ======================================================
//   // CONFIRM LOCATION
//   // ======================================================

//   const confirmLocation =
//     () => {

//       if (
//         !marker.latitude
//         ||
//         !marker.longitude
//       ) {

//         Alert.alert(
//           'Location missing'
//         );

//         return;
//       }

//       console.log(
//         '📍 SELECTED LOCATION:',
//         marker
//       );

//       router.push({

//         pathname: '/address-form',

//         params: {

//           lat:
//             String(marker.latitude),

//           lng:
//             String(marker.longitude),
//         },
//       });
//     };

//   // ======================================================
//   // UI
//   // ======================================================

//   return (

//     <View style={{ flex: 1 }}>

//       <MapView

//         style={{ flex: 1 }}

//         region={region}

//         onPress={(e) => {

//           const coord =
//             e.nativeEvent.coordinate;

//           setMarker(coord);

//           setRegion({

//             ...coord,

//             latitudeDelta: 0.01,

//             longitudeDelta: 0.01,
//           });

//         }}
//       >

//         <Marker

//           coordinate={marker}

//           draggable

//           onDragEnd={(e) => {

//             const coord =
//               e.nativeEvent.coordinate;

//             setMarker(coord);

//             setRegion({

//               ...coord,

//               latitudeDelta: 0.01,

//               longitudeDelta: 0.01,
//             });

//           }}
//         />

//       </MapView>

//       {/* LOCATION BADGE */}

//       <View style={styles.coordBadge}>

//         <Text style={styles.coordText}>

//           {marker.latitude.toFixed(5)}
//           {" , "}
//           {marker.longitude.toFixed(5)}

//         </Text>

//       </View>

//       {/* BUTTONS */}

//       <View style={styles.bottom}>

//         <TouchableOpacity
//           style={styles.confirm}
//           onPress={confirmLocation}
//         >

//           <Text style={styles.text}>
//             Continue
//           </Text>

//         </TouchableOpacity>

//       </View>

//     </View>
//   );
// }

// const styles = StyleSheet.create({

//   coordBadge: {

//     position: 'absolute',

//     top: 55,

//     alignSelf: 'center',

//     backgroundColor:
//       'rgba(0,0,0,0.7)',

//     paddingHorizontal: 14,

//     paddingVertical: 7,

//     borderRadius: 20,
//   },

//   coordText: {

//     color: '#fff',

//     fontSize: 12,

//     fontWeight: '700',
//   },

//   bottom: {

//     position: 'absolute',

//     bottom: 30,

//     left: 20,

//     right: 20,
//   },

//   confirm: {

//     backgroundColor: '#16a34a',

//     padding: 16,

//     borderRadius: 14,

//     alignItems: 'center',
//   },

//   text: {

//     color: '#fff',

//     fontWeight: '700',

//     fontSize: 15,
//   },

// });
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function SelectLocation() {
  const [loading, setLoading] = useState(true);

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location access."
        );
        setLoading(false);
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setMarker({
        latitude,
        longitude,
      });

      console.log("📍 USER LOCATION:", latitude, longitude);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Location Error",
        "Unable to fetch current location"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmLocation = () => {
    if (!marker.latitude || !marker.longitude) {
      Alert.alert("Location missing");
      return;
    }

    router.push({
      pathname: "/address-form",
      params: {
        lat: String(marker.latitude),
        lng: String(marker.longitude),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ marginTop: 10 }}>
          Getting your location...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        onPress={(e) => {
          const coord = e.nativeEvent.coordinate;

          setMarker(coord);

          setRegion({
            ...coord,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }}
      >
        <Marker
          coordinate={marker}
          draggable
          onDragEnd={(e) => {
            const coord = e.nativeEvent.coordinate;

            setMarker(coord);

            setRegion({
              ...coord,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }}
        />
      </MapView>

      <View style={styles.coordBadge}>
        <Text style={styles.coordText}>
          {marker.latitude.toFixed(5)} ,{" "}
          {marker.longitude.toFixed(5)}
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.confirm}
          onPress={confirmLocation}
        >
          <Text style={styles.text}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  coordBadge: {
    position: "absolute",
    top: 55,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  coordText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  bottom: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },

  confirm: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});