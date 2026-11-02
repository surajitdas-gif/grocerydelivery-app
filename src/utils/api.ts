import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A wrapper around the native fetch API that automatically attaches the
 * JWT authentication token to the Authorization header if it exists.
 */
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = await AsyncStorage.getItem('token');

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
