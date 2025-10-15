import { initializeApp, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCovZlKWUBmfS6IXc0M7XgT-1H5Azbiv1k",
  authDomain: "pcosense-app.firebaseapp.com",
  projectId: "pcosense-app",
  storageBucket: "pcosense-app.firebasestorage.app",
  messagingSenderId: "776761222879",
  appId: "1:776761222879:android:5fb7ca0c86bf2fcfb56b6a"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // If app already exists, get the existing app
  if (error.code === 'app/duplicate-app') {
    app = getApp();
  } else {
    throw error;
  }
}

// Initialize Firebase Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // If auth already exists, get the existing auth
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Note: Cloud Messaging is handled by Expo Notifications in React Native
// getMessaging() is only available in web environments

export { auth, db, storage };
export default app;
