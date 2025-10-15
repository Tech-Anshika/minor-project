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
import ModernGradientBackground from '../components/ModernGradientBackground';
import ModernCard from '../components/ModernCard';
import FloatingActionButton from '../components/FloatingActionButton';
import ModernProgressRing from '../components/ModernProgressRing';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
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
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser(userSnap.data());
        const userData = userSnap.data();
        if (userData.lastPeriodDate) {
          const lastPeriod = new Date(userData.lastPeriodDate.toDate());
          const today = new Date();
          const diffTime = Math.abs(today - lastPeriod);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const currentCycleLength = userData.cycleLength || 28;
          const nextPeriodDate = new Date(lastPeriod);
          nextPeriodDate.setDate(lastPeriod.getDate() + currentCycleLength);

          let currentPhase = 'Follicular';
          if (diffDays >= 0 && diffDays < 5) currentPhase = 'Menstrual';
          else if (diffDays >= 5 && diffDays < 13) currentPhase = 'Follicular';
          else if (diffDays >= 13 && diffDays < 16) currentPhase = 'Ovulation';
          else if (diffDays >= 16 && diffDays < currentCycleLength) currentPhase = 'Luteal';

          setCycleData({
            currentDay: diffDays + 1,
            cycleLength: currentCycleLength,
            lastPeriod: lastPeriod,
            nextPeriod: nextPeriodDate,
            phase: currentPhase,
          });
        }
      }
    }
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
    <ModernGradientBackground type="home">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},
              {user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 🌸
            </Text>
            <Text style={styles.subGreeting}>
              Ready to take care of your health today?
            </Text>
          </View>
          <View style={styles.characterContainer}>
            <AnimatedCharacter
              type="walking"
              size={70}
              color="white"
              showText={false}
            />
          </View>
        </View>

        {/* Cycle Tracker Card */}
        <ModernCard type="period" style={styles.cycleCard}>
          <View style={styles.cycleHeader}>
            <View style={styles.cycleTitleContainer}>
              <Ionicons name="calendar" size={24} color="white" />
              <Text style={styles.cycleTitle}>Cycle Tracker</Text>
            </View>
            <ModernProgressRing
              progress={(cycleData.currentDay / cycleData.cycleLength) * 100}
              size={80}
              color="white"
              backgroundColor="rgba(255,255,255,0.3)"
              centerText={`Day ${cycleData.currentDay}`}
            />
          </View>
          
          <View style={styles.cycleInfo}>
            <View style={styles.phaseContainer}>
              <View style={[styles.phaseIndicator, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name={getPhaseIcon(cycleData.phase)} size={20} color="white" />
              </View>
              <View style={styles.phaseTextContainer}>
                <Text style={styles.phaseName}>{cycleData.phase} Phase</Text>
                <Text style={styles.phaseDay}>Day {cycleData.currentDay} of {cycleData.cycleLength}</Text>
              </View>
            </View>
            
            {cycleData.nextPeriod && (
              <View style={styles.nextPeriodContainer}>
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.nextPeriodText}>
                  Next period in {Math.ceil((cycleData.nextPeriod - new Date()) / (1000 * 60 * 60 * 24))} days
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cycleActions}>
            <TouchableOpacity style={styles.cycleActionButton} onPress={() => navigation.navigate('PeriodLog')}>
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.cycleActionText}>Log Period</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cycleActionButton} onPress={() => navigation.navigate('PeriodLog')}>
              <Ionicons name="medical" size={20} color="white" />
              <Text style={styles.cycleActionText}>Add Symptoms</Text>
            </TouchableOpacity>
          </View>
        </ModernCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StepCounter 
              steps={todayStats.steps} 
              goal={10000} 
              size={100}
              style={styles.statCard}
            />
            <WaterTracker 
              glasses={todayStats.water} 
              goal={8} 
              size={100}
              style={styles.statCard}
            />
          </View>
          
          <View style={styles.statsRow}>
            <ModernCard type="warning" style={styles.calorieCard}>
              <View style={styles.calorieContent}>
                <View style={styles.calorieIcon}>
                  <Ionicons name="flame" size={32} color="#fa709a" />
                </View>
                <View style={styles.calorieInfo}>
                  <Text style={styles.calorieValue}>{todayStats.calories}</Text>
                  <Text style={styles.calorieLabel}>Calories</Text>
                  <ModernProgressRing
                    progress={(todayStats.calories / 2000) * 100}
                    size={50}
                    color="#fa709a"
                    backgroundColor="#E0E0E0"
                    showPercentage={false}
                  />
                </View>
              </View>
            </ModernCard>

            <MoodTracker 
              mood={todayStats.mood} 
              size={100}
              style={styles.statCard}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <ModernCard type="glass" style={styles.quickActionsCard}>
          <View style={styles.quickActionsHeader}>
            <Ionicons name="flash" size={24} color="#667eea" />
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('PeriodLog')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#ff9a9e' }]}>
                <Ionicons name="add-circle" size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Log Period</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Yoga')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#a8edea' }]}>
                <Ionicons name="fitness" size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Start Yoga</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Food')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#ffecd2' }]}>
                <Ionicons name="restaurant" size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Log Meal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chatbot')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#d299c2' }]}>
                <Ionicons name="chatbubble" size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Ask AI</Text>
            </TouchableOpacity>
          </View>
        </ModernCard>

        {/* Medication Reminders */}
        <ModernCard type="info" style={styles.medicationCard}>
          <View style={styles.medicationHeader}>
            <Ionicons name="medical" size={24} color="white" />
            <Text style={styles.medicationTitle}>Medication Reminders</Text>
          </View>

          <View style={styles.medicationItem}>
            <View style={styles.medicationIcon}>
              <Ionicons name="medical" size={20} color="#a8edea" />
            </View>
            <View style={styles.medicationInfo}>
              <Text style={styles.medicationName}>Metformin</Text>
              <Text style={styles.medicationTime}>8:00 AM</Text>
            </View>
            <TouchableOpacity style={styles.medicationButton}>
              <Ionicons name="checkmark-circle" size={24} color="#4facfe" />
            </TouchableOpacity>
          </View>
        </ModernCard>

        {/* Floating Action Button */}
        <FloatingActionButton
          onPress={() => navigation.navigate('PeriodLog')}
          icon="add"
          color="primary"
          position="bottom-right"
        />
      </ScrollView>
    </ModernGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  // Header Section
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  characterContainer: {
    marginLeft: 16,
  },

  // Cycle Card
  cycleCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cycleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cycleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cycleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  cycleInfo: {
    marginBottom: 16,
  },
  phaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseTextContainer: {
    flex: 1,
  },
  phaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  phaseDay: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  nextPeriodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  nextPeriodText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
  },
  cycleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cycleActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cycleActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },

  // Stats Grid
  statsGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  calorieCard: {
    flex: 1,
  },
  calorieContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  calorieIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(250, 112, 154, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  calorieInfo: {
    flex: 1,
    alignItems: 'center',
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fa709a',
    marginBottom: 4,
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },

  // Quick Actions
  quickActionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginLeft: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 80) / 2,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    textAlign: 'center',
  },

  // Medication
  medicationCard: {
    marginHorizontal: 20,
    marginBottom: 100, // Space for floating button
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  medicationTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  medicationButton: {
    marginLeft: 'auto',
  },
});