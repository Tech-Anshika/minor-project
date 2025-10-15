import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FloatingActionButton({
  onPress,
  icon = 'add',
  color = 'primary',
  position = 'bottom-right',
  size = 56,
  style = {}
}) {
  const getColor = () => {
    switch (color) {
      case 'primary':
        return '#667eea';
      case 'secondary':
        return '#f093fb';
      case 'success':
        return '#4facfe';
      case 'warning':
        return '#fa709a';
      case 'info':
        return '#a8edea';
      default:
        return '#667eea';
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'bottom-right':
        return {
          position: 'absolute',
          bottom: 20,
          right: 20,
        };
      case 'bottom-left':
        return {
          position: 'absolute',
          bottom: 20,
          left: 20,
        };
      case 'top-right':
        return {
          position: 'absolute',
          top: 20,
          right: 20,
        };
      case 'top-left':
        return {
          position: 'absolute',
          top: 20,
          left: 20,
        };
      default:
        return {
          position: 'absolute',
          bottom: 20,
          right: 20,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getColor(),
          ...getPosition(),
          ...style,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={size * 0.5} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});