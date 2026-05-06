import React, { useState, useRef } from 'react';
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
  Animated,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const BASE_URL = "http://172.20.10.3:5000"; // ✅ your backend IP

const ROLES = [
  { key: 'user', label: 'Customer', emoji: '🛍️' },
  { key: 'delivery', label: 'Delivery', emoji: '🚚' },
  { key: 'admin', label: 'Admin', emoji: '⚙️' },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user'); // ✅ added

  const btnScale = useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter email and password');
      return;
    }

    animateButton();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }), // ✅ send role
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);

        const userRole = data.user?.role || data.role;

        Alert.alert('Success ✅', 'Login successful');

        setTimeout(async () => {
          if (userRole === 'user') {
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.removeItem('deliveryUser');
            await AsyncStorage.removeItem('adminUser');
            router.replace('/(tabs)/home');
          }

          // if (userRole === 'delivery') {
          //   await AsyncStorage.setItem('deliveryUser', JSON.stringify(data.user));
          //   await AsyncStorage.removeItem('user');
          //   await AsyncStorage.removeItem('adminUser');
          //   router.replace('/delivery/dashboard');
          // }
          if (userRole === 'delivery') {

  // ✅ IMPORTANT FIX
  await AsyncStorage.setItem(
    'user',
    JSON.stringify(data.user)
  );

  // optional separate storage
  await AsyncStorage.setItem(
    'deliveryUser',
    JSON.stringify(data.user)
  );

  await AsyncStorage.removeItem('adminUser');

  console.log(
    "✅ DELIVERY USER SAVED:",
    data.user
  );

  router.replace('/delivery/dashboard');
}

          if (userRole === 'admin') {
            await AsyncStorage.setItem('adminUser', JSON.stringify(data.user));
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('deliveryUser');
            router.replace('/admin/dashboard');
          }
        }, 1000);
      } else {
        Alert.alert('Login Failed ❌', data.message);
      }
    } catch (error) {
      Alert.alert('Error ❌', String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d2b1d" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.logo}>🛒</Text>
            <Text style={styles.brand}>FreshCart</Text>
            <Text style={styles.tagline}>Groceries in 10 minutes</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back 👋</Text>

            {/* Email */}
            <View style={styles.inputWrap}>
              <Text>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrap}>
              <Text>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* ✅ ROLE SELECTION UI */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: '700', marginBottom: 10 }}>
                Select Role
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {ROLES.map(role => (
                  <TouchableOpacity
                    key={role.key}
                    onPress={() => setSelectedRole(role.key)}
                    style={{
                      flex: 1,
                      marginHorizontal: 5,
                      padding: 12,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor:
                        selectedRole === role.key ? '#1a4731' : '#f3f4f6',
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{role.emoji}</Text>
                    <Text
                      style={{
                        color: selectedRole === role.key ? '#fff' : '#000',
                        fontWeight: '600',
                      }}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Login Button */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loginText}>Signing In...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signup}>
                Don't have account? Sign Up
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

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 15,
    borderRadius: 14,
    marginBottom: 15,
    height: 55,
  },

  input: { flex: 1, marginLeft: 10 },

  loginBtn: {
    backgroundColor: '#1a4731',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  loginText: { color: '#fff', fontWeight: '800' },

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
