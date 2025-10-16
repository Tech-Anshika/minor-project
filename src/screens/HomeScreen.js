import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import MedicineWidget from '../components/MedicineWidget';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    steps: 0,
    water: 6,
    calories: 0,
    mood: 'happy',
  });
  const [stepCounterAvailable, setStepCounterAvailable] = useState(false);
  const [isLoadingSteps, setIsLoadingSteps] = useState(true);
  const [stepUpdateInterval, setStepUpdateInterval] = useState(null);
  const [resetCheckInterval, setResetCheckInterval] = useState(null);

  useEffect(() => {
    loadUserData();
    initializeStepCounter();
    
    // Start daily reset check (every minute)
    const resetInterval = setInterval(checkDailyReset, 60000);
    setResetCheckInterval(resetInterval);
    
    // Cleanup function
    return () => {
      if (stepUpdateInterval) {
        clearInterval(stepUpdateInterval);
      }
      if (resetCheckInterval) {
        clearInterval(resetCheckInterval);
      }
    };
  }, []);

  const initializeStepCounter = async () => {
    try {
      setIsLoadingSteps(true);
      console.log('Initializing step counter in HomeScreen...');
      
      // Load saved data first
      const savedData = await loadStepData();
      const initialSteps = savedData.steps || 0;
      const initialCalories = calculateCalories(initialSteps);
      
      console.log('Initial steps:', initialSteps, 'Initial calories:', initialCalories);
      
      setTodayStats(prev => ({
        ...prev,
        steps: initialSteps,
        calories: initialCalories
      }));

      setStepCounterAvailable(true);
      
      // Start step simulation
      startStepSimulation();
      
    } catch (error) {
      console.error('Error initializing step counter:', error);
      // Fallback to mock data
      setTodayStats(prev => ({
        ...prev,
        steps: 8542,
        calories: 1850
      }));
      setStepCounterAvailable(true);
    } finally {
      setIsLoadingSteps(false);
    }
  };

  const loadStepData = async () => {
    try {
      const today = new Date().toDateString();
      const savedData = await AsyncStorage.getItem('stepCounterData');
      
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.date === today) {
          // Same day - return saved steps
          console.log('Loading saved steps for today:', data.steps);
          return { steps: data.steps || 0 };
        } else {
          // New day - reset steps to 0
          console.log('New day detected, resetting steps to 0');
          await saveStepData(0);
          return { steps: 0 };
        }
      }
      
      // No saved data - start fresh for today
      console.log('No saved data, starting fresh for today');
      await saveStepData(0);
      return { steps: 0 };
    } catch (error) {
      console.error('Error loading step data:', error);
      return { steps: 0 };
    }
  };

  const saveStepData = async (steps) => {
    try {
      const today = new Date().toDateString();
      const data = {
        date: today,
        steps: steps,
        lastUpdate: new Date().toISOString()
      };
      await AsyncStorage.setItem('stepCounterData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving step data:', error);
    }
  };

  const calculateCalories = (steps) => {
    // Simple calorie calculation: ~0.04 calories per step
    return Math.round(steps * 0.04);
  };

  const getMotivationalMessage = (steps) => {
    const progress = (steps / 10000) * 100;
    
    if (progress < 25) {
      return "Let's start moving! Every step counts! 🚶‍♀️";
    } else if (progress < 50) {
      return "Great start! Keep up the momentum! 💪";
    } else if (progress < 75) {
      return "You're halfway there! Keep going! 🌟";
    } else if (progress < 100) {
      return "Almost at your goal! You're doing amazing! 🎯";
    } else {
      return "Goal achieved! You're a step champion! 🏆";
    }
  };

  const startStepSimulation = () => {
    console.log('Starting step simulation...');
    
    const interval = setInterval(() => {
      setTodayStats(prev => {
        const newSteps = prev.steps + Math.floor(Math.random() * 7) + 2;
        const newCalories = calculateCalories(newSteps);
        
        console.log('Steps updated:', newSteps, 'Calories:', newCalories);
        
        // Save data
        saveStepData(newSteps);
        
        return {
          ...prev,
          steps: newSteps,
          calories: newCalories
        };
      });
    }, 15000); // Update every 15 seconds
    
    setStepUpdateInterval(interval);
  };

  // Check for daily reset (runs every minute)
  const checkDailyReset = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if it's past midnight (00:00) and we haven't reset today
    if (currentHour === 0 && currentMinute < 5) { // Within first 5 minutes of midnight
      const today = new Date().toDateString();
      const lastReset = AsyncStorage.getItem('lastDailyReset');
      
      lastReset.then(lastResetDate => {
        if (lastResetDate !== today) {
          console.log('Daily reset triggered at midnight');
          resetDailySteps();
          AsyncStorage.setItem('lastDailyReset', today);
        }
      });
    }
  };

  // Reset daily steps and calories
  const resetDailySteps = async () => {
    console.log('Resetting daily steps and calories...');
    setTodayStats(prev => ({
      ...prev,
      steps: 0,
      calories: 0
    }));
    await saveStepData(0);
  };

  // Test function to add steps manually
  const addTestSteps = () => {
    setTodayStats(prev => {
      const newSteps = prev.steps + 100;
      const newCalories = calculateCalories(newSteps);
      saveStepData(newSteps);
      return {
        ...prev,
        steps: newSteps,
        calories: newCalories
      };
    });
  };

  // Manual reset function for testing
  const manualReset = async () => {
    await resetDailySteps();
    console.log('Manual reset completed');
  };

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
    <SafeAreaView style={styles.safeArea}>
      <ModernGradientBackground type="home">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View style={styles.appTitleContainer}>
              <Text style={styles.appTitle}>PcoSense</Text>
              <View style={styles.titleBadge}>
                <Text style={styles.badgeText}>Health Companion</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => navigation.navigate('Health')}
              >
                <Ionicons name="heart" size={24} color="#E91E63" />
              </TouchableOpacity>
              <View style={styles.statusContainer}>
                <View style={styles.statusIndicator}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </View>
          </View>
          
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
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👩‍⚕️</Text>
            </View>
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

        {/* Stats Section - Single Column */}
        <View style={styles.statsSection}>
          {/* Steps Card with Walking Girl */}
          <ModernCard type="success" style={styles.fullWidthCard}>
            <View style={styles.stepsContent}>
              <View style={styles.stepsHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="walk" size={28} color="white" />
                </View>
                <Text style={styles.stepsTitle}>Daily Steps</Text>
              </View>
              <View style={styles.stepsMain}>
                <View style={styles.stepsInfo}>
                  {isLoadingSteps ? (
                    <Text style={styles.stepsValue}>Loading...</Text>
                  ) : (
                    <Text style={styles.stepsValue}>{todayStats.steps.toLocaleString()}</Text>
                  )}
                  <Text style={styles.stepsLabel}>steps</Text>
                  <Text style={styles.stepsMotivation}>
                    {getMotivationalMessage(todayStats.steps)}
                  </Text>
                  <Text style={styles.dailyResetText}>
                    Daily reset at 12:00 AM • {new Date().toLocaleDateString()}
                  </Text>
                  {/* Test buttons for debugging */}
                  <View style={styles.testButtonsContainer}>
                    <TouchableOpacity 
                      style={styles.testButton} 
                      onPress={addTestSteps}
                    >
                      <Text style={styles.testButtonText}>+100 Steps</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.testButton, styles.resetButton]} 
                      onPress={manualReset}
                    >
                      <Text style={styles.testButtonText}>Reset Daily</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.stepsCharacter}>
                  <View style={styles.characterContainer}>
                    <Text style={styles.characterEmoji}>🚶‍♀️</Text>
                    <View style={styles.stepTrail}>
                      <Text style={styles.stepEmoji}>👣</Text>
                      <Text style={styles.stepEmoji}>👣</Text>
                      <Text style={styles.stepEmoji}>👣</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.stepsProgress}>
                <ModernProgressRing
                  progress={(todayStats.steps / 10000) * 100}
                  size={100}
                  color="#1e3a8a"
                  backgroundColor="#E5E7EB"
                  showPercentage={true}
                />
              </View>
            </View>
          </ModernCard>
          
          {/* Water Card with Drinking Girl */}
          <ModernCard type="info" style={styles.fullWidthCard}>
            <View style={styles.waterContent}>
              <View style={styles.waterHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#0d9488' }]}>
                  <Ionicons name="water" size={28} color="white" />
                </View>
                <Text style={styles.waterTitle}>Water Intake</Text>
              </View>
              <View style={styles.waterMain}>
                <View style={styles.waterInfo}>
                  <Text style={styles.waterValue}>{todayStats.water}/8</Text>
                  <Text style={styles.waterLabel}>glasses</Text>
                  <Text style={styles.waterMotivation}>Stay hydrated! 💧</Text>
                </View>
                <View style={styles.waterCharacter}>
                  <View style={styles.characterContainer}>
                    <Text style={styles.characterEmoji}>💧</Text>
                    <View style={styles.waterDrops}>
                      <Text style={styles.waterDropEmoji}>💧</Text>
                      <Text style={styles.waterDropEmoji}>💧</Text>
                      <Text style={styles.waterDropEmoji}>💧</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.waterControls}>
                <TouchableOpacity style={styles.waterButton} onPress={() => setTodayStats(prev => ({ ...prev, water: Math.max(0, prev.water - 1) }))}>
                  <Ionicons name="remove" size={24} color="#ff6b6b" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.waterButton} onPress={() => setTodayStats(prev => ({ ...prev, water: Math.min(8, prev.water + 1) }))}>
                  <Ionicons name="add" size={24} color="#4caf50" />
                </TouchableOpacity>
              </View>
              <View style={styles.waterProgress}>
                <ModernProgressRing
                  progress={(todayStats.water / 8) * 100}
                  size={80}
                  color="#0f766e"
                  backgroundColor="#E5E7EB"
                  showPercentage={true}
                />
              </View>
            </View>
          </ModernCard>
          
          {/* Calories Card - Maximum Space */}
          <ModernCard type="warning" style={styles.calorieCardMax}>
            <View style={styles.calorieContentMax}>
              <View style={styles.calorieHeaderMax}>
                <View style={[styles.iconContainer, { backgroundColor: '#be185d', width: 50, height: 50 }]}>
                  <Ionicons name="flame" size={32} color="white" />
                </View>
                <Text style={styles.calorieTitleMax}>Calories Burned Today</Text>
              </View>
              <View style={styles.calorieMainMax}>
                {isLoadingSteps ? (
                  <Text style={styles.calorieValueMax}>Loading...</Text>
                ) : (
                  <Text style={styles.calorieValueMax}>{todayStats.calories}</Text>
                )}
                <Text style={styles.calorieUnitMax}>calories</Text>
                <Text style={styles.calorieGoalMax}>
                  {stepCounterAvailable 
                    ? "Based on your steps today" 
                    : "Goal: 2000 calories"
                  }
                </Text>
              </View>
              <View style={styles.calorieProgressMax}>
                <ModernProgressRing
                  progress={(todayStats.calories / 2000) * 100}
                  size={120}
                  color="#9d174d"
                  backgroundColor="#E5E7EB"
                  showPercentage={true}
                />
              </View>
              <View style={styles.calorieMotivation}>
                <Text style={styles.calorieMotivationText}>Keep burning those calories! 🔥</Text>
              </View>
            </View>
          </ModernCard>

          {/* Mood Card */}
          <MoodTracker 
            mood={todayStats.mood} 
            size={140}
            style={styles.fullWidthCard}
          />
        </View>

        {/* Quick Actions */}
        <ModernCard type="glass" style={styles.quickActionsCard}>
          <View style={styles.quickActionsHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#4338ca' }]}>
              <Ionicons name="flash" size={24} color="white" />
            </View>
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
                <Ionicons name="heart" size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Log Mood</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Food')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#ffecd2' }]}>
                <Ionicons name="close" size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Log Meal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('Chatbot')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#d299c2' }]}>
                <Ionicons name="chatbubble" size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Talk to AI</Text>
            </TouchableOpacity>
          </View>
        </ModernCard>

        {/* Medicine Tracker Widget */}
        <MedicineWidget navigation={navigation} />

        {/* Floating Action Button */}
        <FloatingActionButton
          onPress={() => navigation.navigate('PeriodLog')}
          icon="add"
          color="primary"
          position="bottom-right"
        />
      </ScrollView>
    </ModernGradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  
  // Header Section
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  appTitleContainer: {
    flex: 1,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  greetingContainer: {
    marginBottom: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  characterContainer: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 40,
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

  // Stats Section - Single Column
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  fullWidthCard: {
    marginBottom: 16,
  },
  
  // Icon Container
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4facfe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Steps Card Styles
  stepsContent: {
    padding: 20,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginLeft: 12,
  },
  stepsMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepsInfo: {
    flex: 1,
  },
  stepsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  stepsLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  stepsMotivation: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  stepsCharacter: {
    marginLeft: 16,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterEmoji: {
    fontSize: 60,
    marginBottom: 8,
  },
  stepTrail: {
    flexDirection: 'row',
    gap: 4,
  },
  stepEmoji: {
    fontSize: 16,
    opacity: 0.7,
  },
  waterDrops: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  waterDropEmoji: {
    fontSize: 16,
    opacity: 0.7,
  },
  stepsProgress: {
    alignItems: 'center',
  },
  
  // Water Card Styles
  waterContent: {
    padding: 20,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d9488',
    marginLeft: 12,
  },
  waterMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  waterInfo: {
    flex: 1,
  },
  waterValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 4,
  },
  waterLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  waterMotivation: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  waterCharacter: {
    marginLeft: 16,
  },
  waterControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  waterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  waterProgress: {
    alignItems: 'center',
  },
  
  // Calories Card - Maximum Space
  calorieCardMax: {
    marginBottom: 20,
    minHeight: 200,
  },
  calorieContentMax: {
    padding: 24,
    alignItems: 'center',
  },
  calorieHeaderMax: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieTitleMax: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#be185d',
    marginLeft: 12,
  },
  calorieMainMax: {
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieValueMax: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9d174d',
    marginBottom: 8,
  },
  calorieUnitMax: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  calorieGoalMax: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  calorieProgressMax: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieMotivation: {
    alignItems: 'center',
  },
  calorieMotivationText: {
    fontSize: 16,
    color: '#be185d',
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
    color: '#4338ca',
    marginLeft: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  quickActionButton: {
    width: (width - 120) / 2,
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
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
    color: '#4338ca',
    textAlign: 'center',
  },

  // Test Buttons
  testButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  testButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  resetButton: {
    backgroundColor: '#FF5722',
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dailyResetText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },

});