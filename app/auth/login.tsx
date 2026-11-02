
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const BASE_URL = 'https://grocerydelivery-backend.onrender.com'; //
// export default function LoginScreen() {
//   const [phone, setPhone] =
//     useState('');

//   const [otp, setOtp] =
//     useState('');

//   const [otpSent, setOtpSent] =
//     useState(false);

//   const [loading, setLoading] = useState(false);

//   const btnScale = useRef(new Animated.Value(1)).current;


//   useEffect(() => {

//     const checkLogin = async () => {

//       const token =
//         await AsyncStorage.getItem(
//           'token'
//         );

//       const userRole =
//         await AsyncStorage.getItem(
//           'userRole'
//         );

//       if (token) {

//         switch (userRole) {

//           case 'user':

//             router.replace(
//               '/(tabs)/home'
//             );

//             break;

//           case 'delivery':

//             router.replace(
//               '/delivery/dashboard'
//             );

//             break;

//           case 'admin':

//             router.replace(
//               '/admin/dashboard'
//             );

//             break;

//           default:

//             router.replace(
//               '/(tabs)/home'
//             );

//         }

//       }

//     };

//     checkLogin();

//   }, []);
//   const animateButton = () => {
//     Animated.sequence([
//       Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }),
//       Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }),
//     ]).start();
//   };
//   const handleLogin = async () => {

//     try {

//       animateButton();

//       setLoading(true);

//       if (!otpSent) {

//         if (phone.length !== 10) {

//           Alert.alert(
//             'Invalid',
//             'Enter valid phone number'
//           );

//           return;

//         }

//         const response =
//           await fetch(
//             `${BASE_URL}/api/send-otp`,
//             {
//               method: 'POST',
//               headers: {
//                 'Content-Type':
//                   'application/json'
//               },
//               body: JSON.stringify({
//                 phone: phone
//               })
//             }
//           );

//         const text = await response.text();

//         console.log("SERVER RESPONSE:", text);

//         let data;

//         try {

//           data = JSON.parse(text);

//         }
//         catch {

//           Alert.alert(
//             "Server Error ❌",
//             text
//           );

//           return;

//         }

//         if (!response.ok) {

//           Alert.alert(
//             'Error ❌',
//             data.message
//           );

//           return;
//         }

//         setOtpSent(true);

//         Alert.alert(
//           'Success ✅',
//           'OTP sent'
//         );

//       }

//       else {

//         const response =
//           await fetch(

//             `${BASE_URL}/api/login-with-otp`,

//             {
//               method: 'POST',

//               headers: {
//                 'Content-Type':
//                   'application/json'
//               },

//               body: JSON.stringify({

//                 phone: phone,
//                 otp

//               })

//             }

//           );

//         const text = await response.text();

//         console.log(
//           "LOGIN RESPONSE:",
//           text
//         );

//         let data;

//         try {

//           data = JSON.parse(text);

//         }
//         catch {

//           Alert.alert(
//             "Server Error ❌",
//             text
//           );

//           return;

//         }

//         if (!response.ok) {

//           Alert.alert(
//             "Login Failed ❌",
//             data.message
//           );

//           return;

//         }
//         const userRole =
//           data.user?.role || 'user';

//         await AsyncStorage.multiSet([
//           ['token', data.token],
//           ['user', JSON.stringify(data.user)],
//           ['userRole', userRole]
//         ]);

//         if (userRole === 'user') {

//           router.replace(
//             '/(tabs)/home'
//           );

//         }

//         if (userRole === 'delivery') {

//           router.replace(
//             '/delivery/dashboard'
//           );

//         }

//         if (userRole === 'admin') {

//           router.replace(
//             '/admin/dashboard'
//           );

//         }

//       }

//     }
//     catch (error: any) {

//       console.error(error);

//       Alert.alert(
//         'Error ❌',
//         'Network request failed'
//       );

//     }
//     finally {

//       setLoading(false);

//     }

//   };


//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#0d2b1d" />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.hero}>
//             <Text style={styles.logo}>🛒</Text>
//             <Text style={styles.brand}>FreshCart</Text>
//             <Text style={styles.tagline}>Groceries in 10 minutes</Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.title}>Welcome Back 👋</Text>



//             <View style={styles.inputWrap}>
//               <Text style={styles.icon}>📱</Text>

//               <TextInput
//                 style={styles.input}
//                 placeholder="Phone Number"
//                 value={phone}
//                 onChangeText={(t) =>
//                   setPhone(
//                     t.replace(/[^0-9]/g, '').slice(0, 10)
//                   )
//                 }
//                 keyboardType="phone-pad"
//                 maxLength={10}
//               />
//             </View>

//             {otpSent && (
//               <View style={styles.inputWrap}>
//                 <Text style={styles.icon}>🔐</Text>

//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChangeText={setOtp}
//                   keyboardType="number-pad"
//                   maxLength={6}
//                 />
//               </View>
//             )}


//             {/* Login Button */}
//             <Animated.View style={{ transform: [{ scale: btnScale }] }}>
//               <TouchableOpacity
//                 style={[styles.loginBtn, loading && { opacity: 0.7 }]}
//                 onPress={handleLogin}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <View style={styles.loadingRow}>
//                     <ActivityIndicator color="#fff" size="small" />
//                     <Text style={styles.loginText}>Signing In...</Text>
//                   </View>
//                 ) : (
//                   <Text style={styles.loginText}>
//                     {otpSent
//                       ? 'Verify & Login'
//                       : 'Send OTP'}
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </Animated.View>

//             <TouchableOpacity onPress={() => router.push('/auth/signup')}>
//               <Text style={styles.signup}>Don't have an account? Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: '#0d2b1d' },
//   hero: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
//   logo: { fontSize: 40 },
//   brand: { fontSize: 28, color: '#fff', fontWeight: '800' },
//   tagline: { color: '#ddd', fontSize: 13 },

//   card: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 35,
//     borderTopRightRadius: 35,
//     padding: 25,
//     minHeight: 600,
//   },

//   title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },


//   inputWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8fafc',
//     paddingHorizontal: 15,
//     borderRadius: 14,
//     marginBottom: 15,
//     height: 55,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   icon: { marginRight: 10 },
//   input: { flex: 1 },

//   loginBtn: {
//     backgroundColor: '#1a4731',
//     padding: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   loginText: { color: '#fff', fontWeight: '800', fontSize: 15 },

//   signup: {
//     marginTop: 25,
//     textAlign: 'center',
//     color: '#1a4731',
//     fontWeight: '700',
//   },

//   loadingRow: {
//     flexDirection: 'row',
//     gap: 10,
//     alignItems: 'center',
//   },
// });





//start from here

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = 'https://grocerydelivery-backend.onrender.com';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const btnScale = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Auto-login if token exists ───────────────────────────
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      const userRole = await AsyncStorage.getItem('userRole');
      if (token) {
        navigateByRole(userRole ?? 'user');
      }
    };
    checkLogin();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── Role-based navigation ────────────────────────────────
  const navigateByRole = (role: string) => {
    switch (role) {
      case 'delivery':
        router.replace('/delivery/dashboard');
        break;
      case 'admin':
        router.replace('/admin/dashboard');
        break;
      default:
        router.replace('/(tabs)/home');
    }
  };

  // ─── Resend timer ─────────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  // ─── Send OTP ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid', 'Enter a valid 10-digit phone number');
      return;
    }

    animateButton();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+91${phone}`,
        }),
      });

      const text = await response.text();
      console.log('SEND OTP RESPONSE:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert('Server Error ❌', text);
        return;
      }

      if (!response.ok) {
        Alert.alert('Error ❌', data.message || 'Failed to send OTP');
        return;
      }

      setOtpSent(true);
      startResendTimer();
      if (data.otp) {
        setOtp(data.otp);
      }
      Alert.alert(
        'OTP Sent ✅',
        data.otp ? `Your OTP is: ${data.otp}` : 'Please check your phone for the OTP.'
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error ❌', 'Network request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Verify OTP & Login ───────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid', 'Please enter the OTP');
      return;
    }

    animateButton();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login-with-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+91${phone}`,
          otp,
        }),
      });

      const text = await response.text();
      console.log('LOGIN RESPONSE:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert('Server Error ❌', text);
        return;
      }

      if (!response.ok) {
        Alert.alert('Login Failed ❌', data.message || 'Invalid OTP');
        return;
      }

      const userRole = data.user?.role ?? 'user';

      await AsyncStorage.multiSet([
        ['token', data.token],
        ['user', JSON.stringify(data.user)],
        ['userRole', userRole],
      ]);

      navigateByRole(userRole);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error ❌', 'Network request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Main handler (Send or Verify) ───────────────────────
  const handleLogin = () => {
    if (!otpSent) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────
  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp('');
    handleSendOtp();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d2b1d" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <Text style={styles.logo}>🛒</Text>
            <Text style={styles.brand}>FreshCart</Text>
            <Text style={styles.tagline}>Groceries in 10 minutes</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back 👋</Text>

            {/* Phone Input */}
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="10-digit mobile number"
                value={phone}
                onChangeText={(t) =>
                  setPhone(t.replace(/[^0-9]/g, '').slice(0, 10))
                }
                keyboardType="phone-pad"
                maxLength={10}
                editable={!otpSent}
              />
            </View>

            {/* Change number link */}
            {otpSent && (
              <TouchableOpacity
                onPress={() => {
                  setOtpSent(false);
                  setOtp('');
                  if (timerRef.current) clearInterval(timerRef.current);
                  setResendTimer(0);
                }}
                style={{ marginBottom: 12, marginTop: -8 }}
              >
                <Text style={styles.changeNumberText}>✏️ Change number</Text>
              </TouchableOpacity>
            )}

            {/* OTP Input */}
            {otpSent && (
              <>
                <View style={styles.inputWrap}>
                  <Text style={styles.icon}>🔐</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                  />
                </View>

                {/* Resend */}
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resendTimer > 0}
                  style={{ marginBottom: 8 }}
                >
                  <Text
                    style={[
                      styles.resendText,
                      resendTimer > 0 && { color: '#aaa' },
                    ]}
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Main Button */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loginText}>
                      {otpSent ? 'Verifying...' : 'Sending OTP...'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.loginText}>
                    {otpSent ? 'Verify & Login ✅' : 'Send OTP'}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signup}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d2b1d' },
  hero: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  logo: { fontSize: 40 },
  brand: { fontSize: 28, color: '#fff', fontWeight: '800' },
  tagline: { color: '#ddd', fontSize: 13 },

  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    minHeight: 600,
  },

  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },

  phoneRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 10,
  },
  countryCode: {
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 55,
  },
  countryCodeText: { fontWeight: '700', fontSize: 14 },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    letterSpacing: 1,
  },

  changeNumberText: {
    color: '#1a4731',
    fontWeight: '600',
    fontSize: 13,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 15,
    borderRadius: 14,
    marginBottom: 10,
    height: 55,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: { marginRight: 10 },
  input: { flex: 1 },

  resendText: {
    color: '#1a4731',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 10,
  },

  loginBtn: {
    backgroundColor: '#1a4731',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  signup: {
    marginTop: 25,
    textAlign: 'center',
    color: '#1a4731',
    fontWeight: '700',
  },

  loadingRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});

