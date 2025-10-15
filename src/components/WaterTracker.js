import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function WaterTracker({ 
  glasses = 0, 
  goal = 8, 
  onPress = null,
  size = 120,
  strokeWidth = 8
}) {
  const [currentGlasses, setCurrentGlasses] = useState(glasses);

  useEffect(() => {
    setCurrentGlasses(glasses);
  }, [glasses]);

  const progress = Math.min((currentGlasses / goal) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    if (progress < 30) return '#ff6b6b';
    if (progress < 60) return '#ffa726';
    if (progress < 90) return '#66bb6a';
    return '#4caf50';
  };

  const getMotivationalText = () => {
    if (progress < 30) return 'Stay hydrated!';
    if (progress < 60) return 'Keep drinking!';
    if (progress < 90) return 'Almost there!';
    return 'Great job!';
  };

  const addGlass = () => {
    if (currentGlasses < goal) {
      setCurrentGlasses(prev => prev + 1);
    }
  };

  const removeGlass = () => {
    if (currentGlasses > 0) {
      setCurrentGlasses(prev => prev - 1);
    }
  };

  const CardContent = () => (
    <View style={[styles.container, { width: size + 40, height: size + 40 }]}>
      <View style={styles.content}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Center Content */}
        <View style={styles.centerContent}>
          <Text style={[styles.glassCount, { color: getProgressColor() }]}>
            {currentGlasses}
          </Text>
          <Text style={styles.glassLabel}>glasses</Text>
          <Text style={styles.motivationalText}>
            {getMotivationalText()}
          </Text>
        </View>
      </View>
      
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, { opacity: currentGlasses > 0 ? 1 : 0.3 }]}
          onPress={removeGlass}
          disabled={currentGlasses === 0}
        >
          <Ionicons name="remove" size={20} color="#ff6b6b" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, { opacity: currentGlasses < goal ? 1 : 0.3 }]}
          onPress={addGlass}
          disabled={currentGlasses >= goal}
        >
          <Ionicons name="add" size={20} color="#4caf50" />
        </TouchableOpacity>
      </View>
      
      {/* Goal Progress */}
      <View style={styles.goalContainer}>
        <Text style={styles.goalText}>
          {Math.round(progress)}% of daily goal
        </Text>
        <View style={styles.goalBar}>
          <View 
            style={[
              styles.goalProgress, 
              { 
                width: `${progress}%`,
                backgroundColor: getProgressColor()
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  glassLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 20,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalContainer: {
    marginTop: 16,
    width: '100%',
  },
  goalText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  goalBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  goalProgress: {
    height: '100%',
    borderRadius: 2,
  },
});