import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
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

  const getCharacterText = () => {
    switch (type) {
      case 'walking':
        return 'Keep walking!';
      case 'water':
        return 'Stay hydrated!';
      case 'yoga':
        return 'Namaste!';
      case 'celebrating':
        return 'Amazing!';
      default:
        return '';
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.characterContainer,
          {
            width: size,
            height: size,
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

              {/* Water droplets for water type */}
              {type === 'water' && (
                <>
                  <View style={[styles.particle, styles.waterDrop1]}>
                    <Text style={styles.particleText}>💧</Text>
                  </View>
                  <View style={[styles.particle, styles.waterDrop2]}>
                    <Text style={styles.particleText}>💧</Text>
                  </View>
                  <View style={[styles.particle, styles.waterDrop3]}>
                    <Text style={styles.particleText}>💧</Text>
                  </View>
                </>
              )}

              {/* Walking steps for walking type */}
              {type === 'walking' && (
                <>
                  <View style={[styles.particle, styles.step1]}>
                    <Text style={styles.particleText}>👣</Text>
                  </View>
                  <View style={[styles.particle, styles.step2]}>
                    <Text style={styles.particleText}>👣</Text>
                  </View>
                </>
              )}
      </View>
      
            {showText && (text || getCharacterText()) && (
              <View style={styles.textContainer}>
                <Text style={styles.characterText}>{text || getCharacterText()}</Text>
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
        waterDrop1: {
          top: -5,
          right: 10,
        },
        waterDrop2: {
          top: 10,
          right: -5,
        },
        waterDrop3: {
          top: 20,
          left: 10,
        },
        step1: {
          bottom: -5,
          left: -15,
        },
        step2: {
          bottom: 5,
          right: -15,
        },
        particleText: {
          fontSize: 16,
        },
});
