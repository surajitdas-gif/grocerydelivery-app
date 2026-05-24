


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router, useFocusEffect } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useCart } from '../../src/context/CartContext';

// export default function ProfileScreen() {
//   const [userName, setUserName] = useState('User');
//   const [userEmail, setUserEmail] = useState('user@gmail.com');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [realOrders, setRealOrders] =
//   useState<any[]>([]);

//  const { cart } = useCart();

//   useFocusEffect(
//     React.useCallback(() => {
//       loadUser();
//     }, [])
//   );

//   const loadUser = async () => {
//     try {
//       const user = await AsyncStorage.getItem('user');

//       if (user) {
//         const parsed = JSON.parse(user);

//         setUserName(parsed.name || 'User');
//         setUserEmail(parsed.email || 'user@gmail.com');
//         setPhone(parsed.phone || '');
//         setAddress(parsed.address || '');
//         const res = await fetch(
//   `https://grocerydelivery-backend.onrender.com/api/orders/my-orders/${parsed._id}`
// );

// const data = await res.json();

// if (data.success) {

//   setRealOrders(data.orders);

// }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       const user = JSON.parse(
//         (await AsyncStorage.getItem('user')) || '{}'
//       );

//       await fetch(
//         `https://grocerydelivery-backend.onrender.com/api/update-profile/${user._id}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             name: userName,
//             phone,
//             address,
//           }),
//         }
//       );

//       const updatedUser = {
//         _id: user._id,
//         name: userName,
//         email: user.email,
//         phone,
//         address,
//       };

//       await AsyncStorage.setItem(
//         'user',
//         JSON.stringify(updatedUser)
//       );

//       Alert.alert('Profile updated successfully ✅');
//     } catch (error) {
//       console.log(error);
//       Alert.alert('Update failed');
//     }
//   };

//   const handleLogout = () => {
//     Alert.alert('Log out', 'Are you sure?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Log out',
//         style: 'destructive',
//         onPress: async () => {
//           await AsyncStorage.removeItem('token');
//           await AsyncStorage.removeItem('user');
//           router.replace('/auth/login' as any);
//         },
//       },
//     ]);
//   };

// const totalSpent = realOrders.reduce(
//   (sum, order) => {

//     return (
//       sum +
//       order.items.reduce(
//         (s: number, item: any) =>
//           s + item.price * (item.qty || 1),
//         0
//       )
//     );

//   },
//   0
// );

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* ── HERO HEADER ── */}
//       <View style={styles.header}>
//         {/* Decorative circles */}
//         <View style={styles.decorCircle1} />
//         <View style={styles.decorCircle2} />

//         <View style={styles.avatarWrapper}>
//           <View style={styles.avatarRing}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>
//                 {userName.charAt(0).toUpperCase()}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.onlineDot} />
//         </View>

//         <Text style={styles.headerName}>{userName}</Text>
//         <Text style={styles.headerSub}>Member since Jan 2024</Text>

//         {/* Stats Row */}
//         <View style={styles.statsRow}>
//           <View style={styles.statBox}>
//             <Text style={styles.statValue}>{realOrders.length}</Text>
//             <Text style={styles.statLabel}>Orders</Text>
//           </View>

//           <View style={[styles.statBox, styles.statBoxCenter]}>
//             <Text style={styles.statValue}>₹{totalSpent}</Text>
//             <Text style={styles.statLabel}>Spent</Text>
//           </View>

//           <View style={styles.statBox}>
//             <Text style={styles.statValue}>4.9★</Text>
//             <Text style={styles.statLabel}>Rating</Text>
//           </View>
//         </View>
//       </View>

//       {/* ── PERSONAL INFO ── */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <View style={styles.sectionAccent} />
//           <Text style={styles.sectionTitle}>Personal Info</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.label}>Full Name</Text>
//           <Text style={styles.value}>{userName}</Text>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.label}>Email Address</Text>
//           <Text style={styles.value}>{userEmail}</Text>
//         </View>

//         <View style={styles.inputWrapper}>
//           <Text style={styles.inputLabel}>Phone Number</Text>
//           <TextInput
//             style={styles.input}
//             value={phone}
//             onChangeText={setPhone}
//             placeholder="Enter phone number"
//             placeholderTextColor="#b0b8c1"
//             keyboardType="phone-pad"
//           />
//         </View>

//         <View style={styles.inputWrapper}>
//           <Text style={styles.inputLabel}>Delivery Address</Text>
//           <TextInput
//             style={[styles.input, styles.inputMultiline]}
//             value={address}
//             onChangeText={setAddress}
//             placeholder="Enter address"
//             placeholderTextColor="#b0b8c1"
//             multiline
//           />
//         </View>
//       </View>

//       {/* ── ACCOUNT ── */}
//       <View style={styles.section}>

//         <View style={styles.sectionHeader}>
//           <View style={styles.sectionAccent} />
//           <Text style={styles.sectionTitle}>
//             Account
//           </Text>
//         </View>

//         {/* MY ORDERS */}

//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() =>
//             router.push('/(tabs)/orders' as any)
//           }
//         >

//           <View style={styles.cardRow}>

//             <View style={styles.cardIcon}>
//               <Text style={styles.cardIconText}>
//                 🛍️
//               </Text>
//             </View>

//             <View style={styles.cardBody}>

//               <Text style={styles.value}>
//                 My Orders
//               </Text>

//               <Text style={styles.label}>
//                 {realOrders.length} orders placed
//               </Text>

//             </View>

//             <Text style={styles.chevron}>
//               ›
//             </Text>

//           </View>

//         </TouchableOpacity>

//         {/* CART ITEMS */}

//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() =>
//             router.push('/cart' as any)
//           }
//         >

//           <View style={styles.cardRow}>

//             <View style={styles.cardIcon}>
//               <Text style={styles.cardIconText}>
//                 🛒
//               </Text>
//             </View>

//             <View style={styles.cardBody}>

//               <Text style={styles.value}>
//                 Cart Items
//               </Text>

//               <Text style={styles.label}>
//                 {cart.length} items in cart
//               </Text>

//             </View>

//             <Text style={styles.chevron}>
//               ›
//             </Text>

//           </View>

//         </TouchableOpacity>

//       </View>


//       {/* ── HELP & SUPPORT ── */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <View style={styles.sectionAccent} />
//           <Text style={styles.sectionTitle}>Help & Support</Text>
//         </View>

//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() => router.push('/help/faq' as any)}
//         >
//           <View style={styles.cardRow}>
//             <View style={styles.cardIcon}>
//               <Text style={styles.cardIconText}>❓</Text>
//             </View>
//             <View style={styles.cardBody}>
//               <Text style={styles.value}>FAQs</Text>
//               <Text style={styles.label}>Frequently asked questions</Text>
//             </View>
//             <Text style={styles.chevron}>›</Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() => router.push('/help/ai-chat' as any)}
//         >
//           <View style={styles.cardRow}>
//             <View style={styles.cardIcon}>
//               <Text style={styles.cardIconText}>💬</Text>
//             </View>
//             <View style={styles.cardBody}>
//               <Text style={styles.value}>Contact Us</Text>
//               <Text style={styles.label}>Chat, email or call support</Text>
//             </View>
//             <Text style={styles.chevron}>›</Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() => router.push('/help/report' as any)}
//         >
//           <View style={styles.cardRow}>
//             <View style={styles.cardIcon}>
//               <Text style={styles.cardIconText}>🐛</Text>
//             </View>
//             <View style={styles.cardBody}>
//               <Text style={styles.value}>Report a Problem</Text>
//               <Text style={styles.label}>Let us know what went wrong</Text>
//             </View>
//             <Text style={styles.chevron}>›</Text>
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.card}
//           activeOpacity={0.85}
//           onPress={() => router.push('/help/privacy' as any)}
//         >
//           <View style={styles.cardRow}>
//             <View style={styles.cardIcon}>
//               <Text style={styles.cardIconText}>🔒</Text>
//             </View>
//             <View style={styles.cardBody}>
//               <Text style={styles.value}>Privacy Policy</Text>
//               <Text style={styles.label}>How we use your data</Text>
//             </View>
//             <Text style={styles.chevron}>›</Text>
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* ── ACTIONS ── */}
//       <View style={styles.actionsSection}>
//         <TouchableOpacity
//           style={styles.updateBtn}
//           onPress={handleUpdateProfile}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.updateText}>Update Profile</Text>
//         </TouchableOpacity>

//         <View style={styles.actionRow}>
//           <TouchableOpacity
//             style={styles.halfBtn}
//             onPress={() => router.push('/delivery/dashboard' as any)}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.halfBtnIcon}>🚚</Text>
//             <Text style={styles.halfBtnText}>Delivery{'\n'}Dashboard</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.halfBtn, styles.halfBtnBlue]}
//             onPress={() => router.push('/admin/dashboard' as any)}
//             activeOpacity={0.85}
//           >
//             <Text style={styles.halfBtnIcon}>⚙️</Text>
//             <Text style={styles.halfBtnText}>Admin{'\n'}Dashboard</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={styles.logout}
//           onPress={handleLogout}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.logoutText}>🚪  Log Out</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ height: 40 }} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f2f5',
//   },

//   /* ── HEADER ── */
//   header: {
//     backgroundColor: '#0f2d1f',
//     paddingTop: 60,
//     paddingBottom: 36,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     overflow: 'hidden',
//     position: 'relative',
//   },

//   decorCircle1: {
//     position: 'absolute',
//     width: 220,
//     height: 220,
//     borderRadius: 110,
//     backgroundColor: 'rgba(45,122,79,0.18)',
//     top: -60,
//     right: -60,
//   },

//   decorCircle2: {
//     position: 'absolute',
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     backgroundColor: 'rgba(45,122,79,0.12)',
//     bottom: -30,
//     left: -30,
//   },

//   avatarWrapper: {
//     position: 'relative',
//     marginBottom: 14,
//   },

//   avatarRing: {
//     width: 92,
//     height: 92,
//     borderRadius: 46,
//     borderWidth: 2.5,
//     borderColor: 'rgba(255,255,255,0.25)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#2d7a4f',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   avatarText: {
//     color: '#fff',
//     fontSize: 30,
//     fontWeight: '700',
//     letterSpacing: 1,
//   },

//   onlineDot: {
//     position: 'absolute',
//     bottom: 4,
//     right: 4,
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: '#4ade80',
//     borderWidth: 2,
//     borderColor: '#0f2d1f',
//   },

//   headerName: {
//     color: '#ffffff',
//     fontSize: 22,
//     fontWeight: '700',
//     letterSpacing: 0.3,
//   },

//   headerSub: {
//     color: 'rgba(255,255,255,0.5)',
//     fontSize: 13,
//     marginTop: 4,
//     letterSpacing: 0.2,
//   },

//   statsRow: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 22,
//     width: '100%',
//   },

//   statBox: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.08)',
//     borderRadius: 14,
//     paddingVertical: 14,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//   },

//   statBoxCenter: {
//     backgroundColor: 'rgba(45,122,79,0.35)',
//     borderColor: 'rgba(74,222,128,0.25)',
//   },

//   statValue: {
//     color: '#ffffff',
//     fontWeight: '700',
//     fontSize: 15,
//   },

//   statLabel: {
//     color: 'rgba(255,255,255,0.45)',
//     fontSize: 11,
//     marginTop: 3,
//     letterSpacing: 0.5,
//     textTransform: 'uppercase',
//   },

//   /* ── SECTIONS ── */
//   section: {
//     paddingHorizontal: 16,
//     marginTop: 24,
//   },

//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },

//   sectionAccent: {
//     width: 4,
//     height: 16,
//     borderRadius: 2,
//     backgroundColor: '#2d7a4f',
//   },

//   sectionTitle: {
//     fontSize: 13,
//     color: '#374151',
//     fontWeight: '700',
//     letterSpacing: 0.6,
//     textTransform: 'uppercase',
//   },

//   /* ── CARD ── */
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 2,
//   },

//   cardRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },

//   cardIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: '#f0faf4',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   cardIconText: {
//     fontSize: 18,
//   },

//   cardBody: {
//     flex: 1,
//   },

//   chevron: {
//     fontSize: 22,
//     color: '#c0c8d0',
//     fontWeight: '300',
//   },

//   label: {
//     color: '#9ca3af',
//     fontSize: 12,
//     marginTop: 2,
//     letterSpacing: 0.2,
//   },

//   value: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//   },

//   /* ── INPUTS ── */
//   inputWrapper: {
//     marginBottom: 10,
//   },

//   inputLabel: {
//     fontSize: 12,
//     color: '#374151',
//     fontWeight: '600',
//     letterSpacing: 0.4,
//     textTransform: 'uppercase',
//     marginBottom: 6,
//     marginLeft: 4,
//   },

//   input: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     fontSize: 14,
//     color: '#111827',
//     borderWidth: 1.5,
//     borderColor: '#e5e7eb',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.04,
//     shadowRadius: 4,
//     elevation: 1,
//   },

//   inputMultiline: {
//     minHeight: 72,
//     textAlignVertical: 'top',
//   },

//   /* ── ACTIONS ── */
//   actionsSection: {
//     paddingHorizontal: 16,
//     marginTop: 24,
//   },

//   updateBtn: {
//     backgroundColor: '#0f2d1f',
//     padding: 17,
//     borderRadius: 16,
//     shadowColor: '#0f2d1f',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//     marginBottom: 12,
//   },

//   updateText: {
//     color: '#ffffff',
//     textAlign: 'center',
//     fontWeight: '700',
//     fontSize: 15,
//     letterSpacing: 0.3,
//   },

//   actionRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 12,
//   },

//   halfBtn: {
//     flex: 1,
//     backgroundColor: '#2d7a4f',
//     borderRadius: 16,
//     paddingVertical: 16,
//     alignItems: 'center',
//     shadowColor: '#2d7a4f',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   halfBtnBlue: {
//     backgroundColor: '#1d4ed8',
//     shadowColor: '#1d4ed8',
//   },

//   halfBtnIcon: {
//     fontSize: 22,
//     marginBottom: 6,
//   },

//   halfBtnText: {
//     color: '#ffffff',
//     fontWeight: '700',
//     fontSize: 13,
//     textAlign: 'center',
//     lineHeight: 18,
//   },

//   logout: {
//     backgroundColor: '#ffffff',
//     padding: 17,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: '#fee2e2',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.04,
//     shadowRadius: 4,
//     elevation: 1,
//   },

//   logoutText: {
//     color: '#dc2626',
//     textAlign: 'center',
//     fontWeight: '700',
//     fontSize: 15,
//     letterSpacing: 0.2,
//   },
// });
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@gmail.com');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [activeInput, setActiveInput] = useState<string | null>(null);

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
          `https://grocerydelivery-backend.onrender.com/api/orders/my-orders/${parsed._id}`
        );
        const data = await res.json();
        if (data.success) setRealOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
      await fetch(
        `https://grocerydelivery-backend.onrender.com/api/update-profile/${user._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userName, phone, address }),
        }
      );
      const updatedUser = {
        _id: user._id,
        name: userName,
        email: user.email,
        phone,
        address,
      };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Update failed. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
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
    (sum, order) =>
      sum +
      order.items.reduce(
        (s: number, item: any) => s + item.price * (item.qty || 1),
        0
      ),
    0
  );

  const initials = userName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* ── HERO ── */}
      <View style={styles.hero}>
        {/* Background texture layers */}
        <View style={styles.heroGradientLayer1} />
        <View style={styles.heroGradientLayer2} />
        <View style={styles.heroGradientLayer3} />

        {/* Gold accent line */}
        <View style={styles.heroAccentLine} />

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarOuterRing}>
            <View style={styles.avatarInnerRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
          </View>
        </View>

        <Text style={styles.heroName}>{userName}</Text>
        <Text style={styles.heroEmail}>{userEmail}</Text>

        {/* Membership pill */}
        <View style={styles.memberPill}>
          <Text style={styles.memberPillIcon}>✦</Text>
          <Text style={styles.memberPillText}>Premium Member</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{realOrders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹{totalSpent.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* ── PERSONAL INFO ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Personal Information</Text>

        <View style={styles.glassCard}>
          {/* Read-only fields */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Text style={styles.infoIcon}>👤</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userName}</Text>
            </View>
          </View>

          <View style={styles.rowSeparator} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Text style={styles.infoIcon}>✉️</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{userEmail}</Text>
            </View>
          </View>
        </View>

        {/* Editable fields */}
        <View style={styles.glassCard}>
          <View style={styles.inputFieldWrap}>
            <View style={styles.infoIconWrap}>
              <Text style={styles.infoIcon}>📱</Text>
            </View>
            <View style={styles.inputContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <TextInput
                style={[
                  styles.editInput,
                  activeInput === 'phone' && styles.editInputFocused,
                ]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Add phone number"
                placeholderTextColor="#8E9BAA"
                keyboardType="phone-pad"
                onFocus={() => setActiveInput('phone')}
                onBlur={() => setActiveInput(null)}
              />
            </View>
          </View>

          <View style={styles.rowSeparator} />

          <View style={styles.inputFieldWrap}>
            <View style={styles.infoIconWrap}>
              <Text style={styles.infoIcon}>📍</Text>
            </View>
            <View style={styles.inputContent}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <TextInput
                style={[
                  styles.editInput,
                  styles.editInputMulti,
                  activeInput === 'address' && styles.editInputFocused,
                ]}
                value={address}
                onChangeText={setAddress}
                placeholder="Add your delivery address"
                placeholderTextColor="#8E9BAA"
                multiline
                numberOfLines={2}
                onFocus={() => setActiveInput('address')}
                onBlur={() => setActiveInput(null)}
              />
            </View>
          </View>
        </View>
      </View>

      {/* ── QUICK ACCESS ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Quick Access</Text>

        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/orders' as any)}
          >
            <View style={styles.quickIconBg}>
              <Text style={styles.quickIcon}>🛍️</Text>
            </View>
            <Text style={styles.quickValue}>{realOrders.length}</Text>
            <Text style={styles.quickLabel}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() => router.push('/cart' as any)}
          >
            <View style={[styles.quickIconBg, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.quickIcon}>🛒</Text>
            </View>
            <Text style={styles.quickValue}>{cart.length}</Text>
            <Text style={styles.quickLabel}>Cart Items</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── HELP & SUPPORT ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Help & Support</Text>

        <View style={styles.glassCard}>
          {[
            {
              icon: '❓',
              title: 'FAQs',
              sub: 'Frequently asked questions',
              route: '/help/faq',
            },
            {
              icon: '💬',
              title: 'Contact Support',
              sub: 'Chat, email or call us',
              route: '/help/ai-chat',
            },
            {
              icon: '🐛',
              title: 'Report a Problem',
              sub: 'Let us know what went wrong',
              route: '/help/report',
            },
            {
              icon: '🔒',
              title: 'Privacy Policy',
              sub: 'How we handle your data',
              route: '/help/privacy',
            },
          ].map((item, index, arr) => (
            <React.Fragment key={item.route}>
              <TouchableOpacity
                style={styles.listRow}
                activeOpacity={0.7}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.listIconWrap}>
                  <Text style={styles.listIcon}>{item.icon}</Text>
                </View>
                <View style={styles.listContent}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <Text style={styles.listSub}>{item.sub}</Text>
                </View>
                <Text style={styles.listChevron}>›</Text>
              </TouchableOpacity>
              {index < arr.length - 1 && <View style={styles.rowSeparator} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ── ACTIONS ── */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleUpdateProfile}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  contentContainer: {
    paddingBottom: 0,
  },

  /* ── HERO ── */
  hero: {
    backgroundColor: '#0A1F14',
    paddingTop: 64,
    paddingBottom: 44,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroGradientLayer1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(22, 101, 52, 0.22)',
    top: -80,
    right: -100,
  },
  heroGradientLayer2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(20, 83, 45, 0.15)',
    bottom: -40,
    left: -60,
  },
  heroGradientLayer3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    top: 30,
    left: 30,
  },
  heroAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#C9A84C',
    opacity: 0.7,
  },

  /* Avatar */
  avatarContainer: {
    position: 'relative',
    marginBottom: 18,
  },
  avatarOuterRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInnerRing: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 168, 76, 0.08)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A472A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(201, 168, 76, 0.5)',
  },
  avatarText: {
    color: '#C9A84C',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0A1F14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
  },

  heroName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  heroEmail: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    letterSpacing: 0.3,
    marginBottom: 14,
  },

  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(201, 168, 76, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 28,
  },
  memberPillIcon: {
    color: '#C9A84C',
    fontSize: 11,
  },
  memberPillText: {
    color: '#C9A84C',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  /* Stats */
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 18,
    paddingHorizontal: 10,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  /* ── SECTIONS ── */
  section: {
    paddingHorizontal: 16,
    marginTop: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E9BAA',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },

  /* Glass card */
  glassCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },

  /* Info rows */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEEF0',
  },
  infoIcon: {
    fontSize: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 0.1,
  },

  rowSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },

  /* Editable inputs */
  inputFieldWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  inputContent: {
    flex: 1,
  },
  editInput: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5E7EB',
    marginTop: 4,
  },
  editInputFocused: {
    borderBottomColor: '#0A1F14',
  },
  editInputMulti: {
    minHeight: 44,
    textAlignVertical: 'top',
  },

  /* Quick access cards */
  quickRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  quickIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickIcon: {
    fontSize: 22,
  },
  quickValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A1F14',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },

  /* List rows */
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 14,
  },
  listIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEEF0',
  },
  listIcon: {
    fontSize: 16,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  listSub: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  listChevron: {
    fontSize: 24,
    color: '#D1D5DB',
    fontWeight: '300',
    lineHeight: 28,
  },

  /* ── ACTIONS ── */
  actionsSection: {
    paddingHorizontal: 16,
    marginTop: 28,
    gap: 10,
  },
  saveBtn: {
    backgroundColor: '#0A1F14',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#0A1F14',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});