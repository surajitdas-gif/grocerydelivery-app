


import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@gmail.com');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [realOrders, setRealOrders] =
  useState<any[]>([]);

 const { cart } = useCart();

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
        const res = await fetch(
  `http://172.20.10.3:5000/api/orders/my-orders/${parsed._id}`
);

const data = await res.json();

if (data.success) {

  setRealOrders(data.orders);

}
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

      await fetch(
        `http://172.20.10.3:5000/api/update-profile/${user._id}`,
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

      Alert.alert('Profile updated successfully ✅');
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

const totalSpent = realOrders.reduce(
  (sum, order) => {

    return (
      sum +
      order.items.reduce(
        (s: number, item: any) =>
          s + item.price * (item.qty || 1),
        0
      )
    );

  },
  0
);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── HERO HEADER ── */}
      <View style={styles.header}>
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.avatarWrapper}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.headerName}>{userName}</Text>
        <Text style={styles.headerSub}>Member since Jan 2024</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{realOrders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={[styles.statBox, styles.statBoxCenter]}>
            <Text style={styles.statValue}>₹{totalSpent}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.9★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* ── PERSONAL INFO ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>Personal Info</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{userName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{userEmail}</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            placeholderTextColor="#b0b8c1"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Delivery Address</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            placeholderTextColor="#b0b8c1"
            multiline
          />
        </View>
      </View>

      {/* ── ACCOUNT ── */}
      <View style={styles.section}>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>
            Account
          </Text>
        </View>

        {/* MY ORDERS */}

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() =>
            router.push('/(tabs)/orders' as any)
          }
        >

          <View style={styles.cardRow}>

            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>
                🛍️
              </Text>
            </View>

            <View style={styles.cardBody}>

              <Text style={styles.value}>
                My Orders
              </Text>

              <Text style={styles.label}>
                {realOrders.length} orders placed
              </Text>

            </View>

            <Text style={styles.chevron}>
              ›
            </Text>

          </View>

        </TouchableOpacity>

        {/* CART ITEMS */}

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() =>
            router.push('/cart' as any)
          }
        >

          <View style={styles.cardRow}>

            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>
                🛒
              </Text>
            </View>

            <View style={styles.cardBody}>

              <Text style={styles.value}>
                Cart Items
              </Text>

              <Text style={styles.label}>
                {cart.length} items in cart
              </Text>

            </View>

            <Text style={styles.chevron}>
              ›
            </Text>

          </View>

        </TouchableOpacity>

      </View>


      {/* ── HELP & SUPPORT ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>Help & Support</Text>
        </View>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push('/help/faq' as any)}
        >
          <View style={styles.cardRow}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>❓</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.value}>FAQs</Text>
              <Text style={styles.label}>Frequently asked questions</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push('/help/ai-chat' as any)}
        >
          <View style={styles.cardRow}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>💬</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.value}>Contact Us</Text>
              <Text style={styles.label}>Chat, email or call support</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push('/help/report' as any)}
        >
          <View style={styles.cardRow}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>🐛</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.value}>Report a Problem</Text>
              <Text style={styles.label}>Let us know what went wrong</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push('/help/privacy' as any)}
        >
          <View style={styles.cardRow}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>🔒</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.value}>Privacy Policy</Text>
              <Text style={styles.label}>How we use your data</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── ACTIONS ── */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={handleUpdateProfile}
          activeOpacity={0.85}
        >
          <Text style={styles.updateText}>Update Profile</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.halfBtn}
            onPress={() => router.push('/delivery/dashboard' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.halfBtnIcon}>🚚</Text>
            <Text style={styles.halfBtnText}>Delivery{'\n'}Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.halfBtn, styles.halfBtnBlue]}
            onPress={() => router.push('/admin/dashboard' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.halfBtnIcon}>⚙️</Text>
            <Text style={styles.halfBtnText}>Admin{'\n'}Dashboard</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logout}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>🚪  Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },

  /* ── HEADER ── */
  header: {
    backgroundColor: '#0f2d1f',
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  decorCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(45,122,79,0.18)',
    top: -60,
    right: -60,
  },

  decorCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(45,122,79,0.12)',
    bottom: -30,
    left: -30,
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },

  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2d7a4f',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 1,
  },

  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ade80',
    borderWidth: 2,
    borderColor: '#0f2d1f',
  },

  headerName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  headerSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0.2,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
    width: '100%',
  },

  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  statBoxCenter: {
    backgroundColor: 'rgba(45,122,79,0.35)',
    borderColor: 'rgba(74,222,128,0.25)',
  },

  statValue: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },

  statLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    marginTop: 3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  /* ── SECTIONS ── */
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#2d7a4f',
  },

  sectionTitle: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  /* ── CARD ── */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0faf4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardIconText: {
    fontSize: 18,
  },

  cardBody: {
    flex: 1,
  },

  chevron: {
    fontSize: 22,
    color: '#c0c8d0',
    fontWeight: '300',
  },

  label: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.2,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  /* ── INPUTS ── */
  inputWrapper: {
    marginBottom: 10,
  },

  inputLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginLeft: 4,
  },

  input: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },

  /* ── ACTIONS ── */
  actionsSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },

  updateBtn: {
    backgroundColor: '#0f2d1f',
    padding: 17,
    borderRadius: 16,
    shadowColor: '#0f2d1f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 12,
  },

  updateText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  halfBtn: {
    flex: 1,
    backgroundColor: '#2d7a4f',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2d7a4f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  halfBtnBlue: {
    backgroundColor: '#1d4ed8',
    shadowColor: '#1d4ed8',
  },

  halfBtnIcon: {
    fontSize: 22,
    marginBottom: 6,
  },

  halfBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },

  logout: {
    backgroundColor: '#ffffff',
    padding: 17,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fee2e2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  logoutText: {
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});