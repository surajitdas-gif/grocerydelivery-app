import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  "http://172.20.10.3:5000";

export default function AddressForm() {

  const params =
    useLocalSearchParams();

  // ============================================
  // PARAMS
  // ============================================

  const lat =
    params.lat
      ? String(params.lat)
      : "";

  const lng =
    params.lng
      ? String(params.lng)
      : "";

  // ============================================
  // STATES
  // ============================================

  const [userId, setUserId] =
    useState("");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [altPhone, setAltPhone] =
    useState("");

  const [building, setBuilding] =
    useState("");

  const [area, setArea] =
    useState("");

  const [fullAddress, setFullAddress] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // ============================================
  // LOAD SAVED ADDRESS
  // ============================================

  useEffect(() => {

    loadSavedAddress();

  }, []);

  const loadSavedAddress =
    async () => {

      try {

        const userData =
          await AsyncStorage.getItem(
            "user"
          );

        if (!userData) {

          setLoading(false);
          return;
        }

        const parsed =
          JSON.parse(userData);

        const uid =
          parsed._id;

        setUserId(uid);

        // LOAD SAVED ADDRESS

        const res =
          await fetch(
            `${API_URL}/api/address/${uid}`
          );

        const data =
          await res.json();

        console.log(
          "📦 SAVED ADDRESS:",
          data
        );

        // AUTO FILL

        if (data) {

          setName(
            data.name || ""
          );

          setPhone(
            data.phone || ""
          );

          setAltPhone(
            data.altPhone || ""
          );

          const parts =
            data.address
              ? data.address.split(",")
              : [];

          setBuilding(
            parts[0]?.trim() || ""
          );

          setArea(
            parts[1]?.trim() || ""
          );
        }

        // CURRENT LOCATION TEXT

        if (lat && lng) {

          setFullAddress(
            `Lat: ${lat}, Lng: ${lng}`
          );
        }

      } catch (error) {

        console.log(
          "Address load error:",
          error
        );
      }

      setLoading(false);
    };

  // ============================================
  // CONTINUE
  // ============================================

  const handleContinue =
    async () => {

      if (
        !name ||
        !phone ||
        !building ||
        !area
      ) {

        Alert.alert(
          "Please fill all required fields"
        );

        return;
      }

      if (phone.length < 10) {

        Alert.alert(
          "Invalid phone number"
        );

        return;
      }

      const finalAddress =
        `${building}, ${area}`;

      try {

        // ========================================
        // SAVE ADDRESS TO BACKEND
        // ========================================

        await fetch(
          `${API_URL}/api/address/save`,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              userId,

              name,

              phone,

              altPhone,

              address:
                finalAddress,

              lat,

              lng,
            }),
          }
        );

        console.log(
          "📤 ADDRESS SAVED"
        );

        // ========================================
        // GO TO PAYMENT
        // ========================================

        router.replace({

          pathname:
            "/payment",

          params: {

            lat:
              String(lat),

            lng:
              String(lng),

            address:
              finalAddress,

            name,

            phone,

            altPhone:
              altPhone || "",
          },
        });

      } catch (error) {

        console.log(
          "Address save error:",
          error
        );

        Alert.alert(
          "Address save failed"
        );
      }
    };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <View
        style={styles.loader}
      >

        <Text>
          Loading address...
        </Text>

      </View>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        Confirm Address
      </Text>

      <Text style={styles.label}>
        Auto Location
      </Text>

      <Text style={styles.auto}>
        {fullAddress}
      </Text>

      <Text style={styles.label}>
        Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>
        Phone Number
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Primary phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>
        Alternate Phone
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Optional"
        value={altPhone}
        onChangeText={setAltPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>
        Building / House
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Flat 201"
        value={building}
        onChangeText={setBuilding}
      />

      <Text style={styles.label}>
        Area / Landmark
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Near market"
        value={area}
        onChangeText={setArea}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleContinue}
      >

        <Text style={styles.btnText}>
          Continue to Payment →
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
    },

    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    title: {
      fontSize: 24,
      fontWeight: "800",
      marginBottom: 20,
      color: "#111827",
    },

    label: {
      fontSize: 14,
      fontWeight: "700",
      marginTop: 16,
      marginBottom: 6,
      color: "#374151",
    },

    auto: {
      backgroundColor: "#f3f4f6",
      padding: 14,
      borderRadius: 12,
      color: "#111827",
    },

    input: {
      borderWidth: 1,
      borderColor: "#d1d5db",
      padding: 14,
      borderRadius: 12,
      fontSize: 14,
      backgroundColor: "#fff",
    },

    btn: {
      marginTop: 30,
      backgroundColor: "#16a34a",
      padding: 18,
      borderRadius: 14,
      alignItems: "center",
    },

    btnText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 15,
    },
  });