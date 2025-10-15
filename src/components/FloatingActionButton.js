import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FloatingActionButton({ 
  onPress = () => {},
  icon = 'add',
  size = 'large',
  color = 'primary',
  position = 'bottom-right',
  animated = true
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      // Entrance animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated]);

  const getGradientColors = () => {
    switch (color) {
      case 'primary':
        return ['#667eea', '#764ba2'];
      case 'secondary':
        return ['#f093fb', '#f5576c'];
      case 'success':
        return ['#4facfe', '#00f2fe'];
      case 'warning':
        return ['#fa709a', '#fee140'];
      case 'info':
        return ['#a8edea', '#fed6e3'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 48;
      case 'medium':
        return 56;
      case 'large':
        return 64;
      default:
        return 64;
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'bottom-right':
        return { bottom: 20, right: 20 };
      case 'bottom-left':
        return { bottom: 20, left: 20 };
      case 'bottom-center':
        return { bottom: 20, alignSelf: 'center' };
      case 'top-right':
        return { top: 20, right: 20 };
      case 'top-left':
        return { top: 20, left: 20 };
      default:
        return { bottom: 20, right: 20 };
    }
  };

  const handlePress = () => {
    // Rotation animation on press
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const buttonSize = getSize();
  const positionStyle = getPosition();

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        {
          transform: [
            { scale: scaleAnim },
            { scale: pulseAnim },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.button, { width: buttonSize, height: buttonSize }]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={[styles.gradient, { borderRadius: buttonSize / 2 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons 
            name={icon} 
            size={buttonSize * 0.4} 
            color="white" 
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
