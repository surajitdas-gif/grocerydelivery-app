import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';

export default function TrackOrder() {
  const { id } = useLocalSearchParams();

  const [deliveryLocation, setDeliveryLocation] = useState({
    lat: 26.7271,
    lng: 88.3953,
  });

  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    loadLocation();

    const interval = setInterval(() => {
      loadLocation();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadLocation = async () => {
    try {
      const res = await fetch(
        `http://172.20.10.4:5000/api/orders/track/${String(id)}`
      );

      const data = await res.json();

      if (data.deliveryLocation) {
        setDeliveryLocation({
          lat: Number(data.deliveryLocation.lat || 26.7271),
          lng: Number(data.deliveryLocation.lng || 88.3953),
        });
      }

      if (data.status) {
        setStatus(data.status);
      }

    } catch (error) {
      console.log('Track error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: deliveryLocation.lat,
          longitude: deliveryLocation.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: deliveryLocation.lat,
            longitude: deliveryLocation.lng,
          }}
          title="Delivery Boy"
          description={status}
        />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Status: {status}
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

  infoBox: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
  },

  infoText: {
    fontSize: 16,
    fontWeight: '700',
  },
});