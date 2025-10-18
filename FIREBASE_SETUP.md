# 🔥 Firebase Setup Guide for PcoSense

## Quick Fix for Current Error

The error `Firebase: Error (auth/invalid-api-key)` occurs because Firebase configuration is missing. Follow these steps:

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `pcosense-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add Web App to Firebase Project

1. In your Firebase project, click the web icon `</>`
2. Register app with nickname: `PcoSense Web`
3. Copy the Firebase configuration object

## Step 3: Update Configuration

Replace the placeholder values in `src/config/firebaseConfig.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 4: Enable Firebase Services

### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password"
3. Enable "Google" (optional)

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users

### Storage
1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode" (for development)

## Step 5: Create Environment File (Optional)

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 6: Test the App

1. Save your configuration
2. Restart the Expo development server
3. The Firebase error should be resolved

## Security Rules (Production)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /chats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

- **Invalid API Key**: Check that your API key is correct
- **Permission Denied**: Check Firestore security rules
- **Network Error**: Check internet connection
- **App Not Found**: Verify project ID and app ID

## Need Help?

If you're still having issues:
1. Check the Firebase Console for error logs
2. Verify all configuration values are correct
3. Make sure Firebase services are enabled
4. Check that your project is not in a restricted region




