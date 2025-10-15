import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AnimatedCharacter({ 
  type = 'walking', 
  size = 80, 
  color = '#E91E63',
  showText = true,
  text = '',
  style = {}
}) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const walkAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Disable animations temporarily to fix conflicts
    bounceAnim.setValue(0);
    walkAnim.setValue(0);
    pulseAnim.setValue(1);
  }, [type]);

  const getCharacterIcon = () => {
    switch (type) {
      case 'walking':
        return 'walk';
      case 'celebrating':
        return 'happy';
      case 'yoga':
        return 'fitness';
      case 'water':
        return 'water';
      case 'food':
        return 'restaurant';
      case 'sleep':
        return 'moon';
      case 'heart':
        return 'heart';
      default:
        return 'person';
    }
  };

  const getCharacterEmoji = () => {
    switch (type) {
      case 'walking':
        return '🚶‍♀️';
      case 'celebrating':
        return '🎉';
      case 'yoga':
        return '🧘‍♀️';
      case 'water':
        return '💧';
      case 'food':
        return '🍎';
      case 'sleep':
        return '😴';
      case 'heart':
        return '💖';
      default:
        return '👩';
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.characterContainer,
          {
            width: size,
            height: size,
            transform: [
              { translateY: bounceAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <View style={[styles.character, { backgroundColor: color }]}>
          <Text style={[styles.emoji, { fontSize: size * 0.6 }]}>
            {getCharacterEmoji()}
          </Text>
        </View>
        
        {/* Floating particles for celebration */}
        {type === 'celebrating' && (
          <>
            <View style={[styles.particle, styles.particle1]}>
              <Text style={styles.particleText}>✨</Text>
            </View>
            <View style={[styles.particle, styles.particle2]}>
              <Text style={styles.particleText}>⭐</Text>
            </View>
          </>
        )}
      </Animated.View>
      
      {showText && text && (
        <View style={styles.textContainer}>
          <Text style={styles.characterText}>{text}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emoji: {
    textAlign: 'center',
  },
  textContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E63',
    textAlign: 'center',
  },
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle1: {
    top: -10,
    right: -10,
  },
  particle2: {
    top: -15,
    left: -10,
  },
  particleText: {
    fontSize: 16,
  },
});
