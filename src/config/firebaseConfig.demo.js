// Demo Firebase Configuration
// This file provides a working Firebase configuration for testing
// Replace the values below with your actual Firebase project configuration

import { initializeApp, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Demo Firebase configuration - Using real values from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyCovZlKWUBmfS6IXc0M7XgT-1H5Azbiv1k", // Real API key from google-services.json
  authDomain: "pcosense-app.firebaseapp.com", // Real auth domain
  projectId: "pcosense-app", // Real project ID
  storageBucket: "pcosense-app.firebasestorage.app", // Real storage bucket
  messagingSenderId: "776761222879", // Real sender ID
  appId: "1:776761222879:android:5fb7ca0c86bf2fcfb56b6a" // Real app ID
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
