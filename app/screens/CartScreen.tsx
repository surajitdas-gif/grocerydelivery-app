// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   TextInput,
// } from 'react-native';
// import { useCart } from '../context/CartContext';

// export default function CartScreen() {
//   const { cart, increaseQty, decreaseQty } = useCart();

//   const subtotal = cart.reduce(
//     (sum, item) => sum + item.price * (item.qty || 1),
//     0
//   );

//   const total = subtotal + 35;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <Text style={styles.header}>My Cart 🛒</Text>
//       <Text style={styles.delivery}>Delivery in 10 mins 🚀</Text>

//       {cart.length === 0 ? (
//         <View style={styles.emptyCart}>
//           <Text style={styles.emptyText}>Your cart is empty</Text>
//         </View>
//       ) : (
//         cart.map((item, index) => (
//           <View key={index} style={styles.card}>
//             <Image source={{ uri: item.image }} style={styles.image} />

//             <View style={styles.info}>
//               <Text style={styles.name}>{item.name}</Text>

//               <Text style={styles.price}>₹{item.price}</Text>

//               <View style={styles.qtyRow}>
//                 <TouchableOpacity
//                   style={styles.qtyBtn}
//                   onPress={() => decreaseQty(item.name)}
//                 >
//                   <Text>-</Text>
//                 </TouchableOpacity>

//                 <Text style={styles.qtyNumber}>
//                   {item.qty || 1}
//                 </Text>

//                 <TouchableOpacity
//                   style={styles.qtyBtn}
//                   onPress={() => increaseQty(item.name)}
//                 >
//                   <Text>+</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         ))
//       )}

//       <View style={styles.billBox}>
//         <Text style={styles.billTitle}>Bill Details</Text>

//         <View style={styles.billRow}>
//           <Text>Subtotal</Text>
//           <Text>₹{subtotal}</Text>
//         </View>

//         <View style={styles.billRow}>
//           <Text>Delivery Fee</Text>
//           <Text style={{ color: '#16a34a' }}>₹30</Text>
//         </View>

//         <View style={styles.billRow}>
//           <Text>Platform Fee</Text>
//           <Text>₹5</Text>
//         </View>

//         <View style={styles.billRow}>
//           <Text style={styles.total}>Total</Text>
//           <Text style={styles.total}>₹{total}</Text>
//         </View>

//         <TextInput placeholder="Apply coupon" style={styles.input} />

//         <TouchableOpacity style={styles.checkout}>
//           <Text style={styles.checkoutText}>Proceed to Checkout →</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 16,
//     marginTop: 35,
//   },

//   header: {
//     fontSize: 26,
//     fontWeight: '700',
//   },

//   delivery: {
//     color: '#6b7280',
//     marginBottom: 18,
//   },

//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 14,
//     elevation: 3,
//     alignItems: 'center',
//   },

//   image: {
//     width: 75,
//     height: 75,
//     borderRadius: 12,
//   },

//   info: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   name: {
//     fontSize: 15,
//     fontWeight: '700',
//   },

//   price: {
//     fontWeight: '700',
//     marginVertical: 6,
//   },

//   qtyRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },

//   qtyBtn: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     backgroundColor: '#e5e7eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },

//   qtyNumber: {
//     fontWeight: '700',
//     fontSize: 15,
//   },

//   billBox: {
//     backgroundColor: '#f9fafb',
//     padding: 16,
//     borderRadius: 16,
//     marginTop: 20,
//     marginBottom: 30,
//   },

//   billTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 12,
//   },

//   billRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },

//   total: {
//     fontWeight: '700',
//     fontSize: 16,
//   },

//   input: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 12,
//   },

//   checkout: {
//     backgroundColor: '#16a34a',
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 14,
//   },

//   checkoutText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: '700',
//   },

//   emptyCart: {
//     alignItems: 'center',
//     marginTop: 80,
//   },

//   emptyText: {
//     fontSize: 20,
//     color: '#666',
//   },
// });

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    checkout,
  } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  const total = subtotal + 35;

  const handleCheckout = () => {
    checkout();

    Alert.alert(
      'Order Placed ✅',
      'Your order moved to Orders tab'
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>My Cart 🛒</Text>
      <Text style={styles.delivery}>Delivery in 10 mins 🚀</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        cart.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.price}>₹{item.price}</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => decreaseQty(item.name)}
                >
                  <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtyNumber}>
                  {item.qty || 1}
                </Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => increaseQty(item.name)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}

      <View style={styles.billBox}>
        <Text style={styles.billTitle}>Bill Details</Text>

        <View style={styles.billRow}>
          <Text>Subtotal</Text>
          <Text>₹{subtotal}</Text>
        </View>

        <View style={styles.billRow}>
          <Text>Delivery Fee</Text>
          <Text style={{ color: '#16a34a' }}>₹30</Text>
        </View>

        <View style={styles.billRow}>
          <Text>Platform Fee</Text>
          <Text>₹5</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.total}>Total</Text>
          <Text style={styles.total}>₹{total}</Text>
        </View>

        <TextInput placeholder="Apply coupon" style={styles.input} />

        <TouchableOpacity
          style={styles.checkout}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 35,
  },

  header: {
    fontSize: 26,
    fontWeight: '700',
  },

  delivery: {
    color: '#6b7280',
    marginBottom: 18,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    alignItems: 'center',
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
  },

  price: {
    fontWeight: '700',
    marginVertical: 6,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  qtyNumber: {
    fontWeight: '700',
    fontSize: 15,
  },

  billBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 30,
  },

  billTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  total: {
    fontWeight: '700',
    fontSize: 16,
  },

  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },

  checkout: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },

  checkoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  emptyCart: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyText: {
    fontSize: 20,
    color: '#666',
  },
});