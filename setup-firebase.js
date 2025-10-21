#!/usr/bin/env node

/**
 * Firebase Setup Helper Script
 * This script helps you configure Firebase for the PcoSense app
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Firebase Setup Helper for PcoSense');
console.log('=====================================\n');

console.log('This script will help you configure Firebase for your app.');
console.log('You can get your Firebase configuration from: https://console.firebase.google.com/\n');

const questions = [
  {
    key: 'apiKey',
    question: 'Enter your Firebase API Key: ',
    example: 'AIzaSyB...'
  },
  {
    key: 'authDomain',
    question: 'Enter your Auth Domain: ',
    example: 'your-project.firebaseapp.com'
  },
  {
    key: 'projectId',
    question: 'Enter your Project ID: ',
    example: 'your-project-id'
  },
  {
    key: 'storageBucket',
    question: 'Enter your Storage Bucket: ',
    example: 'your-project.appspot.com'
  },
  {
    key: 'messagingSenderId',
    question: 'Enter your Messaging Sender ID: ',
    example: '123456789012'
  },
  {
    key: 'appId',
    question: 'Enter your App ID: ',
    example: '1:123456789012:web:abcdef1234567890abcdef'
  }
];

const config = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateConfig();
    return;
  }

  const q = questions[index];
  rl.question(q.question, (answer) => {
    if (answer.trim()) {
      config[q.key] = answer.trim();
    }
    askQuestion(index + 1);
  });
}

function generateConfig() {
  console.log('\n📝 Generating Firebase configuration...\n');

  // Generate firebaseConfig.js
  const firebaseConfigContent = `import { initializeApp, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "${config.apiKey || 'your-api-key'}",
  authDomain: "${config.authDomain || 'your-project.firebaseapp.com'}",
  projectId: "${config.projectId || 'your-project-id'}",
  storageBucket: "${config.storageBucket || 'your-project.appspot.com'}",
  messagingSenderId: "${config.messagingSenderId || '123456789012'}",
  appId: "${config.appId || '1:123456789012:web:abcdef1234567890abcdef'}"
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
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      console.error('❌ Firebase Auth initialization failed:', error.message);
      auth = null;
    }
  }

  try {
    db = getFirestore(app);
  } catch (error) {
    console.error('❌ Firestore initialization failed:', error.message);
    db = null;
  }

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

export { auth, db, storage };
export default app;`;

  // Write the configuration file
  const configPath = path.join(__dirname, 'src', 'config', 'firebaseConfig.js');
  fs.writeFileSync(configPath, firebaseConfigContent);

  // Generate .env file
  const envContent = `# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=${config.apiKey || 'your-api-key'}
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=${config.authDomain || 'your-project.firebaseapp.com'}
EXPO_PUBLIC_FIREBASE_PROJECT_ID=${config.projectId || 'your-project-id'}
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=${config.storageBucket || 'your-project.appspot.com'}
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId || '123456789012'}
EXPO_PUBLIC_FIREBASE_APP_ID=${config.appId || '1:123456789012:web:abcdef1234567890abcdef'}

# Gemini AI Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Expo Configuration
EXPO_PUBLIC_EXPO_PROJECT_ID=your_expo_project_id`;

  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);

  console.log('✅ Firebase configuration files created successfully!');
  console.log('📁 Files created:');
  console.log('   - src/config/firebaseConfig.js');
  console.log('   - .env');
  console.log('\n🚀 You can now run: npx expo start');
  console.log('\n📖 For more help, see FIREBASE_SETUP.md');

  rl.close();
}

// Start the setup process
askQuestion(0);












