# Android App Distribution Guide for PcoSense

This guide will help you create a downloadable link for your Android app that works on all Android phones.

## 📱 Distribution Options

### Option 1: Google Play Store (Recommended for Public Release)
- **Best for**: Official, wide distribution
- **Pros**: Automatic updates, trusted source, easy discovery
- **Cons**: Takes time for approval, requires $25 one-time fee

### Option 2: Direct APK Download Link (Quick Distribution)
- **Best for**: Beta testing, sharing with specific users
- **Pros**: Instant distribution, no approval needed
- **Cons**: Users need to enable "Install from Unknown Sources"

### Option 3: Firebase App Distribution (Beta Testing)
- **Best for**: Testing with a group of testers
- **Pros**: Easy management, automatic updates for testers
- **Cons**: Requires Firebase setup

---

## 🚀 Quick Start: Build and Share APK (Easiest Method)

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```
*If you don't have an Expo account, create one at [expo.dev](https://expo.dev)*

### Step 3: Configure EAS Build
```bash
cd PcoSense
eas build:configure
```

### Step 4: Build APK for Distribution
```bash
eas build --platform android --profile preview
```

**What happens next:**
- EAS will build your app in the cloud
- You'll get a download link when it's done (usually 10-20 minutes)
- The link will look like: `https://expo.dev/artifacts/eas/[unique-id].apk`

### Step 5: Share the Download Link
Once the build completes:
1. Copy the APK download link from the terminal
2. Share this link with anyone
3. They can download and install it on their Android phone

**Note**: Users need to enable "Install from Unknown Sources" in their phone settings.

---

## 🏗️ Build Configuration

### Create `eas.json` in PcoSense folder:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📦 Build Types Explained

### APK (Android Package)
- **Use for**: Direct distribution, sharing with users
- **Command**: `eas build --platform android --profile preview`
- **File size**: Larger (includes all architectures)
- **Installation**: Can be installed directly on any Android device

### AAB (Android App Bundle)
- **Use for**: Google Play Store submission
- **Command**: `eas build --platform android --profile production`
- **File size**: Smaller (Google Play optimizes per device)
- **Installation**: Only through Google Play Store

---

## 🌐 Hosting Your APK for Download

After building, you can host your APK on:

### 1. **GitHub Releases** (Free, Reliable)
```bash
# Create a new release on GitHub
# Upload the downloaded APK file
# Share the release page URL
```

### 2. **Google Drive** (Simple)
1. Upload APK to Google Drive
2. Right-click → Get shareable link
3. Change permissions to "Anyone with the link"
4. Share the link

### 3. **Firebase Hosting** (Professional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Upload APK to hosting
```

### 4. **Expo's Built-in Hosting** (Temporary)
- The link from `eas build` works for 30 days
- After that, you need to re-upload elsewhere

---

## 📤 Submit to Google Play Store

### Step 1: Create a Google Play Console Account
- Go to [play.google.com/console](https://play.google.com/console)
- Pay $25 one-time registration fee
- Complete account setup

### Step 2: Build Production AAB
```bash
cd PcoSense
eas build --platform android --profile production
```

### Step 3: Upload to Google Play Console
```bash
eas submit --platform android
```

Or manually:
1. Download the AAB file from EAS
2. Go to Google Play Console
3. Create a new app
4. Upload the AAB under "Production" or "Internal Testing"
5. Fill in store listing details
6. Submit for review

---

## 🔧 Update app.json for Store Listing

Update your `PcoSense/app.json` with complete information:

```json
{
  "expo": {
    "name": "PcoSense",
    "slug": "PcoSense",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": false,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anshikaexpo.PcoSense"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.anshikaexpo.PcoSense",
      "versionCode": 1,
      "permissions": [
        "ACTIVITY_RECOGNITION",
        "NOTIFICATIONS"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

---

## 📝 User Installation Instructions

When sharing your APK, include these instructions for users:

### For Android Users:
1. **Download the APK** from the provided link
2. **Enable Unknown Sources**:
   - Go to Settings → Security
   - Enable "Install from Unknown Sources" or "Allow from this source"
3. **Install the APK**:
   - Open the downloaded APK file
   - Tap "Install"
   - Wait for installation to complete
4. **Open PcoSense** from your app drawer

### Security Note:
Assure users that:
- The app is safe and developed by you
- They can verify the package name: `com.anshikaexpo.PcoSense`
- They can disable "Unknown Sources" after installation

---

## 🔄 Updating Your App

### For Direct APK Distribution:
1. Update `version` in `app.json` (e.g., "1.0.1")
2. Update `versionCode` in `app.json` (e.g., 2, 3, 4...)
3. Build new APK: `eas build --platform android --profile preview`
4. Share new download link with users
5. Users must uninstall old version and install new one

### For Google Play Store:
1. Update `version` and `versionCode`
2. Build new AAB: `eas build --platform android --profile production`
3. Submit: `eas submit --platform android`
4. Users get automatic updates

---

## 🛠️ Troubleshooting

### Build Fails
- Check your Firebase configuration
- Ensure all dependencies are properly installed
- Check EAS build logs for specific errors

### APK Won't Install
- Make sure device allows installation from unknown sources
- Check if minimum Android version is met
- Verify APK is not corrupted

### App Crashes on Launch
- Test with Expo Go first
- Check Firebase configuration
- Review crash logs in EAS dashboard

---

## 💡 Best Practices

1. **Test thoroughly** before distributing
2. **Version your builds** consistently
3. **Keep APK files** for each version
4. **Document changes** in CHANGELOG.md
5. **Use Play Store** for wide distribution
6. **Use APK** for quick testing and private sharing
7. **Update regularly** based on user feedback

---

## 📊 Distribution Comparison

| Feature | APK Direct | Google Play | Firebase |
|---------|-----------|-------------|----------|
| Cost | Free | $25 one-time | Free |
| Approval Time | Instant | 1-7 days | Instant |
| Updates | Manual | Automatic | Automatic* |
| Trust | Low | High | Medium |
| Analytics | Manual | Built-in | Built-in |
| Best For | Testing | Production | Beta Testing |

---

## 🎯 Recommended Workflow

1. **Development**: Use `expo start` and Expo Go
2. **Internal Testing**: Build APK, share with team
3. **Beta Testing**: Use Firebase App Distribution
4. **Production**: Submit to Google Play Store
5. **Emergency**: Keep APK backup for direct distribution

---

## 📞 Need Help?

- **EAS Build Docs**: https://docs.expo.dev/build/setup/
- **EAS Submit Docs**: https://docs.expo.dev/submit/android/
- **Google Play Console**: https://support.google.com/googleplay/android-developer

---

## ✅ Quick Checklist

Before distribution:
- [ ] App icon is set and looks good
- [ ] Splash screen is configured
- [ ] Firebase is properly configured
- [ ] App permissions are declared
- [ ] Version number is correct
- [ ] App has been tested on real device
- [ ] Build completes successfully
- [ ] APK installs without errors
- [ ] All features work correctly
- [ ] User instructions are prepared

---

## 🚀 Ready to Build?

Run these commands in the PcoSense folder:

```bash
# Install EAS CLI (if not already installed)
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS (first time only)
eas build:configure

# Build APK for distribution
eas build --platform android --profile preview
```

Your download link will be ready in about 10-20 minutes! 🎉


