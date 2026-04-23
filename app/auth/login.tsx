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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const ROLES = [
  { key: 'user',     label: 'Customer', emoji: '🛍️' },
  { key: 'delivery', label: 'Delivery',  emoji: '🚚' },
  { key: 'admin',    label: 'Admin',     emoji: '⚙️' },
];

function RoleTab({
  roleKey, label, emoji, active, onPress,
}: { roleKey: string; label: string; emoji: string; active: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <TouchableOpacity
        style={[roleStyles.tab, active && roleStyles.tabActive]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={roleStyles.emoji}>{emoji}</Text>
        <Text style={[roleStyles.label, active && roleStyles.labelActive]}>{label}</Text>
        {active && <View style={roleStyles.dot} />}
      </TouchableOpacity>
    </Animated.View>
  );
}

const roleStyles = StyleSheet.create({
  tab: {
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#fff',
    borderColor: '#1a4731',
    shadowColor: '#1a4731',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: { fontSize: 18, marginBottom: 3 },
  label: { fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.3 },
  labelActive: { color: '#1a4731' },
  dot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: '#1a4731', marginTop: 5,
  },
});

function InputField({
  icon, placeholder, value, onChangeText, secureTextEntry, rightEl, keyboardType,
}: {
  icon: string; placeholder: string; value: string;
  onChangeText: (t: string) => void; secureTextEntry?: boolean;
  rightEl?: React.ReactNode; keyboardType?: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[inputStyles.wrap, focused && inputStyles.wrapFocused]}>
      <Text style={inputStyles.icon}>{icon}</Text>
      <TextInput
        style={inputStyles.field}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
      />
      {rightEl}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  wrapFocused: {
    borderColor: '#1a4731',
    backgroundColor: '#fff',
    shadowColor: '#1a4731',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: { fontSize: 17, marginRight: 10 },
  field: { flex: 1, fontSize: 15, color: '#0f172a', fontWeight: '500' },
});

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const btnScale = useRef(new Animated.Value(1)).current;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true }),
    ]).start();

    setLoading(true);
    try {
      const response = await fetch('http://172.20.10.4:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);

        if (role === 'user') {
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          await AsyncStorage.removeItem('deliveryUser');
          await AsyncStorage.removeItem('adminUser');
          router.replace('/(tabs)/home' as any);

        } else if (role === 'delivery') {
          await AsyncStorage.setItem('deliveryUser', JSON.stringify(data.user));
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('adminUser');
          router.replace('/delivery/dashboard' as any);

        } else if (role === 'admin') {
          await AsyncStorage.setItem('adminUser', JSON.stringify(data.user));
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('deliveryUser');
          router.replace('/admin/dashboard' as any);
        }
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d2b1d" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

          {/* ── Hero ───────────────────────────────────── */}
          <View style={styles.hero}>
            {/* Decorative circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <View style={styles.logoRing}>
              <View style={styles.logoInner}>
                <Text style={styles.logoEmoji}>🛒</Text>
              </View>
            </View>

            <Text style={styles.brand}>FreshCart</Text>
            <Text style={styles.tagline}>Groceries in 10 minutes</Text>

            {/* Floating pill */}
            <View style={styles.pill}>
              <View style={styles.pillDot} />
              <Text style={styles.pillText}>Fast · Fresh · Reliable</Text>
            </View>
          </View>

          {/* ── Card ───────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue</Text>

            {/* Role Tabs */}
            <Text style={styles.sectionLabel}>Sign in as</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <RoleTab
                  key={r.key}
                  roleKey={r.key}
                  label={r.label}
                  emoji={r.emoji}
                  active={role === r.key}
                  onPress={() => setRole(r.key)}
                />
              ))}
            </View>

            {/* Inputs */}
            <Text style={styles.sectionLabel}>Account details</Text>

            <InputField
              icon="📧"
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <InputField
              icon="🔒"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              rightEl={
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              }
            />

            {/* Submit */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.signInBtn, loading && styles.signInBtnLoading]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.signInText}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </Text>
                {!loading && <Text style={styles.signInArrow}>→</Text>}
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>New here?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign up */}
            <TouchableOpacity
              style={styles.signUpBtn}
              onPress={() => router.push('/auth/signup')}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpText}>Create an Account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d2b1d' },

  // ── Hero ──────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 44,
    overflow: 'hidden',
    position: 'relative',
  },

  circle1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -60,
    right: -80,
  },

  circle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: 20,
    left: -60,
  },

  logoRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  logoInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1a4731',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },

  logoEmoji: { fontSize: 30 },

  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },

  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    marginBottom: 20,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
  },

  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },

  pillText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── Card ──────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 28,
    paddingTop: 32,
    minHeight: 580,
  },

  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 28,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  eyeBtn: { padding: 6 },
  eyeText: { fontSize: 16 },

  // Submit
  signInBtn: {
    backgroundColor: '#1a4731',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#1a4731',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
    gap: 8,
  },

  signInBtnLoading: {
    opacity: 0.7,
  },

  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  signInArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: '700',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#f1f5f9' },
  dividerText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },

  // Sign up
  signUpBtn: {
    borderWidth: 1.5,
    borderColor: '#d1fae5',
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },

  signUpText: {
    color: '#1a4731',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});