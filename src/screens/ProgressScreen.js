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
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [progressData, setProgressData] = useState({
    dailyGoals: {
      yoga: false,
      diet: false,
      medication: false,
      steps: false,
      water: false,
    },
    weeklyStats: {
      yogaDays: 0,
      dietDays: 0,
      medicationDays: 0,
      avgSteps: 0,
      avgWater: 0,
    },
    monthlyStats: {
      yogaDays: 0,
      dietDays: 0,
      medicationDays: 0,
      avgSteps: 0,
      avgWater: 0,
    },
  });

  const periods = ['week', 'month', 'year'];

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    if (auth.currentUser) {
      // Load daily goals
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(
        collection(db, 'progress', auth.currentUser.uid, 'daily'),
        where('date', '>=', today),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const todayData = snapshot.docs.find(doc => {
          const docDate = doc.data().date.toDate();
          return docDate.toDateString() === today.toDateString();
        });

        if (todayData) {
          setProgressData(prev => ({
            ...prev,
            dailyGoals: todayData.data().goals,
          }));
        }
      });

      return unsubscribe;
    }
  };

  const toggleGoal = async (goal) => {
    const newGoals = {
      ...progressData.dailyGoals,
      [goal]: !progressData.dailyGoals[goal],
    };

    setProgressData(prev => ({
      ...prev,
      dailyGoals: newGoals,
    }));

    // Save to Firestore
    if (auth.currentUser) {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        await addDoc(collection(db, 'progress', auth.currentUser.uid, 'daily'), {
          date: today,
          goals: newGoals,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const getGoalIcon = (goal) => {
    switch (goal) {
      case 'yoga': return 'fitness';
      case 'diet': return 'restaurant';
      case 'medication': return 'medical';
      case 'steps': return 'walk';
      case 'water': return 'water';
      default: return 'checkmark';
    }
  };

  const getGoalTitle = (goal) => {
    switch (goal) {
      case 'yoga': return 'Yoga Practice';
      case 'diet': return 'Diet Followed';
      case 'medication': return 'Medication Taken';
      case 'steps': return 'Steps Goal';
      case 'water': return 'Water Intake';
      default: return goal;
    }
  };

  const getGoalDescription = (goal) => {
    switch (goal) {
      case 'yoga': return '30 minutes of yoga or exercise';
      case 'diet': return 'Followed PCOD-friendly meal plan';
      case 'medication': return 'Took prescribed medication';
      case 'steps': return 'Achieved 10,000 steps';
      case 'water': return 'Drank 8 glasses of water';
      default: return '';
    }
  };

  const getCompletionRate = () => {
    const completed = Object.values(progressData.dailyGoals).filter(Boolean).length;
    return Math.round((completed / Object.keys(progressData.dailyGoals).length) * 100);
  };

  const getStreakDays = (goal) => {
    // TODO: Calculate actual streak from Firestore data
    return Math.floor(Math.random() * 7) + 1;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📈 Progress Tracking</Text>
        <Text style={styles.subtitle}>Track your daily wellness goals</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedPeriodButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.selectedPeriodButtonText,
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily Goals Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="today" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>Today's Goals</Text>
          <Text style={styles.completionRate}>{getCompletionRate()}% Complete</Text>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getCompletionRate()}%` }
            ]} 
          />
        </View>

        <View style={styles.goalsList}>
          {Object.entries(progressData.dailyGoals).map(([goal, completed]) => (
            <TouchableOpacity
              key={goal}
              style={styles.goalItem}
              onPress={() => toggleGoal(goal)}
            >
              <View style={styles.goalInfo}>
                <View style={styles.goalIconContainer}>
                  <Ionicons 
                    name={getGoalIcon(goal)} 
                    size={20} 
                    color={completed ? '#4CAF50' : '#666'} 
                  />
                </View>
                <View style={styles.goalText}>
                  <Text style={[
                    styles.goalTitle,
                    completed && styles.completedGoalTitle
                  ]}>
                    {getGoalTitle(goal)}
                  </Text>
                  <Text style={styles.goalDescription}>
                    {getGoalDescription(goal)}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.checkbox,
                completed && styles.checkedBox
              ]}>
                {completed && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Weekly Stats */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="stats-chart" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}ly Stats
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="fitness" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>
              {selectedPeriod === 'week' ? progressData.weeklyStats.yogaDays : progressData.monthlyStats.yogaDays}
            </Text>
            <Text style={styles.statLabel}>Yoga Days</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="restaurant" size={24} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>
              {selectedPeriod === 'week' ? progressData.weeklyStats.dietDays : progressData.monthlyStats.dietDays}
            </Text>
            <Text style={styles.statLabel}>Diet Days</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="medical" size={24} color="#2196F3" />
            </View>
            <Text style={styles.statValue}>
              {selectedPeriod === 'week' ? progressData.weeklyStats.medicationDays : progressData.monthlyStats.medicationDays}
            </Text>
            <Text style={styles.statLabel}>Medication Days</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="walk" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.statValue}>
              {selectedPeriod === 'week' ? progressData.weeklyStats.avgSteps.toLocaleString() : progressData.monthlyStats.avgSteps.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Avg Steps</Text>
          </View>
        </View>
      </View>

      {/* Streaks Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flame" size={24} color="#FF5722" />
          <Text style={styles.cardTitle}>Current Streaks</Text>
        </View>

        <View style={styles.streaksList}>
          {Object.keys(progressData.dailyGoals).map((goal) => (
            <View key={goal} style={styles.streakItem}>
              <View style={styles.streakInfo}>
                <Ionicons name={getGoalIcon(goal)} size={20} color="#666" />
                <Text style={styles.streakName}>{getGoalTitle(goal)}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Ionicons name="flame" size={16} color="#FF5722" />
                <Text style={styles.streakDays}>{getStreakDays(goal)} days</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.cardTitle}>Recent Achievements</Text>
        </View>

        <View style={styles.achievementsList}>
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>7-Day Yoga Streak!</Text>
              <Text style={styles.achievementDescription}>
                You've practiced yoga for 7 consecutive days
              </Text>
            </View>
          </View>

          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Ionicons name="water" size={24} color="#2196F3" />
            </View>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Hydration Master</Text>
              <Text style={styles.achievementDescription}>
                Perfect water intake for 5 days in a row
              </Text>
            </View>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPeriodButton: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedPeriodButtonText: {
    color: 'white',
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
    flex: 1,
  },
  completionRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 4,
  },
  goalsList: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  completedGoalTitle: {
    color: '#4CAF50',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  streaksList: {
    gap: 12,
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakDays: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5722',
    marginLeft: 4,
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
});
