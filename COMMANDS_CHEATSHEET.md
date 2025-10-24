# 🎯 Build Commands Cheat Sheet

## 🚀 First Time Setup (Do Once)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo (create free account at expo.dev)
eas login

# Navigate to app folder
cd PcoSense

# Configure EAS
eas build:configure
```

---

## 📱 Build APK (Direct Download)

```bash
# Build APK for sharing/testing
eas build --platform android --profile preview
```

**Output**: Download link like `https://expo.dev/artifacts/eas/xxxxx.apk`

**Time**: 10-20 minutes

**Use for**: Sharing with friends, beta testing

---

## 🏪 Build for Google Play Store

```bash
# Build AAB for Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

**Output**: AAB file for Google Play

**Time**: 10-20 minutes + 1-7 days approval

**Use for**: Official public release

---

## 🔄 Update App (New Version)

1. **Update version in `PcoSense/app.json`:**
```json
"version": "1.0.1",      // Increment: 1.0.0 → 1.0.1
"versionCode": 2         // Increment: 1 → 2
```

2. **Build again:**
```bash
eas build --platform android --profile preview
```

---

## 🔍 Check Build Status

```bash
# List all builds
eas build:list

# View specific build
eas build:view [build-id]
```

---

## 📊 Other Useful Commands

```bash
# Cancel a build
eas build:cancel

# Configure project
eas build:configure

# View project info
eas project:info

# Logout
eas logout

# Update EAS CLI
npm install -g eas-cli@latest
```

---

## 🎯 One-Line Build Command

```bash
# Everything in one command (first time)
npm install -g eas-cli && eas login && cd PcoSense && eas build:configure && eas build -p android --profile preview
```

```bash
# Quick build (after setup)
cd PcoSense && eas build -p android --profile preview
```

---

## 📍 Build Profiles

| Profile | Command | Type | Use |
|---------|---------|------|-----|
| `preview` | `--profile preview` | APK | Testing |
| `production` | `--profile production` | AAB | Play Store |

---

## 🆘 Troubleshooting Commands

```bash
# Reinstall EAS CLI
npm uninstall -g eas-cli
npm install -g eas-cli

# Clear cache
npm cache clean --force

# Check EAS version
eas --version

# Login again
eas logout
eas login
```

---

## 📱 Device Testing

```bash
# After downloading APK to computer
# Copy to phone via USB or upload to Drive/GitHub

# Or test directly from link on phone:
# 1. Open link on Android phone
# 2. Download APK
# 3. Install
```

---

## 🎬 Complete Workflow

```bash
# 1. Make code changes
# 2. Test locally
npm start

# 3. Update version
# Edit app.json: version and versionCode

# 4. Build
cd PcoSense
eas build --platform android --profile preview

# 5. Wait for build (10-20 min)
# 6. Get download link
# 7. Test APK
# 8. Share with users
```

---

## 📚 Documentation Files

- `BUILD_SUMMARY.md` - Start here for overview
- `QUICK_START_BUILD.md` - Detailed quick start
- `ANDROID_DISTRIBUTION_GUIDE.md` - Complete guide
- `USER_INSTALL_INSTRUCTIONS.md` - For your users
- `COMMANDS_CHEATSHEET.md` - This file

---

## 🔗 Quick Links

- **EAS Dashboard**: https://expo.dev
- **Your Builds**: https://expo.dev/accounts/[account]/projects/pcosense/builds
- **EAS Docs**: https://docs.expo.dev/build/setup/
- **Google Play Console**: https://play.google.com/console

---

## ⚡ Quick Reference

**Build APK**:
```bash
cd PcoSense && eas build -p android --profile preview
```

**Build for Play Store**:
```bash
cd PcoSense && eas build -p android --profile production
```

**Submit to Play Store**:
```bash
cd PcoSense && eas submit -p android
```

---

**🎉 That's it! Copy and paste these commands as needed.**


