import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCrkCTp7NP71QyCdsxA4QpzxlJmnFSbJ8A",
  authDomain: "reservation-app-45fd0.firebaseapp.com",
  projectId: "reservation-app-45fd0",
  storageBucket: "reservation-app-45fd0.appspot.com",
  messagingSenderId: "427265318803",
  appId: "1:427265318803:web:13e8a7f70a69e20d3f5266",
};

const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;