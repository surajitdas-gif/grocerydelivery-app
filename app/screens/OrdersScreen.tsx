
// import React from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import { useCart } from '../context/CartContext';

// export default function OrdersScreen() {
//   const { orders } = useCart();

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>My Orders 📦</Text>

//       {orders.length === 0 ? (
//         <Text style={styles.empty}>
//           No orders yet
//         </Text>
//       ) : (
//         orders.map((item, index) => (
//           <View key={index} style={styles.card}>
//             <Image
//               source={{ uri: item.image }}
//               style={styles.image}
//             />

//             <View style={styles.info}>
//               <Text style={styles.name}>
//                 {item.name}
//               </Text>

//               <Text style={styles.qty}>
//                 Qty: {item.qty || 1}
//               </Text>

//               <Text style={styles.price}>
//                 ₹{item.price * (item.qty || 1)}
//               </Text>

//               <Text style={styles.status}>
//                 Status: Preparing 🍳
//               </Text>

//               <Text style={styles.eta}>
//                 Delivery in 15 mins 🚀
//               </Text>
//             </View>
//           </View>
//         ))
//       )}
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
//     marginBottom: 20,
//   },

//   empty: {
//     textAlign: 'center',
//     marginTop: 100,
//     color: '#666',
//     fontSize: 18,
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
//     width: 70,
//     height: 70,
//     borderRadius: 12,
//   },

//   info: {
//     marginLeft: 12,
//   },

//   name: {
//     fontWeight: '700',
//     fontSize: 15,
//   },

//   qty: {
//     color: '#666',
//     marginTop: 4,
//   },

//   price: {
//     marginTop: 4,
//     fontWeight: '700',
//   },

//   status: {
//     color: '#16a34a',
//     marginTop: 4,
//     fontWeight: '600',
//   },

//   eta: {
//     color: '#6b7280',
//     marginTop: 4,
//     fontSize: 12,
//   },
// });
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { useCart } from '../context/CartContext';

export default function OrdersScreen() {
  const { orders } = useCart();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Orders 📦</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders yet</Text>
      ) : (
        orders.map((order, index) => (
          <View key={index} style={styles.orderBox}>
            <Text style={styles.id}>{order.id}</Text>
            <Text style={styles.date}>{order.date}</Text>
            <Text style={styles.status}>
              Status: {order.status} 🚚
            </Text>

            {order.items.map((item, i) => (
              <View key={i} style={styles.card}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                />

                <View style={styles.info}>
                  <Text style={styles.name}>
                    {item.name}
                  </Text>

                  <Text>
                    Qty: {item.qty || 1}
                  </Text>

                  <Text>
                    ₹{item.price * (item.qty || 1)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))
      )}
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
    marginBottom: 20,
  },

  empty: {
    textAlign: 'center',
    marginTop: 100,
    color: '#666',
    fontSize: 18,
  },

  orderBox: {
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },

  id: {
    fontWeight: '700',
  },

  date: {
    color: '#666',
    marginTop: 4,
  },

  status: {
    color: '#16a34a',
    marginTop: 6,
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    marginTop: 10,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },

  info: {
    marginLeft: 12,
  },

  name: {
    fontWeight: '700',
  },
});