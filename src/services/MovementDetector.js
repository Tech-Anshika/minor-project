// import { Accelerometer } from 'expo-sensors';
import { Platform } from 'react-native';

class MovementDetector {
  constructor() {
    this.isAvailable = false;
    this.isListening = false;
    this.subscription = null;
    this.lastAcceleration = { x: 0, y: 0, z: 0 };
    this.stepThreshold = 4.0; // Much higher threshold for step detection
    this.lastStepTime = 0;
    this.minStepInterval = 500; // Minimum time between steps (ms)
    this.stepCount = 0;
    this.listeners = [];
    this.isMoving = false;
    this.movementTimeout = null;
    this.movementHistory = []; // Track movement patterns
    this.stepPattern = []; // Track step patterns
    this.baseAcceleration = { x: 0, y: 0, z: 0 };
    this.calibrationSamples = 0;
    this.isCalibrated = false;
  }

  async initialize() {
    try {
      console.log('Initializing movement detector...');
      
      // For now, disable accelerometer-based detection due to package issues
      // This will force the app to use manual step counting
      this.isAvailable = false;
      console.log('Movement detector disabled - using manual step counting');
      return false;
    } catch (error) {
      console.error('Error initializing movement detector:', error);
      return false;
    }
  }

  startListening() {
    if (!this.isAvailable || this.isListening) {
      return;
    }

    console.log('Movement detection not available - using manual mode');
    this.isListening = false;
  }

  startCalibration() {
    console.log('Starting calibration phase...');
    this.isCalibrated = false;
    this.calibrationSamples = 0;
    this.baseAcceleration = { x: 0, y: 0, z: 0 };
    
    // Calibration will complete after 3 seconds
    setTimeout(() => {
      this.isCalibrated = true;
      console.log('Calibration complete. Base acceleration:', this.baseAcceleration);
    }, 3000);
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
    
    // During calibration, collect base acceleration
    if (!this.isCalibrated) {
      this.calibrationSamples++;
      this.baseAcceleration.x += x;
      this.baseAcceleration.y += y;
      this.baseAcceleration.z += z;
      
      if (this.calibrationSamples >= 60) { // 1 second of data at 60fps
        this.baseAcceleration.x /= this.calibrationSamples;
        this.baseAcceleration.y /= this.calibrationSamples;
        this.baseAcceleration.z /= this.calibrationSamples;
      }
      
      // Update last acceleration values
      this.lastAcceleration = { x, y, z };
      return;
    }

    // Calculate acceleration relative to base (calibrated) position
    const relativeX = x - this.baseAcceleration.x;
    const relativeY = y - this.baseAcceleration.y;
    const relativeZ = z - this.baseAcceleration.z;
    
    // Calculate total acceleration magnitude
    const acceleration = Math.sqrt(relativeX * relativeX + relativeY * relativeY + relativeZ * relativeZ);
    
    // Calculate change in acceleration (more sensitive to actual movement)
    const deltaX = Math.abs(relativeX - (this.lastAcceleration.x - this.baseAcceleration.x));
    const deltaY = Math.abs(relativeY - (this.lastAcceleration.y - this.baseAcceleration.y));
    const deltaZ = Math.abs(relativeZ - (this.lastAcceleration.z - this.baseAcceleration.z));
    const deltaAcceleration = deltaX + deltaY + deltaZ;

    // Much stricter movement detection
    const movementThreshold = 0.8; // Much higher threshold
    const stepDetectionThreshold = 3.0; // Much higher threshold for step detection
    
    // Track movement history
    this.movementHistory.push(deltaAcceleration);
    if (this.movementHistory.length > 20) {
      this.movementHistory.shift(); // Keep only last 20 readings
    }
    
    // Only detect movement if there's significant change
    if (deltaAcceleration > movementThreshold) {
      this.isMoving = true;
      
      // Clear any existing timeout
      if (this.movementTimeout) {
        clearTimeout(this.movementTimeout);
      }
      
      // Set timeout to mark as not moving after 3 seconds of no significant movement
      this.movementTimeout = setTimeout(() => {
        this.isMoving = false;
        this.notifyListeners();
      }, 3000);
      
      // Only detect steps if acceleration is high enough and we're moving
      if (acceleration > stepDetectionThreshold && this.isMoving) {
        this.detectStep(acceleration, currentTime);
      }
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
    if (this.stepPattern.length > 10) {
      this.stepPattern.shift(); // Keep only last 10 readings
    }

    // Much more strict step detection
    // A step should have a very significant acceleration spike
    if (acceleration > this.stepThreshold) {
      // Additional validation: check if this looks like a real step pattern
      if (this.isValidStepPattern()) {
        // Extra validation: ensure we have enough movement history
        if (this.movementHistory.length > 5) {
          this.stepCount++;
          this.lastStepTime = currentTime;
          
          console.log('Step detected! Total steps:', this.stepCount, 'Acceleration:', acceleration.toFixed(2));
          
          // Notify listeners about new step
          this.notifyListeners();
        }
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

  // Debug function to get current status
  getDebugInfo() {
    return {
      isCalibrated: this.isCalibrated,
      isMoving: this.isMoving,
      stepCount: this.stepCount,
      baseAcceleration: this.baseAcceleration,
      lastAcceleration: this.lastAcceleration,
      stepPattern: this.stepPattern.slice(-5), // Last 5 readings
      calibrationSamples: this.calibrationSamples
    };
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
