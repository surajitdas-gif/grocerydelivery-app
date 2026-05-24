

import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView, {
  AnimatedRegion,
  Marker,
  Polyline,
} from 'react-native-maps';

import MapViewDirections from 'react-native-maps-directions';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import Svg, {
  Circle,
  Ellipse,
  Path,
} from 'react-native-svg';

import { socket } from "@/socket";



// SVG BIKE ICON


function BikeIcon({
  size = 50,
}: {
  size?: number;
}) {

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
    >

      {/* BIKE BODY */}
      <Path
        d="M20 36 L28 20 L40 20 L44 28 L36 36 Z"
        fill="#16a34a"
        stroke="#fff"
        strokeWidth="1.5"
      />

      {/* SEAT */}
      <Ellipse
        cx="30"
        cy="19"
        rx="5"
        ry="2"
        fill="#15803d"
      />

      {/* HEAD */}
      <Circle
        cx="38"
        cy="15"
        r="5"
        fill="#fbbf24"
        stroke="#fff"
        strokeWidth="1.5"
      />

      {/* HELMET */}
      <Path
        d="M33 14 Q38 8 43 14"
        fill="#16a34a"
      />

      {/* FRONT WHEEL */}
      <Circle
        cx="44"
        cy="38"
        r="8"
        stroke="#1e3a5f"
        strokeWidth="3"
        fill="#e0f2fe"
      />

      {/* REAR WHEEL */}
      <Circle
        cx="20"
        cy="38"
        r="8"
        stroke="#1e3a5f"
        strokeWidth="3"
        fill="#e0f2fe"
      />

    </Svg>
  );
}



// PULSE RING


function PulseRing() {

  const scale =
    useRef(
      new Animated.Value(0.5)
    ).current;

  const opacity =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {

    const pulse =
      Animated.loop(

        Animated.parallel([

          Animated.timing(scale, {
            toValue: 1.7,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(opacity, {
            toValue: 0,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),

        ])
      );

    pulse.start();

    return () => {
      pulse.stop();
    };

  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#16a34a',
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}


// ======================================================
// ANIMATED BIKE MARKER
// ======================================================

function AnimatedBikeMarker({
  coordinate,
  heading,
}: {
  coordinate: any;
  heading: number;
}) {

  return (

    <Marker.Animated
      coordinate={coordinate as any}
      anchor={{
        x: 0.5,
        y: 0.5,
      }}
      flat={true}
      rotation={heading}
    >

      <View style={bikeStyles.wrapper}>

        <PulseRing />

        <View style={bikeStyles.iconContainer}>

          <BikeIcon size={52} />

        </View>

        <View style={bikeStyles.shadow} />

      </View>

    </Marker.Animated>
  );
}

const bikeStyles = StyleSheet.create({

  wrapper: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    borderWidth: 2,
    borderColor: '#16a34a',
  },

  shadow: {
    position: 'absolute',
    bottom: 5,
    width: 40,
    height: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

});


// ======================================================
// GET ROTATION
// ======================================================

function getBearing(
  start: {
    lat: number;
    lng: number;
  },
  end: {
    lat: number;
    lng: number;
  }
) {

  const toRad = (v: number) =>
    (v * Math.PI) / 180;

  const toDeg = (v: number) =>
    (v * 180) / Math.PI;

  const dLng =
    toRad(end.lng - start.lng);

  const lat1 =
    toRad(start.lat);

  const lat2 =
    toRad(end.lat);

  const y =
    Math.sin(dLng) *
    Math.cos(lat2);

  const x =
    Math.cos(lat1) *
    Math.sin(lat2) -
    Math.sin(lat1) *
    Math.cos(lat2) *
    Math.cos(dLng);

  return (
    toDeg(Math.atan2(y, x)) + 360
  ) % 360;
}


// ======================================================
// MAIN SCREEN
// ======================================================

export default function TrackOrder() {

  const params =
    useLocalSearchParams();

  const orderId =
    params?.id
      ? String(params.id).trim()
      : '';

  const mapRef =
    useRef<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [status, setStatus] =
    useState("Preparing");

  const normalizedStatus =
    status
      ?.toLowerCase()
      ?.trim();

  const isTrackingActive =
    normalizedStatus !==
    "delivered" &&
    normalizedStatus !==
    "cancelled";

  const [distance, setDistance] =
    useState(0);

  const [eta, setEta] =
    useState(0);

  const [heading, setHeading] =
    useState(0);

  const [routeKey, setRouteKey] =
    useState(0);

  const [userLocation, setUserLocation] =
    useState({
      lat: 22.5726,
      lng: 88.3639,
    });

  const [deliveryLocation, setDeliveryLocation] =
    useState({
      lat: 22.5726,
      lng: 88.3639,
    });

  const [history, setHistory] =
    useState<any[]>([]);

  const animatedCoordinate =
    useRef(

      new AnimatedRegion({
        latitude: 22.5726,
        longitude: 88.3639,
        latitudeDelta: 0,
        longitudeDelta: 0,
      })

    ).current;

  const prevLocationRef =
    useRef(deliveryLocation);

  const BASE_URL =
    "http://172.20.10.3:5000";

  const GOOGLE_MAPS_APIKEY =
    "AIzaSyB34LD_TXtjI8pWB5NguZ_zetFErX9ywGY";


  // ======================================================
  // ANIMATE MARKER
  // ======================================================

  const animateMarker = (
    lat: number,
    lng: number
  ) => {

    animatedCoordinate.timing({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0,
      longitudeDelta: 0,
      duration: 3000,
      useNativeDriver: false,
    } as any).start();

  };

  // ======================================================
  // LOAD ORDER
  // ======================================================

  useEffect(() => {

    if (!orderId) return;

    const loadOrder = async () => {

      try {

        setLoading(true);

        const res =
          await fetch(
            `${BASE_URL}/api/orders/track/${orderId}`
          );

        const data =
          await res.json();

        console.log(
          "📦 TRACK DATA:",
          data
        );

        let userLat = 0;
        let userLng = 0;

        let dLat = 0;
        let dLng = 0;

        // USER
        if (data?.userLocation) {

          userLat =
            Number(data.userLocation.lat);

          userLng =
            Number(data.userLocation.lng);

          setUserLocation({
            lat: userLat,
            lng: userLng,
          });
        }

        // DELIVERY
        // DELIVERY
        if (
          data?.deliveryLocation &&
          data.deliveryLocation.lat &&
          data.deliveryLocation.lng
        ) {

          dLat =
            Number(data.deliveryLocation.lat);

          dLng =
            Number(data.deliveryLocation.lng);

          if (
            dLat !== 0 &&
            dLng !== 0
          ) {

            setDeliveryLocation({
              lat: dLat,
              lng: dLng,
            });

            prevLocationRef.current = {
              lat: dLat,
              lng: dLng,
            };

            animateMarker(dLat, dLng);

            setHistory([
              {
                latitude: dLat,
                longitude: dLng,
              },
            ]);

          }

        }


        // STATUS
        if (data?.status) {
          setStatus(data.status);
        }

        // FIT MAP
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
                bottom: 280,
                left: 80,
              },
            }
          );

        }, 1000);

      } catch (err) {

        console.log(
          "❌ LOAD ERROR:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    loadOrder();

  }, [orderId]);


  // ======================================================
  // LIVE TRACKING
  // ======================================================

  useEffect(() => {

    if (!orderId) return;

    const handleLocationUpdate =
      (data: any) => {

        if (
          data?.orderId === orderId &&
          data?.location
        ) {

          const newLat =
            Number(data.location.lat);

          const newLng =
            Number(data.location.lng);

          console.log(
            "🚚 LIVE:",
            newLat,
            newLng
          );

          // ROTATION
          const bearing =
            getBearing(
              prevLocationRef.current,
              {
                lat: newLat,
                lng: newLng,
              }
            );

          setHeading(bearing);

          prevLocationRef.current = {
            lat: newLat,
            lng: newLng,
          };

          // ANIMATE MARKER
          animateMarker(
            newLat,
            newLng
          );

          // UPDATE STATE
          setDeliveryLocation({
            lat: newLat,
            lng: newLng,
          });

          // ROUTE UPDATE
          const movedDistance =
            Math.abs(
              newLat -
              deliveryLocation.lat
            ) +
            Math.abs(
              newLng -
              deliveryLocation.lng
            );

          if (movedDistance > 0.0005) {

            setRouteKey(
              prev => prev + 1
            );
          }

          // HISTORY PATH
          setHistory(prev => [
            ...prev,
            {
              latitude: newLat,
              longitude: newLng,
            },
          ]);

          // CAMERA FOLLOW
          mapRef.current?.animateCamera(
            {
              center: {
                latitude: newLat,
                longitude: newLng,
              },
              heading: bearing,
              pitch: 45,
              zoom: 17,
            },
            {
              duration: 2000,
            }
          );
        }
      };

    const handleOrderUpdate =
      (order: any) => {

        if (order?._id === orderId) {

          setStatus(
            order?.status || 'Preparing'
          );
        }
      };

    socket.on(
      "locationUpdated",
      handleLocationUpdate
    );

    socket.on(
      "orderUpdated",
      handleOrderUpdate
    );

    return () => {

      socket.off(
        "locationUpdated",
        handleLocationUpdate
      );

      socket.off(
        "orderUpdated",
        handleOrderUpdate
      );
    };

  }, [
    orderId,
    deliveryLocation,
  ]);


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
          Loading tracking...
        </Text>

      </View>
    );
  }


  // ======================================================
  // UI
  // ======================================================

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


      {isTrackingActive ? (

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

          {/* USER */}

          <Marker
            coordinate={{
              latitude: userLocation.lat,
              longitude: userLocation.lng,
            }}
          >

            <View style={styles.homeMarker}>

              <Text style={{
                fontSize: 22,
              }}>
                🏠
              </Text>

            </View>

          </Marker>

          {/* BIKE */}

          <AnimatedBikeMarker
            coordinate={animatedCoordinate}
            heading={heading}
          />

          {/* HISTORY LINE */}

          {history.length > 1 && (

            <Polyline
              coordinates={history}
              strokeColor="#86efac"
              strokeWidth={4}
            />

          )}

          {/* LIVE ROUTE */}

          {deliveryLocation &&
            deliveryLocation.lat &&
            deliveryLocation.lng &&
            deliveryLocation.lat !== 0 &&
            deliveryLocation.lng !== 0 && (

              <MapViewDirections

                key={routeKey}

                origin={{
                  latitude:
                    deliveryLocation.lat,
                  longitude:
                    deliveryLocation.lng,
                }}

                destination={{
                  latitude:
                    userLocation.lat,
                  longitude:
                    userLocation.lng,
                }}

                apikey={
                  GOOGLE_MAPS_APIKEY
                }

                mode="DRIVING"

                precision="high"

                strokeWidth={6}

                strokeColor="#16a34a"

                optimizeWaypoints={false}

                resetOnChange={false}

                onReady={(result) => {

                  setDistance(
                    result.distance
                  );

                  setEta(
                    result.duration
                  );
                }}

                onError={(err) => {

                  console.log(
                    "❌ ROUTE ERROR:",
                    err
                  );
                }}

              />
            )}

        </MapView>

      ) : (

        <View style={styles.deliveredContainer}>

          <View style={styles.deliveredCard}>

            <Text style={styles.deliveredEmoji}>
              ✅
            </Text>

            <Text style={styles.deliveredTitle}>
              Order Delivered
            </Text>

            <Text style={styles.deliveredSub}>
              Your order has been delivered successfully
            </Text>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => router.push('/')}
            >

              <Text style={styles.homeBtnText}>
                Back To Home
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      )}

      {/* BOTTOM CARD */}

      {isTrackingActive && (

        <View style={styles.bottomCard}>

          <Text style={styles.arrivalText}>

            {eta < 1
              ? "🏍️ Rider Arrived"
              : `🏍️ ${Math.round(eta)} mins away`}

          </Text>

          <Text style={styles.distanceText}>

            {distance < 1
              ? `${Math.round(distance * 1000)} meters`
              : `${distance.toFixed(1)} km`} away

          </Text>

          <View style={styles.divider} />

          <Text style={styles.statusLabel}>
            ORDER STATUS
          </Text>
          <Text style={styles.statusText}>
            {status || 'Preparing'}
          </Text>

        </View>

      )}

    </View>
  );
}


// ======================================================
// STYLES
// ======================================================
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
    backgroundColor: '#f0fdf4',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },

  backContainer: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 999,
  },

  backBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 4,
  },

  backText: {
    color: '#16a34a',
    fontWeight: '800',
    fontSize: 16,
  },

  homeMarker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
    elevation: 5,
  },

  bottomCard: {
    position: 'absolute',
    bottom: 36,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 22,
    elevation: 8,
    alignItems: 'center',
  },

  arrivalText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16a34a',
  },

  distanceText: {
    marginTop: 6,
    fontSize: 15,
    color: '#6b7280',
  },

  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 14,
  },

  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
  },

  statusText: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  deliveredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 24,
  },

  deliveredCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 8,
  },

  deliveredEmoji: {
    fontSize: 72,
    marginBottom: 18,
  },

  deliveredTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#16a34a',
  },

  deliveredSub: {
    marginTop: 10,
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  homeBtn: {
    marginTop: 28,
    backgroundColor: '#16a34a',
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 16,
  },

  homeBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },

});
