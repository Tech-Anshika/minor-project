# 🚀 Quick Start: Build Your Android App

## Step-by-Step Commands (Copy & Paste)

### 1️⃣ Install EAS CLI (One-time setup)
```bash
npm install -g eas-cli
```

### 2️⃣ Login to Expo
```bash
eas login
```
**Note**: Create a free account at [expo.dev](https://expo.dev) if you don't have one

### 3️⃣ Navigate to your app folder
```bash
cd PcoSense
```

### 4️⃣ Configure EAS (First-time only)
```bash
eas build:configure
```
Press **Enter** when asked questions (use defaults)

### 5️⃣ Build APK for Download
```bash
eas build --platform android --profile preview
```

**What happens:**
- ⏱️ Build takes 10-20 minutes
- 🔗 You'll get a download link like: `https://expo.dev/artifacts/eas/xxxxx.apk`
- 📱 Share this link with anyone to install on Android

---

## Alternative: Build for Google Play Store

```bash
cd PcoSense
eas build --platform android --profile production
```

This creates an **AAB file** for Google Play Store submission.

---

## 📤 After Build Completes

You'll see output like:
```
✔ Build successful!
📱 APK: https://expo.dev/artifacts/eas/abc123def456.apk
```

**What to do:**
1. ✅ Copy the APK link
2. 📱 Test it on your phone first
3. 🔗 Share the link with users
4. 💾 Save the APK file to Google Drive/GitHub for permanent storage

---

## 🔄 Update Your App (Future Builds)

When you make changes:

1. **Update version in `app.json`:**
```json
{
  "expo": {
    "version": "1.0.1",  // Change this
    "android": {
      "versionCode": 2   // Increment this
    }
  }
}
```

2. **Build again:**
```bash
cd PcoSense
eas build --platform android --profile preview
```

3. **Share new link with users**

---

## ❗ Common Issues

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "No project ID"
Run this first:
```bash
eas build:configure
```

### Build fails
Check the build logs on [expo.dev](https://expo.dev) dashboard

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `eas login` | Login to Expo |
| `eas build:configure` | Setup (first time) |
| `eas build -p android --profile preview` | Build APK |
| `eas build -p android --profile production` | Build AAB (Play Store) |
| `eas submit -p android` | Submit to Play Store |

---

## ✅ Build Checklist

Before running the build:
- [ ] In the `PcoSense` folder
- [ ] Logged into Expo (`eas login`)
- [ ] EAS configured (`eas.json` exists)
- [ ] Firebase config is correct
- [ ] Tested app with `expo start`

---

## 🎉 That's It!

Your command:
```bash
cd PcoSense && eas build --platform android --profile preview
```

Wait 10-20 minutes, get your download link, share it! 🚀


