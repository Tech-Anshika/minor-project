import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class StepCounterService {
  constructor() {
    this.isAvailable = false;
    this.isSupported = false;
    this.permissionGranted = false;
    this.currentSteps = 0;
    this.dailySteps = 0;
    this.lastUpdateDate = null;
    this.listeners = [];
    this.updateInterval = null;
  }

  async initialize() {
    try {
      console.log('Initializing step counter...');
      
      // For now, we'll use a simulated approach that works without native modules
      // In a real app, you would integrate with device sensors here
      this.isSupported = true;
      this.permissionGranted = true;
      this.isAvailable = true;
      
      console.log('Step counter initialized with simulation mode');
      
      // Load saved data
      await this.loadSavedData();
      
      // Start monitoring steps
      this.startStepMonitoring();
      
      return true;
    } catch (error) {
      console.error('Error initializing step counter:', error);
      // Load saved data for fallback
      await this.loadSavedData();
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
        // Initialize with some sample data for demonstration
        // Simulate steps based on time of day
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeInDay = hours + (minutes / 60);
        
        // More steps as the day progresses
        let baseSteps = Math.floor(timeInDay * 200); // ~200 steps per hour
        baseSteps = Math.max(0, Math.min(baseSteps, 8000)); // Cap at 8000
        
        this.dailySteps = baseSteps;
        this.lastUpdateDate = today;
        await this.saveData();
      }
      
      console.log('Loaded step data:', this.dailySteps);
    } catch (error) {
      console.error('Error loading saved step data:', error);
      // Fallback to sample data
      this.dailySteps = Math.floor(Math.random() * 5000) + 2000;
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
    console.log('Starting step monitoring with simulation...');
    this.startSimulatedStepCounting();
  }

  startSimulatedStepCounting() {
    console.log('Starting simulated step counting...');
    
    // Simulate gradual step increase throughout the day
    this.updateInterval = setInterval(() => {
      // Add random steps (2-8) every 15 seconds to simulate walking
      const randomSteps = Math.floor(Math.random() * 7) + 2;
      this.dailySteps += randomSteps;
      this.currentSteps = this.dailySteps;
      
      console.log('Simulated steps updated:', this.dailySteps);
      this.notifyListeners();
      this.saveData();
    }, 15000); // Update every 15 seconds
  }

  stopStepMonitoring() {
    try {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
      console.log('Step monitoring stopped');
    } catch (error) {
      console.error('Error stopping step monitoring:', error);
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

  // Add steps manually (for testing)
  async addSteps(steps) {
    this.dailySteps += steps;
    this.currentSteps = this.dailySteps;
    await this.saveData();
    this.notifyListeners();
    console.log('Added steps:', steps, 'Total:', this.dailySteps);
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
