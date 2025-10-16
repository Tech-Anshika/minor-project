import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import YogaScreen from '../screens/YogaScreen';
import FoodScreen from '../screens/FoodScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PeriodLogScreen from '../screens/PeriodLogScreen';
import MoreScreen from '../screens/MoreScreen';
import HealthMainScreen from '../screens/HealthMainScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Health Stack - Contains all health-related features
function HealthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF5F8',
        },
        headerTintColor: '#E91E63',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HealthMain" 
        component={HealthMainScreen}
        options={{ title: 'Health & Wellness' }}
      />
      <Stack.Screen 
        name="PeriodLog" 
        component={PeriodLogScreen}
        options={{ title: 'Period Log' }}
      />
      <Stack.Screen 
        name="Yoga" 
        component={YogaScreen}
        options={{ title: 'Yoga & Exercise' }}
      />
      <Stack.Screen 
        name="Food" 
        component={FoodScreen}
        options={{ title: 'Food & Diet' }}
      />
      <Stack.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progress Tracking' }}
      />
      <Stack.Screen 
        name="Chatbot" 
        component={ChatbotScreen}
        options={{ title: 'AI Assistant' }}
      />
    </Stack.Navigator>
  );
}

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator - Only 4 essential items
function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Health') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E91E63',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFF5F8',
          borderTopColor: '#F8BBD9',
          height: 85 + insets.bottom,
          paddingBottom: 20 + insets.bottom,
          paddingTop: 10,
          paddingHorizontal: 8,
          marginBottom: 0,
        },
        headerStyle: {
          backgroundColor: '#FFF5F8',
        },
        headerTintColor: '#E91E63',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Health" 
        component={HealthStack}
        options={{ 
          title: 'Health',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreStack}
        options={{ 
          title: 'More',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

// More Stack - Contains additional features and settings
function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF5F8',
        },
        headerTintColor: '#E91E63',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MoreMain" 
        component={MoreScreen}
        options={{ title: 'More' }}
      />
    </Stack.Navigator>
  );
}

// Root Stack Navigator - Contains all screens
function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF5F8',
        },
        headerTintColor: '#E91E63',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PeriodLog" 
        component={PeriodLogScreen}
        options={{ title: 'Period Log' }}
      />
      <Stack.Screen 
        name="Yoga" 
        component={YogaScreen}
        options={{ title: 'Yoga & Exercise' }}
      />
      <Stack.Screen 
        name="Food" 
        component={FoodScreen}
        options={{ title: 'Food & Diet' }}
      />
      <Stack.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progress Tracking' }}
      />
      <Stack.Screen 
        name="Chatbot" 
        component={ChatbotScreen}
        options={{ title: 'AI Assistant' }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator({ isAuthenticated }) {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? <RootStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
