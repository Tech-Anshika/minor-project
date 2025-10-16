import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class StepCounterService {
  constructor() {
    this.isAvailable = false;
    this.subscription = null;
    this.currentSteps = 0;
    this.dailySteps = 0;
    this.lastUpdateDate = null;
    this.listeners = [];
  }

  async initialize() {
    try {
      // Check if pedometer is available on this device
      this.isAvailable = await Pedometer.isAvailableAsync();
      
      if (!this.isAvailable) {
        console.warn('Pedometer is not available on this device');
        return false;
      }

      // Request permissions
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Pedometer permission not granted');
        return false;
      }

      // Load saved data
      await this.loadSavedData();
      
      // Start monitoring steps
      this.startStepMonitoring();
      
      return true;
    } catch (error) {
      console.error('Error initializing step counter:', error);
      return false;
    }
  }

  async loadSavedData() {
    try {
      const today = new Date().toDateString();
      const savedData = await AsyncStorage.getItem('stepCounterData');
      
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.date === today) {
          this.dailySteps = data.steps || 0;
          this.lastUpdateDate = today;
        } else {
          // New day, reset steps
          this.dailySteps = 0;
          this.lastUpdateDate = today;
        }
      } else {
        this.dailySteps = 0;
        this.lastUpdateDate = today;
      }
    } catch (error) {
      console.error('Error loading saved step data:', error);
    }
  }

  async saveData() {
    try {
      const today = new Date().toDateString();
      const data = {
        date: today,
        steps: this.dailySteps,
        lastUpdate: new Date().toISOString()
      };
      await AsyncStorage.setItem('stepCounterData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving step data:', error);
    }
  }

  startStepMonitoring() {
    if (!this.isAvailable) return;

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    this.subscription = Pedometer.watchStepCount({
      startDate: startOfDay,
      endDate: endOfDay,
    });

    this.subscription.addListener(({ steps }) => {
      this.currentSteps = steps;
      this.dailySteps = steps;
      this.notifyListeners();
      this.saveData();
    });
  }

  stopStepMonitoring() {
    if (this.subscription) {
      this.subscription.removeAllListeners();
      this.subscription = null;
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      listener({
        steps: this.dailySteps,
        isAvailable: this.isAvailable,
        lastUpdate: this.lastUpdateDate
      });
    });
  }

  getCurrentSteps() {
    return this.dailySteps;
  }

  getIsAvailable() {
    return this.isAvailable;
  }

  // Calculate calories burned based on steps
  calculateCaloriesBurned(steps, weight = 70, height = 170) {
    // Average stride length calculation (height in cm * 0.43)
    const strideLength = height * 0.43;
    
    // Distance in meters
    const distance = (steps * strideLength) / 100;
    
    // Calories burned per meter (roughly 0.5 calories per meter for average person)
    const caloriesPerMeter = 0.5;
    
    // Base calories calculation
    let calories = distance * caloriesPerMeter;
    
    // Adjust for weight (heavier people burn more calories)
    const weightFactor = weight / 70; // 70kg as baseline
    calories *= weightFactor;
    
    // Add some base metabolic rate (BMR) contribution
    // Roughly 1 calorie per minute for basic metabolic functions
    const hours = new Date().getHours() + (new Date().getMinutes() / 60);
    const bmrContribution = hours * 1.2; // Slightly higher than 1 cal/min for activity
    
    return Math.round(calories + bmrContribution);
  }

  // Get estimated calories for today
  getTodayCalories(weight = 70, height = 170) {
    return this.calculateCaloriesBurned(this.dailySteps, weight, height);
  }

  // Reset daily steps (for testing or manual reset)
  async resetDailySteps() {
    this.dailySteps = 0;
    this.currentSteps = 0;
    await this.saveData();
    this.notifyListeners();
  }

  // Get step goal progress
  getStepGoalProgress(goal = 10000) {
    return {
      current: this.dailySteps,
      goal: goal,
      percentage: Math.min((this.dailySteps / goal) * 100, 100),
      remaining: Math.max(goal - this.dailySteps, 0)
    };
  }

  // Get motivational message based on progress
  getMotivationalMessage(goal = 10000) {
    const progress = this.getStepGoalProgress(goal);
    
    if (progress.percentage < 25) {
      return "Let's start moving! Every step counts! 🚶‍♀️";
    } else if (progress.percentage < 50) {
      return "Great start! Keep up the momentum! 💪";
    } else if (progress.percentage < 75) {
      return "You're halfway there! Keep going! 🌟";
    } else if (progress.percentage < 100) {
      return "Almost at your goal! You're doing amazing! 🎯";
    } else {
      return "Goal achieved! You're a step champion! 🏆";
    }
  }
}

export default new StepCounterService();
