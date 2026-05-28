import { getFreshLocation } from '@/Utils/freshLocation';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function SelectLocation() {

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Detecting your location...');

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

  // ======================================================
  // GET CURRENT LOCATION — forces fresh GPS, no cache
  // ======================================================

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setLoadingMsg('Getting your GPS location...');

      const loc = await getFreshLocation(15000);

      if (!loc) {
        Alert.alert(
          'Could not get location',
          'Make sure GPS is enabled and try again.',
        );
        setLoading(false);
        return;
      }

      const newLocation = {
        latitude: loc.latitude,
        longitude: loc.longitude,
      };

      console.log('📍 FRESH GPS IN SELECT LOCATION:', newLocation);

      setRegion({
        ...newLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setMarker(newLocation);

    } catch (err) {
      console.log(err);
      Alert.alert('Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect on open
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // ======================================================
  // CONFIRM LOCATION
  // ======================================================

  const confirmLocation = () => {
    if (!marker.latitude || !marker.longitude) {
      Alert.alert('Location missing');
      return;
    }
    router.push({
      pathname: '/address-form',
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
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>{loadingMsg}</Text>
        <Text style={styles.loadingSub}>
          Make sure GPS is turned on
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
          const coord = e.nativeEvent.coordinate;
          setMarker(coord);
          setRegion({ ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        }}
      >
        <Marker
          coordinate={marker}
          draggable
          onDragEnd={(e) => {
            const coord = e.nativeEvent.coordinate;
            setMarker(coord);
            setRegion({ ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 });
          }}
        />
      </MapView>

      {/* Coordinate display */}
      <View style={styles.coordBadge}>
        <Text style={styles.coordText}>
          {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={getCurrentLocation}>
          <Text style={styles.text}>📍 Use Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirm} onPress={confirmLocation}>
          <Text style={styles.text}>Continue</Text>
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
    gap: 10,
  },
  loadingText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  loadingSub: {
    fontSize: 12,
    color: '#9ca3af',
  },
  coordBadge: {
    position: 'absolute',
    top: 55,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  coordText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
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