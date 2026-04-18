import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
    //  const response = await fetch('http://172.20.10.4:5000/api/signup', {
    const response = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful');

        setTimeout(() => {
          router.push('/auth/login');
        }, 500);
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert(String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <button
        onClick={handleSignup}
        style={{
          padding: '15px',
          backgroundColor: '#16a34a',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        Create Account
      </button>

      <button
        onClick={() => router.push('/auth/login')}
        style={{
          marginTop: '20px',
          background: 'none',
          border: 'none',
          color: '#16a34a',
          fontSize: '16px',
        }}
      >
        Already have account? Login
      </button>
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
});