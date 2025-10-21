import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

class ProgressTracker {
  constructor() {
    this.dailyData = {};
    this.listeners = [];
  }

  // Track daily progress data
  async trackDailyProgress(data) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const progressData = {
      date: Timestamp.fromDate(today),
      waterIntake: data.waterIntake || 0,
      steps: data.steps || 0,
      sleep: data.sleep || 0,
      mood: data.mood || 5,
      pain: data.pain || 0,
      exercise: data.exercise || false,
      medication: data.medication || false,
      symptoms: data.symptoms || [],
      notes: data.notes || '',
      timestamp: Timestamp.now(),
    };

    try {
      // Use setDoc with merge to update or create
      const docRef = doc(db, 'progress', auth.currentUser.uid, 'daily', today.toISOString().split('T')[0]);
      await setDoc(docRef, progressData, { merge: true });
      
      console.log('Daily progress tracked successfully');
      return progressData;
    } catch (error) {
      console.error('Error tracking daily progress:', error);
      throw error;
    }
  }

  // Get today's progress data
  async getTodaysProgress() {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const docRef = doc(db, 'progress', auth.currentUser.uid, 'daily', today.toISOString().split('T')[0]);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting today\'s progress:', error);
      throw error;
    }
  }

  // Listen to daily progress changes
  listenToDailyProgress(callback) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const docRef = doc(db, 'progress', auth.currentUser.uid, 'daily', today.toISOString().split('T')[0]);
    
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback(null);
      }
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Get progress history
  async getProgressHistory(days = 30) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const q = query(
        collection(db, 'progress', auth.currentUser.uid, 'daily'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));
    } catch (error) {
      console.error('Error getting progress history:', error);
      throw error;
    }
  }

  // Calculate weekly averages
  calculateWeeklyAverages(progressHistory) {
    const weeklyData = {
      waterIntake: 0,
      steps: 0,
      sleep: 0,
      mood: 0,
      pain: 0,
      exerciseDays: 0,
      medicationDays: 0,
    };

    if (progressHistory.length === 0) {
      return weeklyData;
    }

    const last7Days = progressHistory.slice(0, 7);
    
    last7Days.forEach(day => {
      weeklyData.waterIntake += day.waterIntake || 0;
      weeklyData.steps += day.steps || 0;
      weeklyData.sleep += day.sleep || 0;
      weeklyData.mood += day.mood || 0;
      weeklyData.pain += day.pain || 0;
      if (day.exercise) weeklyData.exerciseDays++;
      if (day.medication) weeklyData.medicationDays++;
    });

    const days = last7Days.length;
    weeklyData.waterIntake = Math.round(weeklyData.waterIntake / days);
    weeklyData.steps = Math.round(weeklyData.steps / days);
    weeklyData.sleep = Math.round((weeklyData.sleep / days) * 10) / 10;
    weeklyData.mood = Math.round((weeklyData.mood / days) * 10) / 10;
    weeklyData.pain = Math.round((weeklyData.pain / days) * 10) / 10;

    return weeklyData;
  }

  // Calculate monthly averages
  calculateMonthlyAverages(progressHistory) {
    const monthlyData = {
      waterIntake: 0,
      steps: 0,
      sleep: 0,
      mood: 0,
      pain: 0,
      exerciseDays: 0,
      medicationDays: 0,
    };

    if (progressHistory.length === 0) {
      return monthlyData;
    }

    const last30Days = progressHistory.slice(0, 30);
    
    last30Days.forEach(day => {
      monthlyData.waterIntake += day.waterIntake || 0;
      monthlyData.steps += day.steps || 0;
      monthlyData.sleep += day.sleep || 0;
      monthlyData.mood += day.mood || 0;
      monthlyData.pain += day.pain || 0;
      if (day.exercise) monthlyData.exerciseDays++;
      if (day.medication) monthlyData.medicationDays++;
    });

    const days = last30Days.length;
    monthlyData.waterIntake = Math.round(monthlyData.waterIntake / days);
    monthlyData.steps = Math.round(monthlyData.steps / days);
    monthlyData.sleep = Math.round((monthlyData.sleep / days) * 10) / 10;
    monthlyData.mood = Math.round((monthlyData.mood / days) * 10) / 10;
    monthlyData.pain = Math.round((monthlyData.pain / days) * 10) / 10;

    return monthlyData;
  }

  // Get streak data
  calculateStreaks(progressHistory) {
    const streaks = {
      water: 0,
      steps: 0,
      sleep: 0,
      exercise: 0,
      medication: 0,
    };

    if (progressHistory.length === 0) {
      return streaks;
    }

    // Sort by date (oldest first)
    const sortedHistory = [...progressHistory].sort((a, b) => a.date - b.date);
    
    // Calculate streaks for each metric
    Object.keys(streaks).forEach(metric => {
      let currentStreak = 0;
      
      for (let i = sortedHistory.length - 1; i >= 0; i--) {
        const day = sortedHistory[i];
        let metGoal = false;
        
        switch (metric) {
          case 'water':
            metGoal = (day.waterIntake || 0) >= 8;
            break;
          case 'steps':
            metGoal = (day.steps || 0) >= 8000;
            break;
          case 'sleep':
            metGoal = (day.sleep || 0) >= 7;
            break;
          case 'exercise':
            metGoal = day.exercise === true;
            break;
          case 'medication':
            metGoal = day.medication === true;
            break;
        }
        
        if (metGoal) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      streaks[metric] = currentStreak;
    });

    return streaks;
  }

  // Get achievement data
  getAchievements(progressHistory, streaks) {
    const achievements = [];

    // Water intake achievements
    if (streaks.water >= 7) {
      achievements.push({
        id: 'water_week',
        title: 'Hydration Hero',
        description: 'Met water intake goal for 7 consecutive days',
        icon: 'water',
        color: '#06B6D4',
        unlocked: true,
      });
    }

    // Steps achievements
    if (streaks.steps >= 7) {
      achievements.push({
        id: 'steps_week',
        title: 'Step Master',
        description: 'Achieved step goal for 7 consecutive days',
        icon: 'walk',
        color: '#A855F7',
        unlocked: true,
      });
    }

    // Exercise achievements
    if (streaks.exercise >= 5) {
      achievements.push({
        id: 'exercise_week',
        title: 'Fitness Champion',
        description: 'Exercised for 5 consecutive days',
        icon: 'fitness',
        color: '#F59E0B',
        unlocked: true,
      });
    }

    // Medication achievements
    if (streaks.medication >= 30) {
      achievements.push({
        id: 'medication_month',
        title: 'Consistency King',
        description: 'Took medication for 30 consecutive days',
        icon: 'medical',
        color: '#8B5CF6',
        unlocked: true,
      });
    }

    // Pain management achievements
    const recentPain = progressHistory.slice(0, 7).reduce((sum, day) => sum + (day.pain || 0), 0) / 7;
    if (recentPain <= 2) {
      achievements.push({
        id: 'pain_low',
        title: 'Pain Warrior',
        description: 'Maintained low pain levels for a week',
        icon: 'heart',
        color: '#FF6B9D',
        unlocked: true,
      });
    }

    return achievements;
  }

  // Update progress with period log data
  async updateProgressWithPeriodData(periodData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const progressData = {
      date: Timestamp.fromDate(today),
      pain: periodData.pain || 0,
      symptoms: periodData.symptoms || [],
      mood: this.mapMoodToNumber(periodData.mood),
      notes: periodData.comments || '',
      timestamp: Timestamp.now(),
    };

    return await this.trackDailyProgress(progressData);
  }

  // Map mood string to number
  mapMoodToNumber(mood) {
    const moodMap = {
      'happy': 8,
      'excited': 9,
      'normal': 5,
      'sad': 3,
      'anxious': 4,
      'irritable': 3,
    };
    
    return moodMap[mood] || 5;
  }

  // Clean up listeners
  cleanup() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}

export default new ProgressTracker();
