import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function ModernProgressRing({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  color = '#667eea',
  backgroundColor = '#E0E0E0',
  showPercentage = true,
  centerText = '',
  animated = true
}) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      progressAnim.setValue(progress);
      scaleAnim.setValue(1);
    }
  }, [progress, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <Animated.View>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: [circumference, 0],
            })}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Animated.View>
      </Svg>
      
      {/* Center Content */}
      <View style={styles.centerContent}>
        {showPercentage && (
          <Text style={[styles.percentage, { color }]}>
            {Math.round(progress)}%
          </Text>
        )}
        {centerText && (
          <Text style={[styles.centerText, { color }]}>
            {centerText}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
