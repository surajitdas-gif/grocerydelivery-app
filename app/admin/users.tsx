import {
    useEffect,
    useState,
} from 'react';

import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const API_URL =
    'http://172.20.10.3:5000';

export default function AdminUsers() {

    const [users, setUsers] =
        useState<any[]>([]);
    const [loading, setLoading] =
        useState(true);

    // ==========================================
    // LOAD USERS
    // ==========================================

    useEffect(() => {

        fetchUsers();

    }, []);

    const fetchUsers =
        async () => {

            try {

                const res =
                    await fetch(
                        `${API_URL}/api/admin/users`
                    );

                const data =
                    await res.json();

                setUsers(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
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
                All Users
            </Text>

            <FlatList
                data={users}
                keyExtractor={(item) =>
                    item._id
                }
                contentContainerStyle={{
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (

                    <View style={styles.card}>

                        <Text style={styles.name}>
                            {item.name || 'No Name'}
                        </Text>

                        <Text style={styles.info}>
                            📞 {item.phone}
                        </Text>

                        <Text style={styles.info}>
                            ✉️ {item.email}
                        </Text>

                        <Text style={styles.info}>
                            🆔 {item._id}
                        </Text>

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
            fontSize: 28,
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

        info: {
            marginTop: 8,
            color: '#4b5563',
        },
    });