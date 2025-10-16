import { initializeApp, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration - Replace with your actual Firebase project config
// For demo purposes, using a valid format (but you need to replace with real values)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "pcosense-demo.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "pcosense-demo",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "pcosense-demo.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890abcdef"
};

// Validate configuration
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('xxxxxxxx')) {
  console.warn('⚠️ Firebase configuration is using placeholder values. Please replace with your actual Firebase project configuration.');
  console.warn('📖 See FIREBASE_SETUP.md for detailed setup instructions.');
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // If app already exists, get the existing app
  if (error.code === 'app/duplicate-app') {
    app = getApp();
  } else {
    console.error('❌ Firebase initialization failed:', error.message);
    console.error('🔧 Please check your Firebase configuration in src/config/firebaseConfig.js');
    console.error('📖 See FIREBASE_SETUP.md for setup instructions');
    // Create a mock app to prevent crashes
    app = null;
  }
}

// Initialize Firebase Auth with AsyncStorage persistence
let auth;
let db;
let storage;

if (app) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    // If auth already exists, get the existing auth
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      console.error('❌ Firebase Auth initialization failed:', error.message);
      auth = null;
    }
  }

  // Initialize Firestore
  try {
    db = getFirestore(app);
  } catch (error) {
    console.error('❌ Firestore initialization failed:', error.message);
    db = null;
  }

  // Initialize Storage
  try {
    storage = getStorage(app);
  } catch (error) {
    console.error('❌ Storage initialization failed:', error.message);
    storage = null;
  }
} else {
  console.warn('⚠️ Firebase app not initialized. Auth, Firestore, and Storage will not be available.');
  auth = null;
  db = null;
  storage = null;
}

// Note: Cloud Messaging is handled by Expo Notifications in React Native
// getMessaging() is only available in web environments

export { auth, db, storage };
export default app;
