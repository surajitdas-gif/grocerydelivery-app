import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Landing() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Village Delivery 🚚</Text>
      <Text style={styles.subtitle}>Fast village grocery delivery</Text>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => router.push('/auth/login' as any)}
      >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupBtn}
        onPress={() => router.push('/auth/signup' as any)}
      >
        <Text style={styles.signupText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },

  loginBtn: {
    backgroundColor: '#16a34a',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  signupBtn: {
    marginTop: 16,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#16a34a',
  },

  signupText: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
});