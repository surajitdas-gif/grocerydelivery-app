import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrSJ9Jke1qEoyvMQg_fsr-KrXLLMoEgTI",
  authDomain: "freshcart2-ae982.firebaseapp.com",
  projectId: "freshcart2-ae982",
  storageBucket: "freshcart2-ae982.firebasestorage.app",
  messagingSenderId: "899887744457",
  appId: "1:899887744457:web:13afdfe542e5f2329bd418"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;