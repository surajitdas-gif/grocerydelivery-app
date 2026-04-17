// import React, { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity,
//   StyleSheet, SafeAreaView, KeyboardAvoidingView,
//   Platform, ScrollView,
// } from 'react-native';

// export default function SignUpScreen({ navigation }: any) {
//   const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
//   const [showPass, setShowPass]   = useState(false);
//   const [agreed, setAgreed]       = useState(false);

//   const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}
//       >
//         <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

//           {/* ── Top brand header ── */}
//           <View style={styles.header}>
//             <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//               <Text style={styles.backText}>‹</Text>
//             </TouchableOpacity>
//             <View style={styles.logoBox}>
//               <Text style={styles.logoIcon}>🛒</Text>
//             </View>
//             <Text style={styles.brandName}>FreshCart</Text>
//             <Text style={styles.brandTagline}>Groceries in 10 minutes</Text>
//           </View>

//           {/* ── Form card ── */}
//           <View style={styles.card}>
//             <Text style={styles.title}>Create account</Text>
//             <Text style={styles.subtitle}>Fresh groceries await you</Text>

//             {/* Full name */}
//             <View style={styles.inputWrap}>
//               <Text style={styles.inputIcon}>👤</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Full name"
//                 placeholderTextColor="#9ca3af"
//                 autoCapitalize="words"
//                 value={form.name}
//                 onChangeText={v => update('name', v)}
//               />
//             </View>

//             {/* Phone */}
//             <View style={styles.inputWrap}>
//               <Text style={styles.inputIcon}>📞</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Phone number"
//                 placeholderTextColor="#9ca3af"
//                 keyboardType="phone-pad"
//                 value={form.phone}
//                 onChangeText={v => update('phone', v)}
//               />
//             </View>

//             {/* Email */}
//             <View style={styles.inputWrap}>
//               <Text style={styles.inputIcon}>📧</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email address"
//                 placeholderTextColor="#9ca3af"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 value={form.email}
//                 onChangeText={v => update('email', v)}
//               />
//             </View>

//             {/* Password */}
//             <View style={styles.inputWrap}>
//               <Text style={styles.inputIcon}>🔒</Text>
//               <TextInput
//                 style={[styles.input, { paddingRight: 48 }]}
//                 placeholder="Create password"
//                 placeholderTextColor="#9ca3af"
//                 secureTextEntry={!showPass}
//                 value={form.password}
//                 onChangeText={v => update('password', v)}
//               />
//               <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
//                 <Text style={{ fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Password strength hints */}
//             <View style={styles.strengthRow}>
//               {['8+ chars', 'Number', 'Symbol'].map((hint, i) => (
//                 <View key={i} style={styles.strengthPill}>
//                   <Text style={styles.strengthText}>{hint}</Text>
//                 </View>
//               ))}
//             </View>

//             {/* Terms checkbox */}
//             <TouchableOpacity
//               style={styles.checkRow}
//               activeOpacity={0.7}
//               onPress={() => setAgreed(!agreed)}
//             >
//               <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
//                 {agreed && <Text style={styles.checkmark}>✓</Text>}
//               </View>
//               <Text style={styles.termsText}>
//                 I agree to the{' '}
//                 <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
//                 <Text style={styles.termsLink}>Privacy Policy</Text>
//               </Text>
//             </TouchableOpacity>

//             {/* Create account button */}
//             <TouchableOpacity
//               style={[styles.btnPrimary, !agreed && styles.btnDisabled]}
//               activeOpacity={0.85}
//               disabled={!agreed}
//               onPress={() => navigation.replace('Main')}
//             >
//               <Text style={styles.btnPrimaryText}>Create account</Text>
//             </TouchableOpacity>

//             {/* Switch to login */}
//             <View style={styles.switchRow}>
//               <Text style={styles.switchText}>Already have an account? </Text>
//               <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                 <Text style={styles.switchLink}>Sign in</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:           { flex: 1, backgroundColor: '#1a4731' },

//   header:         { alignItems: 'center', paddingTop: 48, paddingBottom: 32, position: 'relative' },
//   backBtn:        { position: 'absolute', left: 20, top: 48, width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
//   backText:       { fontSize: 22, color: '#fff', lineHeight: 28 },
//   logoBox:        { width: 64, height: 64, backgroundColor: '#2d7a4f', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
//   logoIcon:       { fontSize: 28 },
//   brandName:      { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 4 },
//   brandTagline:   { fontSize: 13, color: 'rgba(255,255,255,0.55)' },

//   card:           { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingBottom: 40 },
//   title:          { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 4 },
//   subtitle:       { fontSize: 14, color: '#9ca3af', marginBottom: 24 },

//   inputWrap:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 14, paddingHorizontal: 14, marginBottom: 14, height: 52 },
//   inputIcon:      { fontSize: 16, marginRight: 10 },
//   input:          { flex: 1, fontSize: 14, color: '#111' },
//   eyeBtn:         { padding: 8 },

//   strengthRow:    { flexDirection: 'row', gap: 8, marginBottom: 20, marginTop: -4 },
//   strengthPill:   { backgroundColor: '#f3f4f6', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
//   strengthText:   { fontSize: 11, color: '#9ca3af' },

//   checkRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 22 },
//   checkbox:       { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: '#1a4731', alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
//   checkboxChecked:{ backgroundColor: '#1a4731' },
//   checkmark:      { color: '#fff', fontSize: 12, fontWeight: '700' },
//   termsText:      { flex: 1, fontSize: 13, color: '#9ca3af', lineHeight: 19 },
//   termsLink:      { color: '#1a4731', fontWeight: '600' },

//   btnPrimary:     { backgroundColor: '#1a4731', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 22 },
//   btnDisabled:    { opacity: 0.45 },
//   btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

//   switchRow:      { flexDirection: 'row', justifyContent: 'center' },
//   switchText:     { fontSize: 14, color: '#9ca3af' },
//   switchLink:     { fontSize: 14, color: '#1a4731', fontWeight: '700' },
// });




import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

export default function Signup() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput placeholder="Name" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)' as any)}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
        <Text style={styles.link}>Already have account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#16a34a',
  },
});