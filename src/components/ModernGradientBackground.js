import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ModernGradientBackground({ 
  type = 'default',
  children,
  style = {}
}) {
  const getGradientColors = () => {
    switch (type) {
      case 'home':
        return ['#667eea', '#764ba2', '#f093fb'];
      case 'period':
        return ['#ff9a9e', '#fecfef', '#fecfef'];
      case 'follicular':
        return ['#a8edea', '#fed6e3', '#d299c2'];
      case 'ovulation':
        return ['#ffecd2', '#fcb69f', '#ff8a80'];
      case 'luteal':
        return ['#d299c2', '#fef9d7', '#89f7fe'];
      case 'yoga':
        return ['#667eea', '#764ba2', '#f093fb'];
      case 'food':
        return ['#ff9a9e', '#fecfef', '#fecfef'];
      case 'progress':
        return ['#a8edea', '#fed6e3', '#d299c2'];
      case 'profile':
        return ['#ffecd2', '#fcb69f', '#ff8a80'];
      case 'card':
        return ['#ffffff', '#f8f9fa', '#e9ecef'];
      case 'success':
        return ['#4facfe', '#00f2fe', '#43e97b'];
      case 'warning':
        return ['#fa709a', '#fee140', '#ffecd2'];
      case 'error':
        return ['#ff6b6b', '#ee5a24', '#ff9ff3'];
      case 'more':
        return ['#f8f9fa', '#e9ecef', '#dee2e6'];
      default:
        return ['#667eea', '#764ba2', '#f093fb'];
    }
  };

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
        <View style={styles.decorativeWave1} />
        <View style={styles.decorativeWave2} />
        
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: height * 0.3,
    right: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeWave1: {
    position: 'absolute',
    top: height * 0.2,
    left: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    transform: [{ rotate: '45deg' }],
  },
  decorativeWave2: {
    position: 'absolute',
    bottom: height * 0.1,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ rotate: '-30deg' }],
  },
});


