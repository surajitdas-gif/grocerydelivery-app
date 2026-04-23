// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import { router } from 'expo-router';

// const ROLES = [
//   { key: 'user',     label: 'User',     icon: '👤' },
//   { key: 'delivery', label: 'Delivery', icon: '🚚' },
//   { key: 'admin',    label: 'Admin',    icon: '🛡️' },
// ];

// export default function Signup() {
//   const [name, setName]         = useState('');
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole]         = useState('user');
//   const [showPass, setShowPass] = useState(false);

//   const handleSignup = async () => {
//     if (!name || !email || !password) {
//       Alert.alert('Error', 'All fields required');
//       return;
//     }

//     try {
//       const response = await fetch('http://172.20.10.4:5000/api/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password, role }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', data.message);
//         router.push('/auth/login');
//       } else {
//         Alert.alert('Error', data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Error', String(error));
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.root}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <StatusBar barStyle="light-content" backgroundColor="#0f1117" />
//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >

//         {/* ── Header ── */}
//         <View style={styles.header}>
//           <View style={styles.logoRing}>
//             <Text style={styles.logoEmoji}>🌿</Text>
//           </View>
//           <Text style={styles.appName}>FreshCart</Text>
//           <Text style={styles.tagline}>Create your account</Text>
//         </View>

//         {/* ── Card ── */}
//         <View style={styles.card}>

//           {/* Role Selector */}
//           <Text style={styles.fieldLabel}>I am a…</Text>
//           <View style={styles.roleRow}>
//             {ROLES.map(r => (
//               <TouchableOpacity
//                 key={r.key}
//                 style={[styles.roleBtn, role === r.key && styles.roleBtnActive]}
//                 onPress={() => setRole(r.key)}
//                 activeOpacity={0.75}
//               >
//                 <Text style={styles.roleIcon}>{r.icon}</Text>
//                 <Text style={[styles.roleLabel, role === r.key && styles.roleLabelActive]}>
//                   {r.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Divider */}
//           <View style={styles.divider} />

//           {/* Fields */}
//           <Text style={styles.fieldLabel}>Full Name</Text>
//           <View style={styles.inputWrap}>
//             <Text style={styles.inputIcon}>✦</Text>
//             <TextInput
//               placeholder="Your name"
//               placeholderTextColor="#5a6070"
//               style={styles.input}
//               value={name}
//               onChangeText={setName}
//             />
//           </View>

//           <Text style={styles.fieldLabel}>Email</Text>
//           <View style={styles.inputWrap}>
//             <Text style={styles.inputIcon}>@</Text>
//             <TextInput
//               placeholder="you@email.com"
//               placeholderTextColor="#5a6070"
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <Text style={styles.fieldLabel}>Password</Text>
//           <View style={styles.inputWrap}>
//             <Text style={styles.inputIcon}>🔑</Text>
//             <TextInput
//               placeholder="Min. 8 characters"
//               placeholderTextColor="#5a6070"
//               style={[styles.input, { flex: 1 }]}
//               secureTextEntry={!showPass}
//               value={password}
//               onChangeText={setPassword}
//             />
//             <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
//               <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* CTA */}
//           <TouchableOpacity style={styles.ctaBtn} onPress={handleSignup} activeOpacity={0.85}>
//             <Text style={styles.ctaText}>Create Account</Text>
//             <Text style={styles.ctaArrow}>→</Text>
//           </TouchableOpacity>

//         </View>

//         {/* ── Footer ── */}
//         <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.footer}>
//           <Text style={styles.footerText}>
//             Already have an account?{'  '}
//             <Text style={styles.footerLink}>Sign In</Text>
//           </Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: '#0f1117',
//   },
//   scroll: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     paddingBottom: 40,
//   },

//   /* ── Header ── */
//   header: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   logoRing: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     borderWidth: 2,
//     borderColor: '#22c55e',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//     backgroundColor: '#161b22',
//   },
//   logoEmoji: {
//     fontSize: 32,
//   },
//   appName: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: '#f0fdf4',
//     letterSpacing: 1.2,
//     marginBottom: 4,
//   },
//   tagline: {
//     fontSize: 14,
//     color: '#6b7280',
//     letterSpacing: 0.4,
//   },

//   /* ── Card ── */
//   card: {
//     backgroundColor: '#161b22',
//     borderRadius: 24,
//     padding: 24,
//     borderWidth: 1,
//     borderColor: '#21262d',
//     shadowColor: '#000',
//     shadowOpacity: 0.4,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 8 },
//     elevation: 12,
//   },

//   /* ── Role Selector ── */
//   roleRow: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 20,
//   },
//   roleBtn: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 14,
//     backgroundColor: '#0f1117',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: '#21262d',
//   },
//   roleBtnActive: {
//     backgroundColor: '#052e16',
//     borderColor: '#22c55e',
//   },
//   roleIcon: {
//     fontSize: 18,
//     marginBottom: 4,
//   },
//   roleLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6b7280',
//   },
//   roleLabelActive: {
//     color: '#4ade80',
//   },

//   /* ── Divider ── */
//   divider: {
//     height: 1,
//     backgroundColor: '#21262d',
//     marginBottom: 20,
//   },

//   /* ── Field Labels ── */
//   fieldLabel: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#9ca3af',
//     letterSpacing: 0.8,
//     textTransform: 'uppercase',
//     marginBottom: 8,
//   },

//   /* ── Inputs ── */
//   inputWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0f1117',
//     borderRadius: 14,
//     borderWidth: 1.5,
//     borderColor: '#21262d',
//     paddingHorizontal: 14,
//     marginBottom: 18,
//     height: 52,
//   },
//   inputIcon: {
//     fontSize: 14,
//     color: '#4b5563',
//     marginRight: 10,
//     width: 18,
//     textAlign: 'center',
//   },
//   input: {
//     flex: 1,
//     fontSize: 15,
//     color: '#e5e7eb',
//     fontWeight: '500',
//   },
//   eyeBtn: {
//     paddingLeft: 8,
//   },
//   eyeText: {
//     fontSize: 16,
//   },

//   /* ── CTA ── */
//   ctaBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#16a34a',
//     borderRadius: 14,
//     height: 54,
//     marginTop: 6,
//     shadowColor: '#22c55e',
//     shadowOpacity: 0.35,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 6,
//   },
//   ctaText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '800',
//     letterSpacing: 0.5,
//   },
//   ctaArrow: {
//     color: '#bbf7d0',
//     fontSize: 18,
//     marginLeft: 8,
//     fontWeight: '700',
//   },

//   /* ── Footer ── */
//   footer: {
//     marginTop: 28,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   footerLink: {
//     color: '#22c55e',
//     fontWeight: '700',
//   },
// });
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
import { router } from 'expo-router';

// ─── Role data ────────────────────────────────────────────────────────────────
const ROLES = [
  { key: 'user',     label: 'Customer', emoji: '🛍️' },
  { key: 'delivery', label: 'Delivery',  emoji: '🚚' },
  { key: 'admin',    label: 'Admin',     emoji: '⚙️' },
];

// ─── RoleTab (identical to login screen) ─────────────────────────────────────
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

// ─── InputField (identical to login screen) ───────────────────────────────────
function InputField({
  icon, placeholder, value, onChangeText, secureTextEntry, rightEl, keyboardType, autoCapitalize,
}: {
  icon: string; placeholder: string; value: string;
  onChangeText: (t: string) => void; secureTextEntry?: boolean;
  rightEl?: React.ReactNode; keyboardType?: any; autoCapitalize?: any;
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
        autoCapitalize={autoCapitalize ?? 'none'}
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

// ─── Signup Screen ────────────────────────────────────────────────────────────
export default function SignupScreen() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole]         = useState('user');
  const [loading, setLoading]   = useState(false);

  const btnScale = useRef(new Animated.Value(1)).current;

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true }),
    ]).start();

    setLoading(true);
    try {
      const response = await fetch('http://172.20.10.4:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        router.push('/auth/login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.log(error);
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

          {/* ── Hero (same as login) ─────────────────── */}
          <View style={styles.hero}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <View style={styles.logoRing}>
              <View style={styles.logoInner}>
                <Text style={styles.logoEmoji}>🛒</Text>
              </View>
            </View>

            <Text style={styles.brand}>FreshCart</Text>
            <Text style={styles.tagline}>Groceries in 10 minutes</Text>

            <View style={styles.pill}>
              <View style={styles.pillDot} />
              <Text style={styles.pillText}>Fast · Fresh · Reliable</Text>
            </View>
          </View>

          {/* ── Card ────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSubtitle}>Join FreshCart today — it's free</Text>

            {/* Role */}
            <Text style={styles.sectionLabel}>Signing up as</Text>
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

            {/* Fields */}
            <Text style={styles.sectionLabel}>Your details</Text>

            <InputField
              icon="👤"
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

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

            {/* CTA */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.signUpBtn, loading && styles.btnLoading]}
                onPress={handleSignup}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.signUpText}>
                  {loading ? 'Creating Account…' : 'Create Account'}
                </Text>
                {!loading && <Text style={styles.signUpArrow}>→</Text>}
              </TouchableOpacity>
            </Animated.View>

            {/* Terms */}
            <Text style={styles.terms}>
              By signing up you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Have an account?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login link */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push('/auth/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginText}>Sign In Instead</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d2b1d' },

  // ── Hero ──
  hero: {
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 44,
    overflow: 'hidden',
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -60, right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: 20, left: -60,
  },
  logoRing: {
    width: 86, height: 86, borderRadius: 43,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  logoInner: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#1a4731',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 10,
  },
  logoEmoji: { fontSize: 30 },
  brand: {
    fontSize: 30, fontWeight: '800', color: '#ffffff',
    letterSpacing: -0.5, marginBottom: 4,
  },
  tagline: {
    fontSize: 13, color: 'rgba(255,255,255,0.5)',
    fontWeight: '500', marginBottom: 20,
  },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, gap: 6,
  },
  pillDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ade80' },
  pillText: {
    fontSize: 12, color: 'rgba(255,255,255,0.65)',
    fontWeight: '600', letterSpacing: 0.3,
  },

  // ── Card ──
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 28,
    paddingTop: 32,
    minHeight: 620,
  },
  cardTitle: {
    fontSize: 26, fontWeight: '800', color: '#0f172a',
    letterSpacing: -0.5, marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14, color: '#94a3b8',
    fontWeight: '500', marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#94a3b8',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10,
  },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },

  eyeBtn: { padding: 6 },
  eyeText: { fontSize: 16 },

  // CTA
  signUpBtn: {
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
  btnLoading: { opacity: 0.7 },
  signUpText: {
    color: '#fff', fontSize: 16,
    fontWeight: '800', letterSpacing: 0.2,
  },
  signUpArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18, fontWeight: '700',
  },

  // Terms
  terms: {
    fontSize: 12, color: '#94a3b8',
    textAlign: 'center', marginTop: 16,
    lineHeight: 18,
  },
  termsLink: { color: '#1a4731', fontWeight: '700' },

  // Divider
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 24, marginBottom: 16, gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#f1f5f9' },
  dividerText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },

  // Login link
  loginBtn: {
    borderWidth: 1.5,
    borderColor: '#d1fae5',
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginText: {
    color: '#1a4731', fontSize: 15,
    fontWeight: '800', letterSpacing: 0.2,
  },
});