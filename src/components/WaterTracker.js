import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCharacter from './AnimatedCharacter';

const { width } = Dimensions.get('window');

export default function WaterTracker({ 
  currentGlasses = 0, 
  goalGlasses = 8, 
  onAddGlass = () => {} 
}) {
  const [animatedGlasses, setAnimatedGlasses] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glassAnim = useRef(new Animated.Value(0)).current;
  const splashAnim = useRef(new Animated.Value(0)).current;

  const progress = Math.min((currentGlasses / goalGlasses) * 100, 100);
  const isGoalReached = currentGlasses >= goalGlasses;

  useEffect(() => {
    // Animate progress
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Animate glass filling
    Animated.timing(glassAnim, {
      toValue: currentGlasses,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Animate glass counter
    let glassInterval;
    if (currentGlasses > animatedGlasses) {
      glassInterval = setInterval(() => {
        setAnimatedGlasses(prev => {
          const increment = Math.ceil((currentGlasses - prev) / 10);
          return Math.min(prev + increment, currentGlasses);
        });
      }, 100);
    }

    return () => {
      if (glassInterval) clearInterval(glassInterval);
    };
  }, [currentGlasses, progress]);

  const handleAddGlass = () => {
    // Splash animation
    Animated.sequence([
      Animated.timing(splashAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(splashAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onAddGlass();
  };

  const getMotivationalMessage = () => {
    if (isGoalReached) {
      return "💧 Hydration Master! You're amazing!";
    } else if (progress >= 75) {
      return "🌊 Almost there! Just a bit more!";
    } else if (progress >= 50) {
      return "💦 Great job! Keep hydrating!";
    } else if (progress >= 25) {
      return "🚰 Good start! Keep drinking water!";
    } else {
      return "💧 Let's stay hydrated today!";
    }
  };

  const getCharacterType = () => {
    if (isGoalReached) return 'celebrating';
    if (progress >= 75) return 'water';
    return 'water';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="water" size={24} color="#2196F3" />
          <Text style={styles.title}>Water Intake</Text>
        </View>
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>Goal: {goalGlasses} glasses</Text>
        </View>
      </View>

      <View style={styles.content}>
        <AnimatedCharacter
          type={getCharacterType()}
          size={80}
          color={isGoalReached ? '#4CAF50' : '#2196F3'}
          showText={false}
        />

        <View style={styles.statsContainer}>
          <View style={styles.glassContainer}>
            <Text style={styles.glassCount}>
              {animatedGlasses} / {goalGlasses}
            </Text>
            <Text style={styles.glassLabel}>glasses</Text>
          </View>

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
                    backgroundColor: isGoalReached ? '#4CAF50' : '#2196F3',
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
        <TouchableOpacity
          style={[
            styles.addButton,
            isGoalReached && styles.disabledButton
          ]}
          onPress={handleAddGlass}
          disabled={isGoalReached}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.buttonContent,
              {
                transform: [
                  {
                    scale: splashAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons 
              name="add-circle" 
              size={24} 
              color={isGoalReached ? '#CCC' : 'white'} 
            />
            <Text style={[
              styles.addButtonText,
              isGoalReached && styles.disabledButtonText
            ]}>
              {isGoalReached ? 'Goal Reached!' : 'Add Glass'}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        {isGoalReached && (
          <View style={styles.achievementBadge}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.achievementText}>Hydration Goal Achieved!</Text>
          </View>
        )}
      </View>
    </View>
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
    backgroundColor: '#E3F2FD',
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
  glassContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  glassCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  glassLabel: {
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
    color: '#2196F3',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 8,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disabledButtonText: {
    color: '#999',
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
