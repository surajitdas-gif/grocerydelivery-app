import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: 26.7305,
    longitude: 88.4001,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryLocation((prev) => ({
        latitude: prev.latitude - 0.0005,
        longitude: prev.longitude - 0.0005,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 26.7271,
          longitude: 88.3953,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{
            latitude: 26.7271,
            longitude: 88.3953,
          }}
          title="Your Location"
          description="Delivery address"
        />

        <Marker
          coordinate={deliveryLocation}
          title="Delivery Boy"
          description="Coming to you"
        />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.text}>
          Delivery boy moving live 🚚
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
    elevation: 5,
  },

  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});