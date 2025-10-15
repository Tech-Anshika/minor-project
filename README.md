# 🌸 PcoSense - Personal Health Companion for PCOD/PCOS

A comprehensive React Native app designed to help women manage PCOD/PCOS symptoms through AI-powered insights, cycle tracking, personalized diet plans, yoga routines, and progress monitoring.

## ✨ Features

### 🔐 Authentication
- Email/Password registration and login
- Google Sign-In integration
- Secure user profile management

### 🏠 Home Dashboard
- Menstrual cycle tracker with phase indicators
- Daily health overview (steps, water intake, calories, mood)
- Quick action buttons for logging activities
- Medication reminders

### 🤖 AI Health Assistant
- Gemini AI-powered chatbot
- Personalized health advice based on cycle phase
- Symptom management recommendations
- Progress analysis and insights

### 🧘‍♀️ Yoga & Exercise
- Phase-specific yoga poses and exercises
- AI-suggested routines based on symptoms
- Detailed pose instructions and benefits
- Progress tracking

### 🍎 Food & Diet
- Cycle-phase based meal recommendations
- PCOD-friendly recipe suggestions
- Nutritional information and benefits
- Meal planning integration

### 📈 Progress Tracking
- Daily goal tracking (yoga, diet, medication, steps, water)
- Weekly and monthly statistics
- Achievement system
- Streak tracking

### 👩‍⚕️ Profile Management
- Personal health information
- Symptom tracking
- BMI calculation
- Notification preferences
- AI-generated health insights

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

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase account
- Google Gemini API key

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
   - Create a new Firebase project
   - Enable Authentication (Email/Password, Google)
   - Enable Firestore Database
   - Enable Storage
   - Enable Cloud Messaging
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place them in the appropriate directories

4. **Configure Firebase**
   - Update `src/config/firebaseConfig.js` with your Firebase configuration
   - Replace the placeholder values with your actual Firebase config

5. **Configure AI Service**
   - Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update `src/services/aiService.js` with your API key

6. **Run the app**
   ```bash
   # Start the development server
   npx expo start
   
   # Run on Android
   npx expo run:android
   
   # Run on iOS
   npx expo run:ios
   
   # Run on web
   npx expo start --web
   ```

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

### Android
1. Build the app: `npx expo build:android`
2. Upload to Google Play Store

### iOS
1. Build the app: `npx expo build:ios`
2. Upload to App Store

### Web
1. Build for web: `npx expo build:web`
2. Deploy to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Apple HealthKit integration
- [ ] Google Fit integration
- [ ] Advanced analytics dashboard
- [ ] Community features
- [ ] Healthcare provider integration
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Dark mode theme

## 🙏 Acknowledgments

- React Native community
- Firebase team
- Google AI team
- Open source contributors
- PCOD/PCOS health advocates

---

Made with ❤️ for women's health and wellness

