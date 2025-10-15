import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
  const getGradientColors = () => {
    switch (type) {
      case 'primary':
        return ['#667eea', '#764ba2'];
      case 'success':
        return ['#4facfe', '#00f2fe'];
      case 'warning':
        return ['#fa709a', '#fee140'];
      case 'info':
        return ['#a8edea', '#fed6e3'];
      case 'period':
        return ['#E91E63', '#F8BBD9'];
      case 'glass':
        return ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'];
      case 'secondary':
        return ['#f093fb', '#f5576c'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: 20,
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 4,
      ...style,
    };

    if (shadow) {
      baseStyle.shadowColor = '#000';
      baseStyle.shadowOffset = { width: 0, height: 4 };
      baseStyle.shadowOpacity = 0.1;
      baseStyle.shadowRadius = 8;
      baseStyle.elevation = 5;
    }

    return baseStyle;
  };

  const CardContent = () => {
    if (gradient) {
      return (
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={getCardStyle()}
        >
          {children}
        </LinearGradient>
      );
    }

    return (
      <View style={[getCardStyle(), { backgroundColor: '#fff' }]}>
        {children}
      </View>
    );
  };

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
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});