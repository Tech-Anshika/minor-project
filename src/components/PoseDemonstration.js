import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCharacter from './AnimatedCharacter';

const { width, height } = Dimensions.get('window');

export default function PoseDemonstration({ 
  pose, 
  isPlaying = false, 
  onComplete = () => {},
  onPause = () => {},
  onPlay = () => {}
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const stepTimer = useRef(null);
  const animationTimer = useRef(null);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      startDemonstration();
    } else {
      stopDemonstration();
    }
    
    return () => {
      stopDemonstration();
    };
  }, [isPlaying, isPaused]);

  const startDemonstration = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    animateStep(0);
  };

  const stopDemonstration = () => {
    if (stepTimer.current) {
      clearTimeout(stepTimer.current);
      stepTimer.current = null;
    }
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }
    setIsAnimating(false);
  };

  const animateStep = (stepIndex) => {
    if (stepIndex >= pose.instructions.length) {
      // Demonstration complete
      onComplete();
      return;
    }

    setCurrentStep(stepIndex);
    
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: ((stepIndex + 1) / pose.instructions.length) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Auto-advance to next step after delay
    stepTimer.current = setTimeout(() => {
      if (isPlaying && !isPaused) {
        // Animate exit
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          animateStep(stepIndex + 1);
        });
      }
    }, getStepDuration(stepIndex));
  };

  const getStepDuration = (stepIndex) => {
    // Different durations for different types of instructions
    const instruction = pose.instructions[stepIndex].toLowerCase();
    if (instruction.includes('breathe') || instruction.includes('hold')) {
      return 4000; // 4 seconds for breathing/holding
    } else if (instruction.includes('slowly') || instruction.includes('gently')) {
      return 3000; // 3 seconds for slow movements
    } else {
      return 2500; // 2.5 seconds for regular instructions
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      onPlay();
    } else {
      onPause();
    }
  };

  const handleRestart = () => {
    stopDemonstration();
    setCurrentStep(0);
    progressAnim.setValue(0);
    if (isPlaying) {
      startDemonstration();
    }
  };

  const getPoseAnimation = (stepIndex) => {
    // Different character animations based on pose and step
    const instruction = pose.instructions[stepIndex].toLowerCase();
    
    if (instruction.includes('breathe') || instruction.includes('hold')) {
      return 'breathing';
    } else if (instruction.includes('stretch') || instruction.includes('extend')) {
      return 'stretching';
    } else if (instruction.includes('bend') || instruction.includes('fold')) {
      return 'bending';
    } else if (instruction.includes('balance') || instruction.includes('stand')) {
      return 'balancing';
    } else {
      return 'yoga';
    }
  };

  const getPoseColor = () => {
    switch (pose.phase) {
      case 'Menstrual': return '#E91E63';
      case 'Follicular': return '#9C27B0';
      case 'Ovulation': return '#FF9800';
      case 'Luteal': return '#4CAF50';
      default: return '#E91E63';
    }
  };

  if (!pose) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.poseName}>{pose.name}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleRestart} style={styles.controlButton}>
            <Ionicons name="refresh" size={24} color="#E91E63" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePause} style={styles.controlButton}>
            <Ionicons name={isPaused ? "play" : "pause"} size={24} color="#E91E63" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {pose.instructions.length}
        </Text>
      </View>

      {/* Animated Character */}
      <Animated.View 
        style={[
          styles.characterContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        <AnimatedCharacter
          type={getPoseAnimation(currentStep)}
          size={200}
          color={getPoseColor()}
          showText={false}
        />
        
        {/* Pose Emoji Overlay */}
        <View style={styles.emojiOverlay}>
          <Text style={styles.poseEmoji}>{pose.image}</Text>
        </View>
      </Animated.View>

      {/* Current Instruction */}
      <Animated.View 
        style={[
          styles.instructionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.stepNumber}>Step {currentStep + 1}</Text>
        <Text style={styles.instructionText}>
          {pose.instructions[currentStep]}
        </Text>
        
        {/* Breathing Indicator */}
        {pose.instructions[currentStep].toLowerCase().includes('breathe') && (
          <View style={styles.breathingIndicator}>
            <Animated.View style={[styles.breathingCircle, {
              transform: [{ scale: scaleAnim }]
            }]} />
            <Text style={styles.breathingText}>Breathe deeply</Text>
          </View>
        )}
      </Animated.View>

      {/* Pose Benefits */}
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Benefits:</Text>
        <View style={styles.benefitsList}>
          {pose.benefits.slice(0, 3).map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pose Info */}
      <View style={styles.poseInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.infoText}>{pose.duration}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="star" size={16} color="#666" />
          <Text style={styles.infoText}>{pose.difficulty}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="grid" size={16} color="#666" />
          <Text style={styles.infoText}>{pose.category}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  poseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
  },
  controlButton: {
    padding: 8,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  emojiOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  poseEmoji: {
    fontSize: 24,
  },
  instructionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
    textAlign: 'center',
  },
  breathingIndicator: {
    alignItems: 'center',
    marginTop: 16,
  },
  breathingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E91E63',
    opacity: 0.3,
  },
  breathingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  benefitsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  poseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});
