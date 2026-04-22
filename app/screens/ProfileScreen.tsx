import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCart } from '../context/CartContext';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@gmail.com');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const { orders, cart } = useCart();

  useFocusEffect(
    React.useCallback(() => {
      loadUser();
    }, [])
  );

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');

      if (user) {
        const parsed = JSON.parse(user);

        setUserName(parsed.name || 'User');
        setUserEmail(parsed.email || 'user@gmail.com');
        setPhone(parsed.phone || '');
        setAddress(parsed.address || '');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const user = JSON.parse(
        (await AsyncStorage.getItem('user')) || '{}'
      );

      const res = await fetch(
        `http://172.20.10.4:5000/api/update-profile/${user._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userName,
            phone,
            address,
          }),
        }
      );

      const text = await res.text();
      console.log('Backend response:', text);

      if (!text.startsWith('{')) {
        Alert.alert('Server error: check backend route or IP');
        return;
      }

      const updatedUser = {
        _id: user._id,
        name: userName,
        email: user.email,
        phone,
        address,
      };

      await AsyncStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      console.log('Saved user:', updatedUser);

      setPhone(updatedUser.phone);
      setAddress(updatedUser.address);

      Alert.alert('Profile updated successfully');
    } catch (error) {
      console.log(error);
      Alert.alert('Update failed');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          router.replace('/auth/login' as any);
        },
      },
    ]);
  };

  const totalSpent = orders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce(
        (s: number, item: any) => s + item.price * (item.qty || 1),
        0
      )
    );
  }, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.headerName}>{userName}</Text>
        <Text style={styles.headerSub}>Member since Jan 2024</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{totalSpent}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.9★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Info</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full name</Text>
          <Text style={styles.value}>{userName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userEmail}</Text>
        </View>

        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
        />

        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.card}>
          <Text style={styles.value}>🛍️ My orders</Text>
          <Text style={styles.label}>{orders.length} orders placed</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.value}>🛒 Cart Items</Text>
          <Text style={styles.label}>{cart.length} items in cart</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.updateBtn} onPress={handleUpdateProfile}>
        <Text style={styles.updateText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Log out</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },

  header: {
    backgroundColor: '#1a4731',
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#2d7a4f',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  headerName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },

  headerSub: {
    color: '#d1d5db',
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    width: '100%',
  },

  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },

  statValue: {
    color: '#fff',
    fontWeight: '700',
  },

  statLabel: {
    color: '#d1d5db',
    fontSize: 11,
    marginTop: 3,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  label: {
    color: '#9ca3af',
    fontSize: 12,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  updateBtn: {
    backgroundColor: '#1a4731',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
  },

  updateText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  logout: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
  },

  logoutText: {
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '700',
  },
});