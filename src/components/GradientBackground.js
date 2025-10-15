import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function GradientBackground({ 
  type = 'default',
  children,
  style = {}
}) {
  const getGradientColors = () => {
    switch (type) {
      case 'home':
        return ['#FFF5F8', '#F8E8F0', '#F0D6E8'];
      case 'period':
        return ['#E91E63', '#F8BBD9', '#FFF5F8'];
      case 'follicular':
        return ['#9C27B0', '#E1BEE7', '#F3E5F5'];
      case 'ovulation':
        return ['#FF9800', '#FFE0B2', '#FFF8E1'];
      case 'luteal':
        return ['#4CAF50', '#C8E6C9', '#F1F8E9'];
      case 'card':
        return ['#FFFFFF', '#F8F9FA', '#F1F3F4'];
      case 'success':
        return ['#4CAF50', '#81C784', '#A5D6A7'];
      case 'warning':
        return ['#FF9800', '#FFB74D', '#FFCC80'];
      case 'error':
        return ['#F44336', '#EF5350', '#E57373'];
      default:
        return ['#FFF5F8', '#F8E8F0', '#F0D6E8'];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

