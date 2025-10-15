import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import StepCounter from '../components/StepCounter';
import WaterTracker from '../components/WaterTracker';
import MoodTracker from '../components/MoodTracker';
import AnimatedCharacter from '../components/AnimatedCharacter';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [cycleData, setCycleData] = useState({
    currentDay: 1,
    cycleLength: 28,
    lastPeriod: null,
    nextPeriod: null,
    phase: 'Menstrual',
  });
  const [todayStats, setTodayStats] = useState({
    steps: 8542,
    water: 6,
    calories: 1850,
    mood: 'happy',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (auth.currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          
          // Calculate cycle data
          calculateCycleData(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  };

  const calculateCycleData = (userData) => {
    const today = new Date();
    const lastPeriod = userData.lastPeriod ? userData.lastPeriod.toDate() : null;
    const cycleLength = userData.cycleLength || 28;
    
    let currentDay = 1;
    let phase = 'Menstrual';
    let nextPeriod = null;

    if (lastPeriod) {
      const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
      currentDay = (daysSinceLastPeriod % cycleLength) + 1;
      
      // Determine phase
      if (currentDay <= 5) {
        phase = 'Menstrual';
      } else if (currentDay <= 13) {
        phase = 'Follicular';
      } else if (currentDay <= 16) {
        phase = 'Ovulation';
      } else {
        phase = 'Luteal';
      }

      // Calculate next period
      const nextPeriodDate = new Date(lastPeriod);
      nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
      nextPeriod = nextPeriodDate;
    }

    setCycleData({
      currentDay,
      cycleLength,
      lastPeriod,
      nextPeriod,
      phase,
    });
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Menstrual': return '#E91E63';
      case 'Follicular': return '#9C27B0';
      case 'Ovulation': return '#FF9800';
      case 'Luteal': return '#4CAF50';
      default: return '#E91E63';
    }
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'Menstrual': return 'water';
      case 'Follicular': return 'leaf';
      case 'Ovulation': return 'sunny';
      case 'Luteal': return 'flower';
      default: return 'water';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <View style={styles.greetingText}>
            <Text style={styles.greeting}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, 
              {user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 🌸
            </Text>
            <Text style={styles.subGreeting}>
              Ready to take care of your health today?
            </Text>
          </View>
          <AnimatedCharacter
            type="walking"
            size={60}
            color="#E91E63"
            showText={false}
          />
        </View>
      </View>

      {/* Cycle Tracker Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>Cycle Tracker</Text>
        </View>
        
        <View style={styles.cycleInfo}>
          <View style={styles.phaseContainer}>
            <View style={[styles.phaseIndicator, { backgroundColor: getPhaseColor(cycleData.phase) }]}>
              <Ionicons name={getPhaseIcon(cycleData.phase)} size={20} color="white" />
            </View>
            <View style={styles.phaseText}>
              <Text style={styles.phaseName}>{cycleData.phase} Phase</Text>
              <Text style={styles.dayText}>Day {cycleData.currentDay} of {cycleData.cycleLength}</Text>
            </View>
          </View>
          
          {cycleData.nextPeriod && (
            <View style={styles.nextPeriod}>
              <Text style={styles.nextPeriodText}>
                Next period in {Math.ceil((cycleData.nextPeriod - new Date()) / (1000 * 60 * 60 * 24))} days
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Step Counter */}
      <StepCounter 
        currentSteps={todayStats.steps}
        goalSteps={10000}
        onPress={() => console.log('Step counter pressed')}
      />

      {/* Water Tracker */}
      <WaterTracker 
        currentGlasses={todayStats.water}
        goalGlasses={8}
        onAddGlass={() => setTodayStats(prev => ({ ...prev, water: prev.water + 1 }))}
      />

      {/* Mood Tracker */}
      <MoodTracker 
        currentMood={todayStats.mood}
        onMoodChange={(mood) => setTodayStats(prev => ({ ...prev, mood }))}
      />

      {/* Calories Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flame" size={24} color="#FF9800" />
          <Text style={styles.cardTitle}>Calories Burned</Text>
        </View>
        
        <View style={styles.caloriesContainer}>
          <AnimatedCharacter
            type="celebrating"
            size={60}
            color="#FF9800"
            showText={false}
          />
          <View style={styles.caloriesInfo}>
            <Text style={styles.caloriesValue}>{todayStats.calories}</Text>
            <Text style={styles.caloriesLabel}>calories today</Text>
            <Text style={styles.caloriesGoal}>Goal: 2000 calories</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flash" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={24} color="#E91E63" />
            <Text style={styles.actionText}>Log Period</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="fitness" size={24} color="#E91E63" />
            <Text style={styles.actionText}>Start Yoga</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="restaurant" size={24} color="#E91E63" />
            <Text style={styles.actionText}>Log Meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble" size={24} color="#E91E63" />
            <Text style={styles.actionText}>Ask AI</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Medication Reminders */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="medical" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>Medication Reminders</Text>
        </View>
        
        <View style={styles.reminderItem}>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderName}>Metformin</Text>
            <Text style={styles.reminderTime}>8:00 AM</Text>
          </View>
          <TouchableOpacity style={styles.reminderButton}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  cycleInfo: {
    alignItems: 'center',
  },
  phaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  phaseText: {
    alignItems: 'center',
  },
  phaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  nextPeriod: {
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextPeriodText: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  moodEmoji: {
    fontSize: 32,
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 80) / 2,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFF5F8',
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
    marginTop: 8,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reminderTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  reminderButton: {
    padding: 8,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  caloriesInfo: {
    flex: 1,
    marginLeft: 16,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 4,
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  caloriesGoal: {
    fontSize: 14,
    color: '#999',
  },
});

