import React, { useEffect, useRef, useState } from 'react';
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

const { width } = Dimensions.get('window');

export default function StepCounter({ 
  currentSteps = 0, 
  goalSteps = 10000, 
  onPress = () => {} 
}) {
  const [animatedSteps, setAnimatedSteps] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const progress = Math.min((currentSteps / goalSteps) * 100, 100);
  const isGoalReached = currentSteps >= goalSteps;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Animate number counting
    Animated.timing(numberAnim, {
      toValue: currentSteps,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Animate step counter
    let stepInterval;
    if (currentSteps > animatedSteps) {
      stepInterval = setInterval(() => {
        setAnimatedSteps(prev => {
          const increment = Math.ceil((currentSteps - prev) / 20);
          return Math.min(prev + increment, currentSteps);
        });
      }, 50);
    }

    return () => {
      if (stepInterval) clearInterval(stepInterval);
    };
  }, [currentSteps, progress]);

  useEffect(() => {
    if (isGoalReached) {
      // Celebration animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }
  }, [isGoalReached]);

  const getMotivationalMessage = () => {
    if (isGoalReached) {
      return "🎉 Goal Achieved! Amazing work!";
    } else if (progress >= 75) {
      return "🔥 Almost there! Keep going!";
    } else if (progress >= 50) {
      return "💪 Great progress! You're doing well!";
    } else if (progress >= 25) {
      return "🚶‍♀️ Good start! Keep moving!";
    } else {
      return "👟 Let's start walking!";
    }
  };

  const getCharacterType = () => {
    if (isGoalReached) return 'celebrating';
    if (progress >= 75) return 'walking';
    return 'walking';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="walk" size={24} color="#4CAF50" />
          <Text style={styles.title}>Daily Steps</Text>
        </View>
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>Goal: {goalSteps.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <AnimatedCharacter
          type={getCharacterType()}
          size={80}
          color={isGoalReached ? '#4CAF50' : '#E91E63'}
          showText={false}
        />

        <View style={styles.statsContainer}>
          <Animated.View
            style={[
              styles.stepNumber,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Text style={styles.stepCount}>
              {animatedSteps.toLocaleString()}
            </Text>
            <Text style={styles.stepLabel}>steps</Text>
          </Animated.View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: isGoalReached ? '#4CAF50' : '#E91E63',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progress)}% Complete
            </Text>
          </View>

          <Text style={styles.motivationalText}>
            {getMotivationalMessage()}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.achievementContainer}>
          {isGoalReached && (
            <View style={styles.achievementBadge}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.achievementText}>Goal Reached!</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  goalContainer: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  goalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  stepNumber: {
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  stepLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: -4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  motivationalText: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  achievementText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B8860B',
    marginLeft: 4,
  },
});
