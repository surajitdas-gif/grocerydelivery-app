import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyBGhGC8KZ6x-YhEla51LE1bmLcfzvM-XG8',
  authDomain: 'freshcart-7a92c.firebaseapp.com',
  projectId: 'freshcart-7a92c',
  storageBucket: 'freshcart-7a92c.appspot.com',
  messagingSenderId: '261893177867',
  appId: '1:261893177867:web:8b8020dc52ff71d084fd0e',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;