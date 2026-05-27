
import * as Location from 'expo-location';

import { router } from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, {
  Marker,
} from 'react-native-maps';

export default function SelectLocation() {

  const [loading, setLoading] =
    useState(true);

  const [region, setRegion] =
    useState({
      latitude: 22.655,
      longitude: 88.38,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

  const [marker, setMarker] =
    useState({
      latitude: 22.655,
      longitude: 88.38,
    });

  // ======================================================
  // GET CURRENT LOCATION
  // ======================================================

  const getCurrentLocation =
    async () => {

      try {

        setLoading(true);

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {

          Alert.alert(
            'Permission denied'
          );

          return;
        }

        const loc =
          await Location.getCurrentPositionAsync({
            accuracy:
              Location.Accuracy.BestForNavigation,
          });

        const newLocation = {
          latitude:
            loc.coords.latitude,
          longitude:
            loc.coords.longitude,
        };

        console.log(
          "REAL GPS:",
          newLocation
        );

        setRegion({
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        setMarker(newLocation);

      } catch (err) {

        console.log(err);

        Alert.alert(
          "Failed to get location"
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // AUTO DETECT ON OPEN
  // ======================================================

  useEffect(() => {

    getCurrentLocation();

  }, []);

  // ======================================================
  // CONFIRM LOCATION
  // ======================================================

  const confirmLocation = () => {

    if (
      !marker.latitude ||
      !marker.longitude
    ) {

      Alert.alert(
        "Location missing"
      );

      return;
    }

    // AUTO OPEN ADDRESS FORM

    router.push({
      pathname: "/address-form",

      params: {
        lat: String(marker.latitude),
        lng: String(marker.longitude),
      },
    });
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
          Detecting your location...
        </Text>

      </View>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <View style={{ flex: 1 }}>

      <MapView
        style={{ flex: 1 }}

        region={region}

        onPress={(e) => {

          const coord =
            e.nativeEvent.coordinate;

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

            const coord =
              e.nativeEvent.coordinate;

            setMarker(coord);

            setRegion({
              ...coord,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }}
        />

      </MapView>

      {/* BUTTONS */}

      <View style={styles.bottom}>

        <TouchableOpacity
          style={styles.btn}
          onPress={getCurrentLocation}
        >

          <Text style={styles.text}>
            📍 Use Current Location
          </Text>

        </TouchableOpacity>

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },

  bottom: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    gap: 10,
  },

  btn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  confirm: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

});