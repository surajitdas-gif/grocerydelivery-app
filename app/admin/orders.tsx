import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL =
  'https://grocerydelivery-backend.onrender.com';

export default function AdminOrders() {
  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders =
    async () => {

      try {

        const res =
          await fetch(
            `${API_URL}/api/admin/orders`
          );

        const data =
          await res.json();

        setOrders(data);

      } catch (error) {

        if (__DEV__) {
          console.log(error);
        }

      } finally {

        setLoading(false);
      }
    };

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus =
    async (
      id: string,
      status: string
    ) => {

      try {

        await fetch(

          `${API_URL}/api/admin/orders/status/${id}`,

          {
            method: 'PUT',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

        Alert.alert(
          'Order Updated'
        );

        setOrders(prev =>
          prev.map(order =>
            order._id === id
              ? {
                ...order,
                status: status
              }
              : order
          )
        );

      } catch (error) {

        if (__DEV__) {
          console.log(error);
        }
      }
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#16a34a"
        />

      </View>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Admin Orders
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item, index) =>
          item._id || index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.name}>
              {item.customerName}
            </Text>

            <Text style={styles.phone}>
              📞 {item.customerPhone}
            </Text>

            <Text style={styles.address}>
              📍 {item.address}
            </Text>

            <Text style={styles.total}>
              ₹{item.total}
            </Text>

            <Text style={styles.status}>
              {item.status}
            </Text>

            {/* BUTTONS */}

            <View style={styles.row}>

              <TouchableOpacity
                style={styles.prepareBtn}
                onPress={() =>
                  item._id &&
                  updateStatus(
                    item._id,
                    'Preparing'
                  )
                }
              >

                <Text style={styles.btnText}>
                  Preparing
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outBtn}
                onPress={() =>
                  item._id &&
                  updateStatus(
                    item._id,
                    'Out for Delivery'
                  )
                }
              >
                <Text style={styles.btnText}>
                  Out
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() =>
                  item._id &&
                  updateStatus(
                    item._id,
                    'Delivered'
                  )
                }
              >

                <Text style={styles.btnText}>
                  Delivered
                </Text>

              </TouchableOpacity>

            </View>

          </View>
        )}
      />

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#f3f4f6',
      paddingTop: 60,
      paddingHorizontal: 16,
    },

    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      fontSize: 26,
      fontWeight: '900',
      marginBottom: 20,
      color: '#111827',
    },

    card: {
      backgroundColor: '#fff',
      padding: 18,
      borderRadius: 18,
      marginBottom: 14,
      elevation: 3,
    },

    name: {
      fontSize: 18,
      fontWeight: '800',
      color: '#111827',
    },

    phone: {
      marginTop: 8,
      color: '#374151',
    },

    address: {
      marginTop: 6,
      color: '#6b7280',
    },

    total: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: '800',
      color: '#16a34a',
    },

    status: {
      marginTop: 8,
      fontWeight: '700',
      color: '#2563eb',
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 18,
    },

    prepareBtn: {
      backgroundColor: '#f59e0b',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
    },

    outBtn: {
      backgroundColor: '#2563eb',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
    },

    doneBtn: {
      backgroundColor: '#16a34a',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
    },

    btnText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 12,
    },
  });