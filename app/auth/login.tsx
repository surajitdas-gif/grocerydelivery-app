// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPass, setShowPass] = useState(false);

//   const handleLogin = async () => {
//   if (!email || !password) {
//     Alert.alert('Error', 'Please fill all fields');
//     return;
//   }

//   try {
//     const response = await fetch('http://172.20.10.4:5000/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPass, setShowPass] = useState(false);

//   const handleLogin = async () => {
//   if (!email || !password) {
//     Alert.alert('Error', 'Please fill all fields');
//     return;
//   }

//   try {
//     const response = await fetch('http://172.20.10.4:5000/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       await AsyncStorage.setItem('token', data.token);

//       console.log('Saved token:', data.token);

//       setTimeout(() => {
//         router.replace('/(tabs)/home' as any);
//       }, 500);
//     } else {
//       Alert.alert('Error', data.message);
//     }
//   } catch (error) {
//     Alert.alert('Error', String(error));
//   }
// };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
//           <View style={styles.header}>
//             <View style={styles.logoBox}>
//               <Text style={styles.logoIcon}>🛒</Text>
//             </View>

//             <Text style={styles.brandName}>FreshCart</Text>
//             <Text style={styles.brandTagline}>Groceries in 10 minutes</Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.title}>Welcome back!</Text>
//             <Text style={styles.subtitle}>Sign in to your account</Text>

//             <View style={styles.inputWrap}>
//               <Text style={styles.inputIcon}>📧</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//               />
//             </View>

//             <View style={styles.inputWrap}>
//               <Text style={styles.inputIcon}>🔒</Text>
//               <TextInput
//                 style={[styles.input, { paddingRight: 48 }]}
//                 placeholder="Password"
//                 secureTextEntry={!showPass}
//                 value={password}
//                 onChangeText={setPassword}
//               />
//               <TouchableOpacity
//                 style={styles.eyeBtn}
//                 onPress={() => setShowPass(!showPass)}
//               >
//                 <Text>{showPass ? '🙈' : '👁️'}</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
//               <Text style={styles.btnPrimaryText}>Sign in</Text>
//             </TouchableOpacity>

//             <View style={styles.switchRow}>
//               <Text style={styles.switchText}>Don't have an account? </Text>
//               <TouchableOpacity onPress={() => router.push('/auth/signup')}>
//                 <Text style={styles.switchLink}>Sign up</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: '#1a4731',
//   },

//   header: {
//     alignItems: 'center',
//     paddingTop: 48,
//     paddingBottom: 32,
//   },

//   logoBox: {
//     width: 64,
//     height: 64,
//     backgroundColor: '#2d7a4f',
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 14,
//   },

//   logoIcon: {
//     fontSize: 28,
//   },

//   brandName: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#fff',
//   },

//   brandTagline: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.55)',
//   },

//   card: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     padding: 28,
//     minHeight: 560,
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//   },

//   subtitle: {
//     fontSize: 14,
//     color: '#9ca3af',
//     marginBottom: 24,
//   },

//   inputWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     marginBottom: 14,
//     height: 52,
//   },

//   inputIcon: {
//     marginRight: 10,
//   },

//   input: {
//     flex: 1,
//   },

//   eyeBtn: {
//     padding: 8,
//   },

//   btnPrimary: {
//     backgroundColor: '#1a4731',
//     borderRadius: 14,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginTop: 10,
//   },

//   btnPrimaryText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   switchRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 24,
//   },

//   switchText: {
//     color: '#9ca3af',
//   },

//   switchLink: {
//     color: '#1a4731',
//     fontWeight: '700',
//   },
// });
//     } else {
//       Alert.alert('Error', data.message);
//     }
//   } catch (error) {
//     Alert.alert('Error', String(error));
//   }
// };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
//           <View style={styles.header}>
//             <View style={styles.logoBox}>
//               <Text style={styles.logoIcon}>🛒</Text>
//             </View>

//             <Text style={styles.brandName}>FreshCart</Text>
//             <Text style={styles.brandTagline}>Groceries in 10 minutes</Text>
//           </View>

//           <View style={styles.card}>
//             <Text style={styles.title}>Welcome back!</Text>
//             <Text style={styles.subtitle}>Sign in to your account</Text>

//             <View style={styles.inputWrap}>
//               <Text style={styles.inputIcon}>📧</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//               />
//             </View>

//             <View style={styles.inputWrap}>
//               <Text style={styles.inputIcon}>🔒</Text>
//               <TextInput
//                 style={[styles.input, { paddingRight: 48 }]}
//                 placeholder="Password"
//                 secureTextEntry={!showPass}
//                 value={password}
//                 onChangeText={setPassword}
//               />
//               <TouchableOpacity
//                 style={styles.eyeBtn}
//                 onPress={() => setShowPass(!showPass)}
//               >
//                 <Text>{showPass ? '🙈' : '👁️'}</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
//               <Text style={styles.btnPrimaryText}>Sign in</Text>
//             </TouchableOpacity>

//             <View style={styles.switchRow}>
//               <Text style={styles.switchText}>Don't have an account? </Text>
//               <TouchableOpacity onPress={() => router.push('/auth/signup')}>
//                 <Text style={styles.switchLink}>Sign up</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: '#1a4731',
//   },

//   header: {
//     alignItems: 'center',
//     paddingTop: 48,
//     paddingBottom: 32,
//   },

//   logoBox: {
//     width: 64,
//     height: 64,
//     backgroundColor: '#2d7a4f',
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 14,
//   },

//   logoIcon: {
//     fontSize: 28,
//   },

//   brandName: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#fff',
//   },

//   brandTagline: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.55)',
//   },

//   card: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     padding: 28,
//     minHeight: 560,
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//   },

//   subtitle: {
//     fontSize: 14,
//     color: '#9ca3af',
//     marginBottom: 24,
//   },

//   inputWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     marginBottom: 14,
//     height: 52,
//   },

//   inputIcon: {
//     marginRight: 10,
//   },

//   input: {
//     flex: 1,
//   },

//   eyeBtn: {
//     padding: 8,
//   },

//   btnPrimary: {
//     backgroundColor: '#1a4731',
//     borderRadius: 14,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginTop: 10,
//   },

//   btnPrimaryText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   switchRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 24,
//   },

//   switchText: {
//     color: '#9ca3af',
//   },

//   switchLink: {
//     color: '#1a4731',
//     fontWeight: '700',
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.4:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);

        await AsyncStorage.setItem(
          'user',
          JSON.stringify(data.user)
        );

        console.log('Saved token:', data.token);

        setTimeout(() => {
          router.replace('/(tabs)/home' as any);
        }, 500);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>🛒</Text>
            </View>

            <Text style={styles.brandName}>FreshCart</Text>
            <Text style={styles.brandTagline}>Groceries in 10 minutes</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <View style={styles.inputWrap}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, { paddingRight: 48 }]}
                placeholder="Password"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPass(!showPass)}
              >
                <Text>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
              <Text style={styles.btnPrimaryText}>Sign in</Text>
            </TouchableOpacity>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={styles.switchLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a4731',
  },

  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },

  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: '#2d7a4f',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  logoIcon: {
    fontSize: 28,
  },

  brandName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },

  brandTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },

  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    minHeight: 560,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 24,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 52,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
  },

  eyeBtn: {
    padding: 8,
  },

  btnPrimary: {
    backgroundColor: '#1a4731',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  switchText: {
    color: '#9ca3af',
  },

  switchLink: {
    color: '#1a4731',
    fontWeight: '700',
  },
});