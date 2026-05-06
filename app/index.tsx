
import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const user = await AsyncStorage.getItem('user');

      if (user) {
        router.replace('/(tabs)/home' as any);
      } else {
        router.replace('/auth/login' as any);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}

