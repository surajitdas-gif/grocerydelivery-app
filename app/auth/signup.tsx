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
import { router } from 'expo-router';

const ROLES = [
  { key: 'user', label: 'Customer', emoji: '🛍️' },
  { key: 'delivery', label: 'Delivery', emoji: '🚚' },
  { key: 'admin', label: 'Admin', emoji: '⚙️' },
];

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const btnScale = useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(btnScale, {
        toValue: 0.96,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }

    animateButton();
    setLoading(true);

    try {
      const response = await fetch('http://172.20.10.3:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success ✅', data.message);

        setTimeout(() => {
          router.push('/auth/login');
        }, 1200);
      } else {
        Alert.alert('Error ❌', data.message);
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
            <Text style={styles.title}>Create Account 🚀</Text>

            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.key}
                  style={[
                    styles.roleTab,
                    role === r.key && styles.roleTabActive,
                  ]}
                  onPress={() => setRole(r.key)}
                >
                  <Text style={styles.roleEmoji}>{r.emoji}</Text>
                  <Text
                    style={[
                      styles.roleLabel,
                      role === r.key && styles.roleLabelActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.icon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.icon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.signupBtn, loading && { opacity: 0.7 }]}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.signupText}>Creating...</Text>
                  </View>
                ) : (
                  <Text style={styles.signupText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>
                Already have account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d2b1d',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 40,
  },
  brand: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
  },
  tagline: {
    color: '#ddd',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    minHeight: 600,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  roleTabActive: {
    backgroundColor: '#1a4731',
  },
  roleEmoji: {
    fontSize: 18,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  roleLabelActive: {
    color: '#fff',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 14,
    height: 56,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  signupBtn: {
    backgroundColor: '#1a4731',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#fff',
    fontWeight: '800',
  },
  loginLink: {
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