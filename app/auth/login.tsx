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
} from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

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
                placeholder="Email or phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, { paddingRight: 48 }]}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPass(!showPass)}
              >
                <Text style={{ fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.85}
              onPress={() => router.replace('/(tabs)' as any)}
            >
              <Text style={styles.btnPrimaryText}>Sign in</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.btnSocial}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.btnSocialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSocial}>
                <Text style={styles.socialIcon}></Text>
                <Text style={styles.btnSocialText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>{"Don't have an account?"} </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup' as any)}>
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
  safe: { flex: 1, backgroundColor: '#1a4731' },

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

  logoIcon: { fontSize: 28 },

  brandName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
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
    paddingBottom: 40,
    minHeight: 560,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
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
    fontSize: 16,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#111',
  },

  eyeBtn: {
    padding: 8,
  },

  forgotText: {
    fontSize: 13,
    color: '#1a4731',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 22,
    marginTop: -4,
  },

  btnPrimary: {
    backgroundColor: '#1a4731',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },

  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },

  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#e5e7eb',
  },

  dividerText: {
    fontSize: 12,
    color: '#9ca3af',
  },

  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  btnSocial: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 13,
  },

  socialIcon: {
    fontSize: 16,
    fontWeight: '700',
  },

  btnSocialText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  switchText: {
    fontSize: 14,
    color: '#9ca3af',
  },

  switchLink: {
    fontSize: 14,
    color: '#1a4731',
    fontWeight: '700',
  },
});