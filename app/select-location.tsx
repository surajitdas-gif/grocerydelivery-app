import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function SelectLocation() {
  const [region, setRegion] = useState({
    latitude: 22.655,
    longitude: 88.38,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [marker, setMarker] = useState({
    latitude: 22.655,
    longitude: 88.38,
  });

  // 📍 GET CURRENT LOCATION
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});

      const newLocation = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setRegion({
        ...newLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setMarker(newLocation);


    } catch (err) {
      if (__DEV__) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // 📍 CONFIRM LOCATION
  const confirmLocation = () => {
    if (!marker.latitude || !marker.longitude) {
      Alert.alert("Location missing");
      return;
    }



    // ✅ GO TO ADDRESS FORM (NOT PAYMENT)
    router.push({
      pathname: "/address-form",
      params: {
        lat: String(marker.latitude), // ✅ FIX
        lng: String(marker.longitude), // ✅ FIX
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        onPress={(e) => {
          const coord = e.nativeEvent.coordinate;
          setMarker(coord);

        }}
      >
        <Marker
          coordinate={marker}
          draggable
          onDragEnd={(e) => {
            const coord = e.nativeEvent.coordinate;
            setMarker(coord);

          }}
        />
      </MapView>

      {/* 🔥 BUTTONS */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={getCurrentLocation}>
          <Text style={styles.text}>📍 Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirm} onPress={confirmLocation}>
          <Text style={styles.text}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    gap: 10,
  },

  btn: {
    backgroundColor: '#1e40af',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  confirm: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  text: {
    color: '#fff',
    fontWeight: '700',
  },
});