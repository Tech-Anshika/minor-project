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
import PeriodCalendar from '../components/PeriodCalendar';
import ModernGradientBackground from '../components/ModernGradientBackground';
import ModernCard from '../components/ModernCard';
import FloatingActionButton from '../components/FloatingActionButton';
import ModernProgressRing from '../components/ModernProgressRing';

const { width } = Dimensions.get('window');

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

  // Generate calendar days for the current month with period tracking
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: '', isEmpty: true });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const isToday = day === today.getDate();
      
      // Calculate if this day is a period day based on cycle data
      let isPeriod = false;
      let isOvulation = false;
      
      if (cycleData.lastPeriod) {
        const periodStart = new Date(cycleData.lastPeriod);
        const daysSincePeriod = Math.floor((currentDate - periodStart) / (1000 * 60 * 60 * 24));
        
        // Period days (first 5 days of cycle)
        if (daysSincePeriod >= 0 && daysSincePeriod < 5) {
          isPeriod = true;
        }
        
        // Ovulation day (around day 14)
        if (daysSincePeriod === 14) {
          isOvulation = true;
        }
      }
      
      days.push({
        day: day.toString(),
        isToday,
        isPeriod,
        isOvulation,
        date: currentDate
      });
    }
    
    return days;
  };

  return (
    <ModernGradientBackground type="home">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.headerContent}>
            <View style={styles.greetingSection}>
              <Text style={styles.modernGreeting}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, 
                {user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 🌸
              </Text>
              <Text style={styles.modernSubGreeting}>
                Ready to take care of your health today?
              </Text>
            </View>
            <View style={styles.avatarContainer}>
              <AnimatedCharacter
                type="walking"
                size={80}
                color="white"
                showText={false}
              />
            </View>
          </View>
        </View>

        {/* Modern Cycle Tracker Card */}
        <ModernCard type="period" style={styles.modernCard}>
          <View style={styles.modernCardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="calendar" size={24} color="white" />
              <Text style={styles.modernCardTitle}>Cycle Tracker</Text>
            </View>
            <ModernProgressRing
              progress={(cycleData.currentDay / cycleData.cycleLength) * 100}
              size={80}
              color="white"
              backgroundColor="rgba(255,255,255,0.3)"
              centerText={`Day ${cycleData.currentDay}`}
            />
          </View>
          
          <View style={styles.modernCycleInfo}>
            <View style={styles.phaseContainer}>
              <View style={[styles.modernPhaseIndicator, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name={getPhaseIcon(cycleData.phase)} size={20} color="white" />
              </View>
              <View style={styles.phaseText}>
                <Text style={styles.modernPhaseName}>{cycleData.phase} Phase</Text>
                <Text style={styles.modernDayText}>Day {cycleData.currentDay} of {cycleData.cycleLength}</Text>
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

        {/* Mini Calendar Preview */}
        <View style={styles.calendarPreview}>
          <Text style={styles.calendarTitle}>This Month's Cycle</Text>
          <View style={styles.calendarGrid}>
            {generateCalendarDays().map((day, index) => (
              <View key={index} style={styles.calendarDay}>
                <Text style={[
                  styles.dayNumber,
                  day.isToday && styles.todayDay,
                  day.isPeriod && styles.periodDay,
                  day.isOvulation && styles.ovulationDay
                ]}>
                  {day.day}
                </Text>
                {day.isPeriod && <View style={styles.periodDot} />}
                {day.isOvulation && <View style={styles.ovulationDot} />}
              </View>
            ))}
          </View>
          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E91E63' }]} />
              <Text style={styles.legendText}>Period</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Ovulation</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Predicted</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions for Period Logging */}
        <View style={styles.periodActions}>
          <TouchableOpacity style={styles.periodButton} onPress={() => navigation.navigate('PeriodLog')}>
            <Ionicons name="add-circle" size={20} color="#E91E63" />
            <Text style={styles.periodButtonText}>Log Period Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodButton} onPress={() => navigation.navigate('PeriodLog')}>
            <Ionicons name="medical" size={20} color="#E91E63" />
            <Text style={styles.periodButtonText}>Add Symptoms</Text>
          </TouchableOpacity>
        </View>
      </View>

        {/* Modern Stats Cards */}
        <View style={styles.statsContainer}>
          <ModernCard type="success" style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View style={styles.statIconContainer}>
                <Ionicons name="walk" size={24} color="#4facfe" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{todayStats.steps.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Steps Today</Text>
                <ModernProgressRing
                  progress={(todayStats.steps / 10000) * 100}
                  size={50}
                  color="#4facfe"
                  backgroundColor="#E0E0E0"
                  showPercentage={false}
                />
              </View>
            </View>
          </ModernCard>

          <ModernCard type="info" style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View style={styles.statIconContainer}>
                <Ionicons name="water" size={24} color="#a8edea" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{todayStats.water}/8</Text>
                <Text style={styles.statLabel}>Glasses</Text>
                <ModernProgressRing
                  progress={(todayStats.water / 8) * 100}
                  size={50}
                  color="#a8edea"
                  backgroundColor="#E0E0E0"
                  showPercentage={false}
                />
              </View>
            </View>
          </ModernCard>
        </View>

        <View style={styles.statsContainer}>
          <ModernCard type="warning" style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View style={styles.statIconContainer}>
                <Ionicons name="flame" size={24} color="#fa709a" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{todayStats.calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
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

          <ModernCard type="secondary" style={styles.statCard}>
            <View style={styles.statCardContent}>
              <View style={styles.statIconContainer}>
                <Ionicons name="heart" size={24} color="#f093fb" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{todayStats.mood}</Text>
                <Text style={styles.statLabel}>Mood</Text>
                <View style={styles.moodIndicator}>
                  <Text style={styles.moodEmoji}>😊</Text>
                </View>
              </View>
            </View>
          </ModernCard>
        </View>

        {/* Modern Quick Actions */}
        <ModernCard type="glass" style={styles.modernCard}>
          <View style={styles.modernCardHeader}>
            <Ionicons name="flash" size={24} color="#667eea" />
            <Text style={styles.modernCardTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.modernActionsGrid}>
            <TouchableOpacity style={styles.modernActionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#ff9a9e' }]}>
                <Ionicons name="add-circle" size={20} color="white" />
              </View>
              <Text style={styles.modernActionText}>Log Period</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modernActionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#a8edea' }]}>
                <Ionicons name="fitness" size={20} color="white" />
              </View>
              <Text style={styles.modernActionText}>Start Yoga</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modernActionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#ffecd2' }]}>
                <Ionicons name="restaurant" size={20} color="white" />
              </View>
              <Text style={styles.modernActionText}>Log Meal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modernActionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#d299c2' }]}>
                <Ionicons name="chatbubble" size={20} color="white" />
              </View>
              <Text style={styles.modernActionText}>Ask AI</Text>
            </TouchableOpacity>
          </View>
        </ModernCard>

        {/* Modern Medication Reminders */}
        <ModernCard type="info" style={styles.modernCard}>
          <View style={styles.modernCardHeader}>
            <Ionicons name="medical" size={24} color="white" />
            <Text style={styles.modernCardTitle}>Medication Reminders</Text>
          </View>
          
          <View style={styles.modernReminderItem}>
            <View style={styles.reminderIconContainer}>
              <Ionicons name="medical" size={20} color="#a8edea" />
            </View>
            <View style={styles.reminderInfo}>
              <Text style={styles.modernReminderName}>Metformin</Text>
              <Text style={styles.modernReminderTime}>8:00 AM</Text>
            </View>
            <TouchableOpacity style={styles.modernReminderButton}>
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
  // Modern Header Styles
  modernHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingSection: {
    flex: 1,
  },
  modernGreeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modernSubGreeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  avatarContainer: {
    marginLeft: 16,
  },
  // Modern Card Styles
  modernCard: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  modernCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modernCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  modernCycleInfo: {
    marginTop: 16,
  },
  modernPhaseIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernPhaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  modernDayText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  nextPeriodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
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
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 4,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  moodIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 16,
  },
  // Modern Actions
  modernActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modernActionButton: {
    width: (width - 80) / 2,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modernActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    textAlign: 'center',
  },
  // Modern Reminder
  modernReminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
  },
  reminderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modernReminderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  modernReminderTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  modernReminderButton: {
    marginLeft: 'auto',
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
  // Calendar Preview Styles
  calendarPreview: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarDay: {
    width: (width - 100) / 7,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  todayDay: {
    color: '#E91E63',
    fontWeight: 'bold',
    backgroundColor: '#FFF5F8',
    borderRadius: 16,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  periodDay: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  ovulationDay: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  periodDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E91E63',
  },
  ovulationDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  // Period Actions Styles
  periodActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F8BBD9',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
    marginLeft: 8,
  },
});

