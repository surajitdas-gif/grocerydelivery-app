
import { router } from 'expo-router';

import {
  useState,
} from 'react';

import {
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

  // ======================================================
  // TEMPORARY MANUAL LOCATION
  // ======================================================

  const [region, setRegion] =
    useState({

      latitude: 22.3727,

      longitude: 87.8644,

      latitudeDelta: 0.01,

      longitudeDelta: 0.01,
    });

  const [marker, setMarker] =
    useState({

      latitude: 22.3727,

      longitude: 87.8644,
    });

  // ======================================================
  // CONFIRM LOCATION
  // ======================================================

  const confirmLocation =
    () => {

      if (
        !marker.latitude
        ||
        !marker.longitude
      ) {

        Alert.alert(
          'Location missing'
        );

        return;
      }

      console.log(
        '📍 SELECTED LOCATION:',
        marker
      );

      router.push({

        pathname: '/address-form',

        params: {

          lat:
            String(marker.latitude),

          lng:
            String(marker.longitude),
        },
      });
    };

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

      {/* LOCATION BADGE */}

      <View style={styles.coordBadge}>

        <Text style={styles.coordText}>

          {marker.latitude.toFixed(5)}
          {" , "}
          {marker.longitude.toFixed(5)}

        </Text>

      </View>

      {/* BUTTONS */}

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

  coordBadge: {

    position: 'absolute',

    top: 55,

    alignSelf: 'center',

    backgroundColor:
      'rgba(0,0,0,0.7)',

    paddingHorizontal: 14,

    paddingVertical: 7,

    borderRadius: 20,
  },

  coordText: {

    color: '#fff',

    fontSize: 12,

    fontWeight: '700',
  },

  bottom: {

    position: 'absolute',

    bottom: 30,

    left: 20,

    right: 20,
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
