import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ModernCard({ 
  children, 
  type = 'default',
  onPress = null,
  style = {},
  animated = true,
  shadow = true,
  gradient = true
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [animated]);

  const getGradientColors = () => {
    switch (type) {
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
      case 'period':
        return ['#ff9a9e', '#fecfef'];
      case 'follicular':
        return ['#a8edea', '#fed6e3'];
      case 'ovulation':
        return ['#ffecd2', '#fcb69f'];
      case 'luteal':
        return ['#d299c2', '#fef9d7'];
      case 'glass':
        return ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)'];
      default:
        return ['#ffffff', '#f8f9fa'];
    }
  };

  const getShadowColor = () => {
    switch (type) {
      case 'primary':
        return 'rgba(102, 126, 234, 0.3)';
      case 'secondary':
        return 'rgba(240, 147, 251, 0.3)';
      case 'success':
        return 'rgba(79, 172, 254, 0.3)';
      case 'warning':
        return 'rgba(250, 112, 154, 0.3)';
      case 'info':
        return 'rgba(168, 237, 234, 0.3)';
      default:
        return 'rgba(0, 0, 0, 0.1)';
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const CardContent = () => (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          shadowOpacity: shadow ? shadowAnim : 0,
        },
        style,
      ]}
    >
      {gradient ? (
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={[styles.content, { backgroundColor: '#ffffff' }]}>
          {children}
        </View>
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    borderRadius: 24,
    padding: 24,
    minHeight: 120,
  },
  content: {
    borderRadius: 24,
    padding: 24,
    minHeight: 120,
  },
});
