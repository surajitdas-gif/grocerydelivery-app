
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

const BASE_URL = 'http://172.20.10.3:5000'; // ✅ your backend IP

const ROLES = [
  { key: 'user', label: 'Customer', emoji: '🛍️' },
  { key: 'delivery', label: 'Delivery', emoji: '🚚' },
  { key: 'admin', label: 'Admin', emoji: '⚙️' },
];

// ─── Step 1: Fill Details ───────────────────────────────────
// ─── Step 2: Enter Phone + Get OTP ─────────────────────────
// ─── Step 3: Verify OTP ────────────────────────────────────

export default function SignupScreen() {
  const [step, setStep] = useState(1); // 1 = details, 2 = phone, 3 = otp
  // Step 1 fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [role, setRole] = useState<string>('user');

  // Step 2 fields
  const [phone, setPhone] = useState<string>('');

  // Step 3 fields
  const [otp, setOtp] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    ''
  ]);


  const otpRefs =
    useRef<(TextInput | null)[]>([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [resendTimer, setResendTimer] =
    useState<number>(0);

  const timerRef =
    useRef<
      ReturnType<typeof setInterval>
      | null
    >(null);

  const btnScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const slideAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {

    return () => {

      if (timerRef.current) {

        clearInterval(
          timerRef.current
        );

        timerRef.current = null;

      }

    };

  }, []);

  const startResendTimer = () => {

    setResendTimer(30);

    if (timerRef.current) {

      clearInterval(
        timerRef.current
      );

    }

    timerRef.current =
      setInterval(() => {

        setResendTimer(
          (prev: number) => {

            if (prev <= 1) {

              if (timerRef.current) {

                clearInterval(
                  timerRef.current
                );

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
  const goToStep = (nextStep: number) => {
    Animated.timing(slideAnim, {
      toValue: -400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      slideAnim.setValue(400);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    });
  };

  // ─── Step 1 → Step 2 ──────────────────────────────────────
  const handleDetailsNext = () => {
    if (!name.trim()) return Alert.alert('Missing', 'Please enter your name');
    if (!email.trim()) return Alert.alert('Missing', 'Please enter your email');
    if (!/\S+@\S+\.\S+/.test(email))
      return Alert.alert('Invalid', 'Please enter a valid email');
    if (password.length < 6)
      return Alert.alert('Weak Password', 'Password must be at least 6 characters');

    animateButton();
    goToStep(2);
  };
  // ─── Step 2: Send OTP ─────────────────────────────────────
  const handleSendOtp = async () => {

    if (
      phone.length !== 10 ||
      !/^\d{10}$/.test(phone)
    )

      return Alert.alert(
        'Invalid',
        'Enter a valid 10-digit phone number'
      );

    animateButton();

    setLoading(true);

    try {

      const res =
        await fetch(

          `${BASE_URL}/api/send-otp`,

          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({

              phone: phone

            })

          }

        );

      const data =
        await res.json();

      if (res.ok) {

        startResendTimer();

        goToStep(3);

      }
      else {

        Alert.alert(
          'Error ❌',
          data.message || 'Failed to send OTP'
        );

      }

    }
    catch (err: any) {

      Alert.alert(

        'Error ❌',

        err?.message ||
        'Something went wrong'

      );

    }
    finally {

      setLoading(false);

    }

  };






  const handleVerifyOtp = async () => {

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {

      return Alert.alert(
        'Invalid',
        'Please enter the 6-digit OTP'
      );

    }

    animateButton();

    setLoading(true);

    try {

      // Demo OTP check

      if (otpCode !== '999999') {

        setLoading(false);

        Alert.alert(
          'Wrong OTP ❌',
          'Use OTP: 999999'
        );

        return;

      }

      // Create account

      const signupRes =
        await fetch(

          `${BASE_URL}/api/signup`,

          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({

              name,
              email,
              password,
              role,
              phone

            })

          }

        );

      const signupData =
        await signupRes.json();

      if (signupRes.ok) {

        Alert.alert(
          'Success ✅',
          'Account created successfully!'
        );

        setTimeout(() => {

          router.replace(
            '/auth/login'
          );

        }, 1200);

      }
      else {

        Alert.alert(
          'Signup Failed ❌',
          signupData.message
        );

      }

    }
    catch (err: any) {

      Alert.alert(

        'Error ❌',

        err?.message ||
        'Something went wrong'

      );

    }
    finally {

      setLoading(false);

    }

  };




  // ─── OTP Box handlers ─────────────────────────────────────
  const handleOtpChange = (
    text: string,
    index: number
  ) => {

    const cleaned =
      text
        .replace(/[^0-9]/g, '')
        .slice(-1);

    const newOtp = [...otp];

    newOtp[index] = cleaned;

    setOtp(newOtp);

    if (
      cleaned &&
      index < 5
    ) {
      otpRefs.current[
        index + 1
      ]?.focus();
    }

  };
  const handleOtpKeyPress = (
    e: any,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    handleSendOtp();
  };

  // ─── Renders ──────────────────────────────────────────────
  const renderStep1 = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
      <Text style={styles.title}>Create Account 🚀</Text>
      <Text style={styles.stepLabel}>Step 1 of 3 — Your Details</Text>

      {/* Role selector */}
      <View style={styles.roleRow}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.key}
            style={[styles.roleTab, role === r.key && styles.roleTabActive]}
            onPress={() => setRole(r.key)}
          >
            <Text style={styles.roleEmoji}>{r.emoji}</Text>
            <Text style={[styles.roleLabel, role === r.key && styles.roleLabelActive]}>
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
          placeholder="Password (min 6 chars)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Text>{showPass ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleDetailsNext}>
          <Text style={styles.primaryBtnText}>Next →</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
      <TouchableOpacity onPress={() => goToStep(1)} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verify Phone 📱</Text>
      <Text style={styles.stepLabel}>Step 2 of 3 — Phone Verification</Text>

      <Text style={styles.infoText}>
        We'll send a 6-digit OTP to your phone to verify your identity.
      </Text>

      <View style={styles.phoneRow}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="10-digit mobile number"
          value={phone}
          onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <TouchableOpacity
          style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
          onPress={handleSendOtp}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.primaryBtnText}>Sending OTP...</Text>
            </View>
          ) : (
            <Text style={styles.primaryBtnText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
      <TouchableOpacity onPress={() => goToStep(2)} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Enter OTP 🔐</Text>
      <Text style={styles.stepLabel}>Step 3 of 3 — Verification</Text>

      <Text style={styles.infoText}>
        OTP sent to <Text style={{ fontWeight: '800', color: '#1a4731' }}>+91 {phone}</Text>
      </Text>

      {/* OTP Boxes */}
      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref: TextInput | null) => {
              otpRefs.current[i] = ref;
            }}
            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            value={digit}
            onChangeText={(t) => handleOtpChange(t, i)}
            onKeyPress={(e) => handleOtpKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      {/* Resend */}
      <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
        <Text style={[styles.resendText, resendTimer > 0 && { color: '#aaa' }]}>
          {resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : 'Resend OTP'}
        </Text>
      </TouchableOpacity>

      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <TouchableOpacity
          style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.primaryBtnText}>Verifying...</Text>
            </View>
          ) : (
            <Text style={styles.primaryBtnText}>Verify & Create Account ✅</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

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

          {/* Step progress bar */}
          <View style={styles.progressWrap}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[styles.progressDot, step >= s && styles.progressDotActive]}
              />
            ))}
          </View>

          <View style={styles.card}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d2b1d' },
  hero: { alignItems: 'center', paddingTop: 50, paddingBottom: 20 },
  logo: { fontSize: 36 },
  brand: { fontSize: 26, color: '#fff', fontWeight: '800' },
  tagline: { color: '#ddd', fontSize: 12 },

  progressWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressDotActive: {
    backgroundColor: '#4ade80',
  },

  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    minHeight: 600,
    overflow: 'hidden',
  },

  backBtn: { marginBottom: 12 },
  backBtnText: { color: '#1a4731', fontWeight: '700', fontSize: 14 },

  title: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  stepLabel: { fontSize: 12, color: '#888', marginBottom: 20 },

  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    lineHeight: 20,
  },

  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  roleTabActive: { backgroundColor: '#1a4731' },
  roleEmoji: { fontSize: 18 },
  roleLabel: { fontSize: 12, fontWeight: '700' },
  roleLabelActive: { color: '#fff' },

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
  icon: { marginRight: 10 },
  input: { flex: 1 },

  phoneRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  countryCode: {
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 56,
  },
  countryCodeText: { fontWeight: '700', fontSize: 14 },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    letterSpacing: 1,
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
  },
  otpBoxFilled: {
    borderColor: '#1a4731',
    backgroundColor: '#f0fdf4',
  },

  resendText: {
    textAlign: 'center',
    color: '#1a4731',
    fontWeight: '700',
    marginBottom: 20,
    fontSize: 13,
  },

  primaryBtn: {
    backgroundColor: '#1a4731',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  linkText: {
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