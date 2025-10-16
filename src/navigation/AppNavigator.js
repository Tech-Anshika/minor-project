import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content
function CustomDrawerContent({ navigation }) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>🌸 PcoSense</Text>
        <Text style={styles.drawerSubtitle}>Health & Wellness</Text>
      </View>
      
      <View style={styles.drawerMenu}>
        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigation.navigate('PeriodLog')}
        >
          <Ionicons name="calendar-outline" size={24} color="#E91E63" />
          <Text style={styles.drawerItemText}>Period Log</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Yoga')}
        >
          <Ionicons name="fitness-outline" size={24} color="#E91E63" />
          <Text style={styles.drawerItemText}>Yoga & Exercise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Food')}
        >
          <Ionicons name="restaurant-outline" size={24} color="#E91E63" />
          <Text style={styles.drawerItemText}>Food & Diet</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Progress')}
        >
          <Ionicons name="trending-up-outline" size={24} color="#E91E63" />
          <Text style={styles.drawerItemText}>Progress Tracking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#E91E63" />
          <Text style={styles.drawerItemText}>AI Assistant</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'menu' : 'menu-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E91E63',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFF5F8',
          borderTopColor: '#F8BBD9',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
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
        name="Menu" 
        component={MenuStack}
        options={{ 
          title: 'Menu',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack}
        options={{ 
          title: 'Settings',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

// Menu Stack - Contains all health-related features
function MenuStack() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF5F8',
        },
        headerTintColor: '#E91E63',
        drawerStyle: {
          backgroundColor: '#FFF5F8',
        },
        drawerActiveTintColor: '#E91E63',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen 
        name="PeriodLog" 
        component={PeriodLogScreen}
        options={{ 
          title: 'Period Log',
          drawerIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Yoga" 
        component={YogaScreen}
        options={{ 
          title: 'Yoga & Exercise',
          drawerIcon: ({ color }) => <Ionicons name="fitness-outline" size={24} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Food" 
        component={FoodScreen}
        options={{ 
          title: 'Food & Diet',
          drawerIcon: ({ color }) => <Ionicons name="restaurant-outline" size={24} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ 
          title: 'Progress Tracking',
          drawerIcon: ({ color }) => <Ionicons name="trending-up-outline" size={24} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Chatbot" 
        component={ChatbotScreen}
        options={{ 
          title: 'AI Assistant',
          drawerIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}

// Settings Stack - Contains app settings and preferences
function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF5F8',
        },
        headerTintColor: '#E91E63',
      }}
    >
      <Stack.Screen 
        name="SettingsMain" 
        component={ProfileScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator({ isAuthenticated }) {
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#E91E63',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#F8BBD9',
  },
  drawerMenu: {
    padding: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 15,
  },
});
