import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        console.log('Token:', token);

        setTimeout(() => {
          if (token) {
            router.replace('/(tabs)/home' as any);
          } else {
            router.replace('/auth/login' as any);
          }
        }, 500);
      } catch (error) {
        console.log('Auth error:', error);
        router.replace('/auth/login' as any);
      }
    };

    checkAuth();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" color="#16a34a" />
    </View>
  );
}