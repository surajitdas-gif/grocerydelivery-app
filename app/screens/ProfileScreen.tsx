import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const INFO_ITEMS = [
  { label: 'Full name',      value: 'Rahul Sharma',           iconBg: '#E8F5E9', icon: 'person'    },
  { label: 'Phone',          value: '+91 98765 43210',         iconBg: '#E3F2FD', icon: 'phone'     },
  { label: 'Email',          value: 'rahul.sharma@gmail.com',  iconBg: '#FFF3E0', icon: 'email'     },
  { label: 'Date of birth',  value: '14 March 1995',           iconBg: '#FCE4EC', icon: 'calendar'  },
  { label: 'Address',        value: '12, Gandhi Nagar, Lucknow', iconBg: '#EDE7F6', icon: 'pin'    },
];

const MENU_ITEMS = [
  { label: 'My orders',   sub: '24 orders placed',   iconBg: '#E8F5E9',  screen: 'Orders'   },
  { label: 'Payments',    sub: 'UPI · Cards · Wallets', iconBg: '#E3F2FD', screen: 'Payments' },
  { label: 'Support',     sub: 'Help & live chat',    iconBg: '#FFF3E0',  screen: 'Support', badge: 'Online'  },
];

function ChevronRight() {
  return (
    <View style={styles.chevron}>
      <Text style={styles.chevronText}>›</Text>
    </View>
  );
}

function IconBox({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return <View style={[styles.iconBox, { backgroundColor: bg }]}>{children}</View>;
}

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => { /* handle logout */ } },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.8}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>RS</Text>
          </View>
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>✎</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.headerName}>Rahul Sharma</Text>
        <Text style={styles.headerSub}>Member since Jan 2024</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹1,840</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>4.9 ★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* ── Personal Info ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal info</Text>
        <View style={styles.card}>
          {INFO_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.infoRow, i === INFO_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
            >
              <IconBox bg={item.iconBg}>
                <Text style={{ fontSize: 16 }}>
                  {{ person: '👤', phone: '📞', email: '📧', calendar: '📅', pin: '📍' }[item.icon]}
                </Text>
              </IconBox>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
              <ChevronRight />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Account Menu ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuRow, i === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen as never)}
            >
              <IconBox bg={item.iconBg}>
                <Text style={{ fontSize: 16 }}>
                  {{ Orders: '🛍️', Payments: '💳', Support: '💬' }[item.screen]}
                </Text>
              </IconBox>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              {item.badge && (
                <View style={styles.onlineBadge}>
                  <Text style={styles.onlineBadgeText}>{item.badge}</Text>
                </View>
              )}
              <ChevronRight />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Logout ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.menuRow, { borderBottomWidth: 0 }]} onPress={handleLogout} activeOpacity={0.7}>
            <IconBox bg="#FFEBEE">
              <Text style={{ fontSize: 16 }}>🚪</Text>
            </IconBox>
            <Text style={[styles.menuLabel, { color: '#C62828', flex: 1 }]}>Log out</Text>
            <Text style={{ fontSize: 18, color: '#C62828' }}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#f4f4f4' },

  header:          { backgroundColor: '#1a4731', paddingTop: 52, paddingBottom: 24, paddingHorizontal: 24, alignItems: 'center' },
  avatarWrapper:   { position: 'relative', marginBottom: 12 },
  avatar:          { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2d7a4f', borderWidth: 3, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarInitials:  { fontSize: 26, fontWeight: '600', color: '#fff' },
  editBadge:       { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#1a4731', alignItems: 'center', justifyContent: 'center' },
  editBadgeText:   { color: '#fff', fontSize: 11 },
  headerName:      { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 3 },
  headerSub:       { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 18 },
  statsRow:        { flexDirection: 'row', gap: 10, width: '100%' },
  statBox:         { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  statValue:       { color: '#fff', fontSize: 17, fontWeight: '600' },
  statLabel:       { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 },

  section:         { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle:    { fontSize: 11, fontWeight: '600', color: '#888', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 },
  card:            { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, overflow: 'hidden' },

  infoRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  infoLabel:       { fontSize: 11, color: '#9ca3af' },
  infoValue:       { fontSize: 14, fontWeight: '500', color: '#111', marginTop: 1 },

  menuRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  menuLabel:       { fontSize: 14, fontWeight: '500', color: '#111' },
  menuSub:         { fontSize: 12, color: '#9ca3af', marginTop: 1 },

  iconBox:         { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  chevron:         { paddingLeft: 4 },
  chevronText:     { fontSize: 20, color: '#ccc', lineHeight: 22 },

  onlineBadge:     { backgroundColor: '#E8F5E9', borderRadius: 20, paddingVertical: 2, paddingHorizontal: 8, marginRight: 6 },
  onlineBadgeText: { fontSize: 11, color: '#2d7a4f', fontWeight: '500' },
});