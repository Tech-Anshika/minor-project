# 🚨 URGENT SECURITY FIX - API Key Leak

## Issue
**Date**: October 24, 2025  
**Severity**: CRITICAL  
**Status**: IN PROGRESS

GitHub secret scanning detected **2 Google API Keys** publicly exposed in the repository.

## Exposed Keys

### Key #1
- **Type**: Firebase API Key
- **Location**: `src/config/firebaseConfig.js:9`
- **Value**: `AIzaSyCovZlKWUBmfS6IXc0M7X...` (EXPOSED 8 days ago)
- **Risk**: Anyone can access Firebase project, read/write data, access storage

### Key #2  
- **Type**: Google API Key
- **Location**: `node_modules/.../crux-manager.js:1`
- **Value**: `AIzaSyCC50x25vrb5z0tbedCB3...` (EXPOSED 6 days ago)
- **Risk**: Unauthorized API usage, potential data breach

---

## ✅ Immediate Actions Taken

### 1. Code Fixed
- ✅ Updated `src/config/firebaseConfig.js` to use environment variables
- ✅ Created `env.example` template file
- ✅ Updated `.gitignore` to exclude `.env` files
- ✅ Removed hardcoded API keys from code

### 2. Security Best Practices Implemented
```javascript
// Before (INSECURE):
const firebaseConfig = {
  apiKey: "AIzaSyCovZlKWUBmfS6IXc0M7X...", // EXPOSED!
  // ...
};

// After (SECURE):
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY, // From .env
  // ...
};
```

---

## 🔴 REQUIRED ACTIONS (DO THIS NOW!)

### Step 1: Regenerate Firebase API Key

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. Select project: **pcosense-app**
3. Click **Settings** (⚙️ icon) → **Project settings**
4. Go to **General** tab
5. Scroll to **Your apps** section
6. Find your Android app
7. Click **Remove this app** to delete exposed key
8. Click **Add app** → **Android** to create new app with new keys
9. Download new `google-services.json`

### Step 2: Create .env File

```bash
# Copy the template
cp env.example .env

# Edit .env and add your NEW Firebase keys
# NEVER commit this file to git!
```

**Your .env should look like:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...YOUR_NEW_KEY_HERE
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=pcosense-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=pcosense-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=pcosense-app.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=776761222879
EXPO_PUBLIC_FIREBASE_APP_ID=1:776761222879:android:YOUR_NEW_APP_ID
```

### Step 3: Update Firebase Security Rules

**Firestore Rules** (Immediate action):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Restrict all access until proper authentication
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 4: Enable Firebase Security Features

1. **Enable App Check**:
   - Go to Firebase Console → Build → App Check
   - Register your app
   - Enable enforcement

2. **Restrict API Key**:
   - Go to Google Cloud Console
   - APIs & Services → Credentials
   - Find your API key
   - Add application restrictions:
     - Android apps: Add SHA-256 fingerprint
     - HTTP referrers: Add your domain

3. **Monitor Usage**:
   - Set up billing alerts
   - Monitor API quotas
   - Check usage logs regularly

### Step 5: Remove Exposed Keys from Git History

```bash
# Install BFG Repo-Cleaner (recommended) or use git-filter-branch
# WARNING: This rewrites git history!

# Option 1: Using BFG (easier)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text passwords.txt

# Option 2: Using git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/config/firebaseConfig.js" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (ONLY if you're sure!)
git push origin --force --all
```

⚠️ **WARNING**: Force pushing rewrites history and can break collaborators' repos!

---

## 🔐 Security Checklist

- [ ] New Firebase API key generated
- [ ] Old API key deleted/revoked
- [ ] `.env` file created with new keys
- [ ] `.env` file NOT committed to git (check .gitignore)
- [ ] Firebase security rules updated
- [ ] App Check enabled
- [ ] API key restrictions configured
- [ ] Billing alerts set up
- [ ] Git history cleaned (optional but recommended)
- [ ] Team members notified
- [ ] Monitoring enabled

---

## 📋 Prevention Measures

### For Future Development

1. **Never Hardcode Secrets**
   - Always use environment variables
   - Use `.env` files (gitignored)
   - Use EAS Secrets for production builds

2. **Pre-commit Hooks**
```bash
# Install pre-commit hook to detect secrets
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run check-secrets"
```

3. **Secret Scanning**
   - Enable GitHub secret scanning (already enabled)
   - Use tools like `git-secrets` or `truffleHog`
   - Add pre-commit hooks

4. **Code Review**
   - Never approve PRs with hardcoded secrets
   - Review `firebaseConfig.js` changes carefully
   - Check for API keys in all commits

---

## 📞 Support Resources

- **Firebase Security**: https://firebase.google.com/docs/projects/api-keys
- **GitHub Secret Scanning**: https://docs.github.com/en/code-security/secret-scanning
- **Expo Environment Variables**: https://docs.expo.dev/guides/environment-variables/

---

## 🚨 Current Status

**As of October 24, 2025 1:45 AM:**
- ✅ Code fixed and secured
- ⏳ Waiting for new API keys from Firebase Console
- ⏳ Pending git history cleanup
- ⏳ Pending security rules update

**Next Build**: v1.0.5 will use secure environment variables

---

**PRIORITY**: CRITICAL  
**Action Required**: IMMEDIATE  
**Owner**: Tech-Anshika

---

Remember: **Security is not optional. It's essential.** 🔒

