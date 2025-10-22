# 🌸 PcoSense - Personal Health Companion for PCOD/PCOS

A comprehensive React Native app designed to help women manage PCOD/PCOS symptoms through AI-powered insights, cycle tracking, personalized diet plans, yoga routines, and progress monitoring.

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📚 Quick Navigation

- [START HERE](START_HERE.md) - **Start here if you're new!**
- [User Installation Guide](USER_INSTALL_INSTRUCTIONS.md) - For end users installing the app
- [Quick Start Build Guide](QUICK_START_BUILD.md) - Fast track for developers
- [Commands Cheatsheet](COMMANDS_CHEATSHEET.md) - Handy command reference
- [Firebase Setup Guide](FIREBASE_SETUP.md) - Detailed Firebase configuration
- [Android Distribution Guide](ANDROID_DISTRIBUTION_GUIDE.md) - Publishing to Play Store
- [Build Summary](BUILD_SUMMARY.md) - Build process overview
- [Changelog](CHANGELOG.md) - Version history and updates
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute

## 📱 Screenshots

> Coming soon - Add screenshots of your app here

## ✨ Features

### 🔐 Authentication
- Email/Password registration and login
- Google Sign-In integration
- Secure user profile management
- Password reset functionality

### 🏠 Home Dashboard
- Menstrual cycle tracker with phase indicators
- Daily health overview (steps, water intake, calories, mood)
- Quick action buttons for logging activities
- Medication reminders with notifications
- Beautiful gradient UI with smooth animations

### 🤖 AI Health Assistant
- **Bilingual AI Chatbot** (English/Hindi) with intelligent language switching
- **200+ PCOS-Specific Responses** covering symptoms, diet, exercise, fertility, mental health
- **100% Offline & Free** - Rule-based AI, no API keys required
- **Text-to-Speech Support** - Listen to responses in English/Hindi (Expo Speech)
- **Voice Input Modal** - Type your questions easily
- **Smart Keyword Matching** - Understands natural language queries
- **Quick Suggestions** - 4 randomized question chips for easy interaction
- **Context-Aware Greetings** - Time-based personalized welcomes
- **Encouraging Messages** - Motivational prompts every 5 messages
- **Firebase Chat History** - All conversations saved and synced
- **Comprehensive Knowledge Base** - PCOS basics, symptoms (irregular periods, weight gain, acne, hair loss, mood swings), diet plans, exercise routines, yoga poses, fertility tips, medication info, emergency guidelines

### 🧘‍♀️ Yoga & Exercise
- Phase-specific yoga poses and exercises
- AI-suggested routines based on symptoms
- Detailed pose instructions with images
- Video demonstrations for proper form
- Progress tracking with streak counters
- Movement detection (experimental)

### 🍎 Food & Diet
- Cycle-phase based meal recommendations
- PCOD-friendly recipe suggestions
- Nutritional information and calorie tracking
- Meal planning integration
- Food diary with search functionality

### 💊 Medicine Management
- Medication reminders with notifications
- Dosage tracking and history
- Refill reminders
- Medicine interaction warnings

### 📈 Progress Tracking
- Daily goal tracking (yoga, diet, medication, steps, water)
- Weekly and monthly statistics with charts
- Achievement system with badges
- Streak tracking and rewards
- Detailed analytics dashboard

### 👩‍⚕️ Profile Management
- Personal health information
- Comprehensive symptom tracking
- BMI calculation and tracking
- Notification preferences
- AI-generated health insights
- Export health data

## 🛠 Tech Stack

- **Frontend**: React Native (Expo)
- **Navigation**: React Navigation 6
- **Backend**: Firebase
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **AI**: Google Gemini API
- **Notifications**: Expo Notifications + Firebase Cloud Messaging
- **Charts**: React Native Chart Kit
- **UI Components**: React Native Paper

## 🚀 Getting Started

> **New to the project?** Check out [START_HERE.md](START_HERE.md) for a guided setup experience!

### System Requirements

#### For Development:
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Node.js**: v16.x or higher (v18.x recommended)
- **npm**: v8.x or higher (or yarn v1.22+)
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 10GB free space
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

#### For Running the App:
- **Android**: Android 5.0 (API 21) or higher
- **iOS**: iOS 13.0 or higher
- **Expo Go App** (for development testing)

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- Firebase account (free tier available)
- Google Gemini API key (free tier available)
- Android Studio / Xcode (optional, for native builds)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PcoSense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   
   > 📖 For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google)
   - Enable Firestore Database (start in test mode)
   - Enable Firebase Storage
   - Enable Cloud Messaging
   - Download configuration files:
     - `google-services.json` for Android → Place in `android/app/`
     - `GoogleService-Info.plist` for iOS → Place in `ios/`

4. **Configure Environment**
   
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your Firebase config and API keys
   ```
   
   Update `src/config/firebaseConfig.js` with your Firebase configuration values.

5. **Configure AI Service**
   
   - Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update the API key in `src/services/aiService.js`
   
   ```javascript
   const API_KEY = 'your-gemini-api-key-here';
   ```

6. **Install Expo CLI (if not already installed)**
   
   ```bash
   npm install -g expo-cli
   ```

7. **Run the app**
   
   > 📖 See [COMMANDS_CHEATSHEET.md](COMMANDS_CHEATSHEET.md) for all available commands
   
   ```bash
   # Start the development server
   npx expo start
   
   # Or run directly on platforms:
   
   # Run on Android (requires Android Studio)
   npx expo run:android
   
   # Run on iOS (requires Xcode, macOS only)
   npx expo run:ios
   
   # Run on web browser
   npx expo start --web
   
   # Use Expo Go app (scan QR code on your phone)
   npx expo start
   ```

### Quick Start for Testing

If you just want to test the app quickly without setting up Firebase:

```bash
npm install
npx expo start
```

The app will run in demo mode with limited functionality.

## 📱 App Structure

```
PcoSense/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── ChatbotScreen.js
│   │   ├── YogaScreen.js
│   │   ├── FoodScreen.js
│   │   ├── ProgressScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.js
│   ├── config/            # App configuration
│   │   └── firebaseConfig.js
│   ├── services/          # External services
│   │   ├── aiService.js
│   │   └── notificationService.js
│   ├── styles/            # Styling and theming
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── spacing.js
│   └── assets/            # Images, icons, etc.
├── App.js                 # Main app component
└── package.json
```

## 🔧 Configuration

### Firebase Configuration

1. Create a Firebase project
2. Enable the required services:
   - Authentication
   - Firestore Database
   - Storage
   - Cloud Messaging
3. Add your app to the Firebase project
4. Download the configuration files
5. Update `src/config/firebaseConfig.js`

### Gemini AI Configuration

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Update `src/services/aiService.js` with your API key

### Notification Setup

1. Configure Expo notifications in `app.json`
2. Set up Firebase Cloud Messaging
3. Update notification service with your project ID

## 📊 Database Schema

### Users Collection
```javascript
{
  name: string,
  email: string,
  age: number,
  weight: number,
  height: number,
  cycleLength: number,
  lastPeriod: timestamp,
  symptoms: array,
  goals: {
    dailySteps: number,
    waterIntake: number,
    yogaMinutes: number
  },
  expoPushToken: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Progress Collection
```javascript
{
  date: timestamp,
  goals: {
    yoga: boolean,
    diet: boolean,
    medication: boolean,
    steps: boolean,
    water: boolean
  },
  timestamp: timestamp
}
```

### Chats Collection
```javascript
{
  text: string,
  isUser: boolean,
  timestamp: timestamp
}
```

## 🎨 Design System

The app uses a consistent design system with:
- **Primary Color**: #E91E63 (Pink)
- **Secondary Color**: #9C27B0 (Purple)
- **Background**: #FFF5F8 (Light Pink)
- **Typography**: System fonts with consistent sizing
- **Spacing**: 4px base unit
- **Border Radius**: 8px, 12px, 16px, 20px

## 🔒 Privacy & Security

- All user data is encrypted in transit and at rest
- Firebase provides enterprise-grade security
- No sensitive health data is stored locally
- User consent required for all data collection
- GDPR compliant data handling

## 🚀 Deployment

> 📖 For detailed Android deployment instructions, see [ANDROID_DISTRIBUTION_GUIDE.md](ANDROID_DISTRIBUTION_GUIDE.md)

### Building for Production

#### Android (APK/AAB)

```bash
# Using EAS Build (recommended)
npm install -g eas-cli
eas login
eas build --platform android

# Or using local build
npx expo run:android --variant release
```

**Distribution Options:**
1. Google Play Store (recommended)
2. Direct APK download
3. Alternative app stores (Amazon, Samsung Galaxy Store)

See [ANDROID_DISTRIBUTION_GUIDE.md](ANDROID_DISTRIBUTION_GUIDE.md) for complete instructions.

#### iOS (IPA)

```bash
# Using EAS Build
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

**Requirements:**
- Apple Developer account ($99/year)
- macOS with Xcode installed

#### Web

```bash
# Build for web
npx expo export:web

# Output will be in web-build/ directory
# Deploy to hosting services:
# - Netlify
# - Vercel
# - Firebase Hosting
# - GitHub Pages
```

### Continuous Integration

The project includes configuration for:
- EAS Build (Expo Application Services)
- GitHub Actions (optional)
- Automated testing pipelines

## 🐛 Troubleshooting

### Common Issues

#### 1. **Metro Bundler Issues**

```bash
# Clear cache and restart
npx expo start -c
# or
watchman watch-del-all
rm -rf node_modules
npm install
```

#### 2. **Firebase Configuration Errors**

- Verify `google-services.json` is in `android/app/`
- Check that all Firebase services are enabled in console
- Ensure API keys are correctly set in `firebaseConfig.js`
- See [FIREBASE_FIX.md](FIREBASE_FIX.md) for common Firebase issues

#### 3. **Android Build Failures**

```bash
# Clean build
cd android
./gradlew clean
cd ..
npx expo run:android
```

#### 4. **Dependency Conflicts**

```bash
# Reset and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 5. **Expo Go Connection Issues**

- Ensure phone and computer are on the same network
- Try using tunnel mode: `npx expo start --tunnel`
- Disable firewalls temporarily

#### 6. **iOS Pod Installation Issues** (macOS only)

```bash
cd ios
pod install
cd ..
```

### Getting Help

1. Check [existing issues](../../issues) on GitHub
2. Review documentation files in the project
3. Search [Expo Forums](https://forums.expo.dev/)
4. Check [React Native documentation](https://reactnative.dev/docs/getting-started)

### Reporting Issues

When reporting issues, please include:
- Operating system and version
- Node.js and npm versions
- Error messages and stack traces
- Steps to reproduce
- Screenshots if applicable

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

**Quick Steps:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Contribution Ideas:**
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🌐 Translations
- ♿ Accessibility improvements
- 🧪 Test coverage

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

Need help? We're here for you!

**Documentation:**
- 📖 [START_HERE.md](START_HERE.md) - Beginner's guide
- 🔥 [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase configuration
- 📱 [ANDROID_DISTRIBUTION_GUIDE.md](ANDROID_DISTRIBUTION_GUIDE.md) - Publishing guide
- 💻 [COMMANDS_CHEATSHEET.md](COMMANDS_CHEATSHEET.md) - Command reference

**Get Help:**
- 🐛 [Report an issue](https://github.com/Tech-Anshika/minor-project/issues)
- 💬 Join discussions in the repository
- 📧 Contact the development team
- 📚 Check [Expo documentation](https://docs.expo.dev/)
- 🔍 Search [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

## ⚡ Performance Optimization

The app is optimized for performance with:
- Lazy loading of screens and components
- Image optimization and caching
- Efficient state management
- Minimized re-renders
- Debounced API calls
- Optimized Firebase queries
- Background task handling

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

**Testing Strategy:**
- Unit tests for utilities and services
- Component testing with React Native Testing Library
- E2E testing with Detox (planned)
- Manual testing checklist available

## 🔮 Roadmap & Future Enhancements

### Phase 1 (Current)
- [x] Core features implementation
- [x] Firebase integration
- [x] AI chatbot with Gemini
- [x] Period tracking
- [x] Progress monitoring

### Phase 2 (Planned)
- [ ] Apple HealthKit integration
- [ ] Google Fit integration
- [ ] Advanced analytics dashboard
- [ ] Community features and forums
- [ ] Healthcare provider portal
- [ ] Export health reports (PDF)

### Phase 3 (Future)
- [ ] Telemedicine integration
- [ ] Wearable device support
- [ ] Multi-language support (Hindi, Spanish, etc.)
- [ ] Dark mode theme
- [ ] Voice assistant integration
- [ ] Social sharing features
- [ ] Gamification elements
- [ ] In-app purchases for premium features

### Research & Innovation
- [ ] ML-based symptom prediction
- [ ] Computer vision for food tracking
- [ ] Personalized treatment recommendations
- [ ] Clinical trial integration

## 👥 Team & Contributors

**Project Lead:** [Tech-Anshika](https://github.com/Tech-Anshika)

This project is maintained and developed as part of a minor project initiative to create accessible healthcare solutions for women.

### Contributors

We appreciate all contributors who help improve PcoSense! 🌟

[![Contributors](https://img.shields.io/github/contributors/Tech-Anshika/minor-project)](https://github.com/Tech-Anshika/minor-project/graphs/contributors)

Want to contribute? Check out our [Contributing Guidelines](CONTRIBUTING.md)!

## 🙏 Acknowledgments

- **React Native Community** - For the amazing framework and ecosystem
- **Expo Team** - For simplifying React Native development
- **Firebase Team** - For providing robust backend services
- **Google AI Team** - For the Gemini API powering our AI assistant
- **Open Source Contributors** - For the libraries that make this app possible
- **PCOD/PCOS Health Advocates** - For raising awareness and providing valuable insights
- **Healthcare Professionals** - For guidance on medical best practices
- **Beta Testers** - For valuable feedback and testing

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/Tech-Anshika/minor-project)
![GitHub code size](https://img.shields.io/github/languages/code-size/Tech-Anshika/minor-project)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Tech-Anshika/minor-project)
![GitHub last commit](https://img.shields.io/github/last-commit/Tech-Anshika/minor-project)

## 📞 Contact

- **GitHub**: [@Tech-Anshika](https://github.com/Tech-Anshika)
- **Repository**: [minor-project](https://github.com/Tech-Anshika/minor-project)
- **Issues**: [Report Bug](https://github.com/Tech-Anshika/minor-project/issues)
- **Pull Requests**: [Submit PR](https://github.com/Tech-Anshika/minor-project/pulls)

## ⭐ Star History

If you find this project helpful, please consider giving it a star ⭐ on [GitHub](https://github.com/Tech-Anshika/minor-project)!

---

<div align="center">

**Made with ❤️ for women's health and wellness**

🌸 **PcoSense** - Empowering women to take control of their PCOD/PCOS journey 🌸

[Report Bug](https://github.com/Tech-Anshika/minor-project/issues) · [Request Feature](https://github.com/Tech-Anshika/minor-project/issues) · [Documentation](https://github.com/Tech-Anshika/minor-project#readme)

</div>


