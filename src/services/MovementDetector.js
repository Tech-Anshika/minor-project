import { Accelerometer } from 'expo-sensors';
import { Platform } from 'react-native';

class MovementDetector {
  constructor() {
    this.isAvailable = false;
    this.isListening = false;
    this.subscription = null;
    this.lastAcceleration = { x: 0, y: 0, z: 0 };
    this.stepThreshold = 1.2; // Threshold for step detection
    this.lastStepTime = 0;
    this.minStepInterval = 300; // Minimum time between steps (ms)
    this.stepCount = 0;
    this.listeners = [];
    this.isMoving = false;
    this.movementTimeout = null;
  }

  async initialize() {
    try {
      console.log('Initializing movement detector...');
      
      // Check if accelerometer is available
      this.isAvailable = await Accelerometer.isAvailableAsync();
      
      if (!this.isAvailable) {
        console.warn('Accelerometer not available on this device');
        return false;
      }

      // Set update interval (60 FPS for smooth detection)
      Accelerometer.setUpdateInterval(1000 / 60);
      
      console.log('Movement detector initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing movement detector:', error);
      return false;
    }
  }

  startListening() {
    if (!this.isAvailable || this.isListening) {
      return;
    }

    console.log('Starting movement detection...');
    this.isListening = true;

    this.subscription = Accelerometer.addListener(({ x, y, z }) => {
      this.processAccelerationData(x, y, z);
    });
  }

  stopListening() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.isListening = false;
    console.log('Movement detection stopped');
  }

  processAccelerationData(x, y, z) {
    const currentTime = Date.now();
    
    // Calculate acceleration magnitude
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    
    // Calculate change in acceleration
    const deltaX = Math.abs(x - this.lastAcceleration.x);
    const deltaY = Math.abs(y - this.lastAcceleration.y);
    const deltaZ = Math.abs(z - this.lastAcceleration.z);
    const deltaAcceleration = deltaX + deltaY + deltaZ;

    // Detect movement based on acceleration changes
    if (deltaAcceleration > 0.1) {
      this.isMoving = true;
      
      // Clear any existing timeout
      if (this.movementTimeout) {
        clearTimeout(this.movementTimeout);
      }
      
      // Set timeout to mark as not moving after 2 seconds of no movement
      this.movementTimeout = setTimeout(() => {
        this.isMoving = false;
        this.notifyListeners();
      }, 2000);
      
      // Detect step based on acceleration pattern
      this.detectStep(acceleration, currentTime);
    }

    // Update last acceleration values
    this.lastAcceleration = { x, y, z };
    
    // Notify listeners about movement status
    this.notifyListeners();
  }

  detectStep(acceleration, currentTime) {
    // Check if enough time has passed since last step
    if (currentTime - this.lastStepTime < this.minStepInterval) {
      return;
    }

    // Simple step detection based on acceleration threshold
    // A step typically causes a spike in acceleration
    if (acceleration > this.stepThreshold) {
      this.stepCount++;
      this.lastStepTime = currentTime;
      
      console.log('Step detected! Total steps:', this.stepCount);
      
      // Notify listeners about new step
      this.notifyListeners();
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
        stepCount: this.stepCount,
        isMoving: this.isMoving,
        isAvailable: this.isAvailable
      });
    });
  }

  getStepCount() {
    return this.stepCount;
  }

  resetStepCount() {
    this.stepCount = 0;
    this.notifyListeners();
    console.log('Step count reset to 0');
  }

  getIsMoving() {
    return this.isMoving;
  }

  getIsAvailable() {
    return this.isAvailable;
  }

  // Calculate calories based on steps and movement
  calculateCalories(steps, isMoving = false) {
    // Base calories from steps
    let calories = steps * 0.04;
    
    // Bonus calories if actively moving
    if (isMoving) {
      calories *= 1.2; // 20% bonus for active movement
    }
    
    return Math.round(calories);
  }
}

export default new MovementDetector();
