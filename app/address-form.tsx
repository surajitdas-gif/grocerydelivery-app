// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { useLocalSearchParams, router } from "expo-router";

// export default function AddressForm() {
//   const { lat, lng } = useLocalSearchParams();

//   const [building, setBuilding] = useState("");
//   const [area, setArea] = useState("");
//   const [fullAddress, setFullAddress] = useState("");

//   useEffect(() => {
//     // 🔥 AUTO ADDRESS (simple for now)
//     if (lat && lng) {
//       setFullAddress(`Lat: ${lat}, Lng: ${lng}`);
//     }
//   }, [lat, lng]);

  
// const handleContinue = () => {
//   if (!building || !area) {
//     Alert.alert("Please fill all fields");
//     return;
//   }

//   const finalAddress = `${building}, ${area}`;

//   console.log("📤 SENDING:", finalAddress);

//   router.push({
//     pathname: "/payment",
//     params: {
//       lat: String(lat),        // ✅ FIX
//       lng: String(lng),        // ✅ FIX
//       address: String(finalAddress), // ✅ SAFE
//     },
//   });
// };
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Confirm Address</Text>

//       <Text style={styles.label}>Auto Location</Text>
//       <Text style={styles.auto}>{fullAddress}</Text>

//       <Text style={styles.label}>Building / House</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="e.g. Flat 201, Green Residency"
//         value={building}
//         onChangeText={setBuilding}
//       />

//       <Text style={styles.label}>Area / Landmark</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="e.g. Near School / Market"
//         value={area}
//         onChangeText={setArea}
//       />

//       <TouchableOpacity style={styles.btn} onPress={handleContinue}>
//         <Text style={styles.btnText}>Continue to Payment →</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: "800",
//     marginBottom: 20,
//   },

//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginTop: 10,
//   },

//   auto: {
//     backgroundColor: "#f3f4f6",
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 5,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 5,
//   },

//   btn: {
//     marginTop: 30,
//     backgroundColor: "#16a34a",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   btnText: {
//     color: "#fff",
//     fontWeight: "700",
//   },
// });






import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function AddressForm() {
  const params = useLocalSearchParams();

  // ✅ normalize params
  const lat = params.lat ? String(params.lat) : "";
  const lng = params.lng ? String(params.lng) : "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [building, setBuilding] = useState("");
  const [area, setArea] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  useEffect(() => {
    if (lat && lng) {
      setFullAddress(`Lat: ${lat}, Lng: ${lng}`);
    } else {
      setFullAddress("Location not found");
    }
  }, [lat, lng]);
const handleContinue = () => {
  if (!name || !phone || !building || !area) {
    Alert.alert("Please fill all required fields");
    return;
  }

  if (phone.length < 10) {
    Alert.alert("Invalid phone number");
    return;
  }

  const finalAddress = `${building}, ${area}`;

  console.log("📤 ADDRESS → PAYMENT:", {
    name,
    phone,
    altPhone,
    lat,
    lng,
    finalAddress,
  });

  // ✅ IMPORTANT: use replace + pass ALL params
  router.replace({
    pathname: "/payment",
    params: {
      lat: String(lat),
      lng: String(lng),
      address: finalAddress,
      name,
      phone,
      altPhone: altPhone || "",
    },
  });
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Address</Text>

      <Text style={styles.label}>Auto Location</Text>
      <Text style={styles.auto}>{fullAddress}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Primary phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Alternate Phone (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional"
        value={altPhone}
        onChangeText={setAltPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Building / House</Text>
      <TextInput
        style={styles.input}
        placeholder="Flat 201, Green Residency"
        value={building}
        onChangeText={setBuilding}
      />

      <Text style={styles.label}>Area / Landmark</Text>
      <TextInput
        style={styles.input}
        placeholder="Near School / Market"
        value={area}
        onChangeText={setArea}
      />

      <TouchableOpacity style={styles.btn} onPress={handleContinue}>
        <Text style={styles.btnText}>Continue to Payment →</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ✅ STYLES AFTER COMPONENT (SAFE) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },

  auto: {
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },

  btn: {
    marginTop: 30,
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});



