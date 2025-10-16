import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Platform } from 'react-native';

class PhoneStepCounter {
  constructor() {
    this.isAvailable = false;
    this.isListening = false;
    this.subscription = null;
    this.stepCount = 0;
    this.caloriesBurned = 0;
    this.listeners = [];
    this.lastAcceleration = { x: 0, y: 0, z: 0 };
    this.stepThreshold = 1.5; // Threshold for step detection
    this.lastStepTime = 0;
    this.minStepInterval = 300; // Minimum time between steps (ms)
    this.isMoving = false;
    this.movementTimeout = null;
    this.accelerationHistory = [];
    this.stepPattern = [];
    this.batchSteps = 0; // Steps counted in current batch
    this.batchInterval = null; // 5-minute batch interval
    this.lastBatchTime = Date.now();
  }

  async initialize() {
    try {
      console.log('Initializing phone step counter...');
      
      // Check if accelerometer is available
      const isAccelerometerAvailable = await Accelerometer.isAvailableAsync();
      
      if (isAccelerometerAvailable) {
        // Set update interval to 60fps for smooth detection
        Accelerometer.setUpdateInterval(1000 / 60);
        this.isAvailable = true;
        console.log('Phone step counter initialized successfully');
        return true;
      } else {
        console.log('Accelerometer not available on this device');
        return false;
      }
    } catch (error) {
      console.error('Error initializing phone step counter:', error);
      return false;
    }
  }

  startListening() {
    if (!this.isAvailable || this.isListening) {
      return;
    }

    console.log('Starting phone step detection with 5-minute batches...');
    this.isListening = true;

    // Start 5-minute batch interval
    this.startBatchInterval();

    this.subscription = Accelerometer.addListener(({ x, y, z }) => {
      this.processAccelerationData(x, y, z);
    });
  }

  stopListening() {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    
    // Stop batch interval
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
    
    this.isListening = false;
    console.log('Phone step detection stopped');
  }

  startBatchInterval() {
    // Clear any existing interval
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }

    // Set up 5-minute (300,000ms) batch interval
    this.batchInterval = setInterval(() => {
      this.processBatch();
    }, 5 * 60 * 1000); // 5 minutes

    console.log('Started 5-minute batch counting');
  }

  processBatch() {
    // Add batch steps to total step count
    if (this.batchSteps > 0) {
      this.stepCount += this.batchSteps;
      this.caloriesBurned = Math.round(this.stepCount * 0.04);
      
      console.log(`Batch processed: +${this.batchSteps} steps (Total: ${this.stepCount})`);
      
      // Reset batch steps
      this.batchSteps = 0;
      this.lastBatchTime = Date.now();
      
      // Notify listeners about updated step count
      this.notifyListeners();
    }
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

    // Store acceleration history for pattern analysis
    this.accelerationHistory.push(acceleration);
    if (this.accelerationHistory.length > 10) {
      this.accelerationHistory.shift();
    }

    // Detect movement based on acceleration changes
    if (deltaAcceleration > 0.2) {
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
    } else {
      // If no significant movement, gradually reduce movement status
      if (this.movementTimeout) {
        clearTimeout(this.movementTimeout);
      }
      this.movementTimeout = setTimeout(() => {
        this.isMoving = false;
        this.notifyListeners();
      }, 1000);
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

    // Add to step pattern for analysis
    this.stepPattern.push(acceleration);
    if (this.stepPattern.length > 5) {
      this.stepPattern.shift();
    }

    // Step detection based on acceleration threshold and pattern
    if (acceleration > this.stepThreshold) {
      // Additional validation: check if this looks like a real step pattern
      if (this.isValidStepPattern()) {
        this.batchSteps++; // Add to batch instead of total
        this.lastStepTime = currentTime;
        
        console.log(`Step detected! Batch steps: ${this.batchSteps} (Total: ${this.stepCount})`);
        
        // Notify listeners about batch progress (but don't update total yet)
        this.notifyListeners();
      }
    }
  }

  isValidStepPattern() {
    // Check if the recent acceleration pattern looks like a step
    if (this.stepPattern.length < 3) {
      return false;
    }

    // Look for a spike pattern (low -> high -> low)
    const recent = this.stepPattern.slice(-3);
    const hasSpike = recent[1] > recent[0] && recent[1] > recent[2];
    const isSignificant = recent[1] > this.stepThreshold * 0.8;

    return hasSpike && isSignificant;
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        stepCount: this.stepCount,
        batchSteps: this.batchSteps,
        calories: this.caloriesBurned,
        isMoving: this.isMoving,
        isAvailable: this.isAvailable
      });
    });
  }

  getStepCount() {
    return this.stepCount;
  }

  getCaloriesBurned() {
    return this.caloriesBurned;
  }

  getIsMoving() {
    return this.isMoving;
  }

  getIsAvailable() {
    return this.isAvailable;
  }

  resetStepCount() {
    this.stepCount = 0;
    this.batchSteps = 0;
    this.caloriesBurned = 0;
    this.notifyListeners();
  }

  // Calculate calories based on steps and movement
  calculateCalories(steps, isMoving = false) {
    // Base calories from steps
    let calories = steps * 0.04;

    // Additional calories if actively moving
    if (isMoving) {
      calories *= 1.2; // 20% more calories when actively moving
    }

    return Math.round(calories);
  }

  // Get debug information
  getDebugInfo() {
    return {
      isAvailable: this.isAvailable,
      isListening: this.isListening,
      isMoving: this.isMoving,
      stepCount: this.stepCount,
      batchSteps: this.batchSteps,
      caloriesBurned: this.caloriesBurned,
      accelerationHistory: this.accelerationHistory.slice(-5),
      stepPattern: this.stepPattern.slice(-3),
      lastBatchTime: this.lastBatchTime
    };
  }
}

export default new PhoneStepCounter();
