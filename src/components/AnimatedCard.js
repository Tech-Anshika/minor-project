import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AnimatedCard({ 
  children, 
  type = 'default',
  onPress = null,
  style = {},
  delay = 0,
  animated = true
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          delay: delay,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }
  }, [animated, delay]);

  const getGradientColors = () => {
    switch (type) {
      case 'primary':
        return ['#E91E63', '#F8BBD9'];
      case 'secondary':
        return ['#9C27B0', '#E1BEE7'];
      case 'success':
        return ['#4CAF50', '#C8E6C9'];
      case 'warning':
        return ['#FF9800', '#FFE0B2'];
      case 'info':
        return ['#2196F3', '#BBDEFB'];
      case 'period':
        return ['#E91E63', '#F8BBD9', '#FFF5F8'];
      case 'follicular':
        return ['#9C27B0', '#E1BEE7', '#F3E5F5'];
      case 'ovulation':
        return ['#FF9800', '#FFE0B2', '#FFF8E1'];
      case 'luteal':
        return ['#4CAF50', '#C8E6C9', '#F1F8E9'];
      default:
        return ['#FFFFFF', '#F8F9FA'];
    }
  };

  const CardContent = () => (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
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
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    minHeight: 100,
  },
});


