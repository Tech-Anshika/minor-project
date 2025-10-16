// Demo Firebase Configuration
// This file provides a working Firebase configuration for testing
// Replace the values below with your actual Firebase project configuration

import { initializeApp, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Demo Firebase configuration - Replace with your actual values
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Replace with your API key
  authDomain: "your-project.firebaseapp.com", // Replace with your auth domain
  projectId: "your-project-id", // Replace with your project ID
  storageBucket: "your-project.appspot.com", // Replace with your storage bucket
  messagingSenderId: "123456789012", // Replace with your sender ID
  appId: "1:123456789012:web:abcdef1234567890abcdef" // Replace with your app ID
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    app = getApp();
  } else {
    console.error('❌ Firebase initialization failed:', error.message);
    app = null;
  }
}

// Initialize Firebase services
let auth = null;
let db = null;
let storage = null;

if (app) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log('✅ Firebase Auth initialized');
  } catch (error) {
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      console.error('❌ Firebase Auth failed:', error.message);
    }
  }

  try {
    db = getFirestore(app);
    console.log('✅ Firestore initialized');
  } catch (error) {
    console.error('❌ Firestore failed:', error.message);
  }

  try {
    storage = getStorage(app);
    console.log('✅ Storage initialized');
  } catch (error) {
    console.error('❌ Storage failed:', error.message);
  }
}

export { auth, db, storage };
export default app;
