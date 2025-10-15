import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCharacter from './AnimatedCharacter';

const { width } = Dimensions.get('window');

const moods = [
  { id: 'happy', emoji: '😊', color: '#4CAF50', label: 'Happy' },
  { id: 'excited', emoji: '🤩', color: '#FF9800', label: 'Excited' },
  { id: 'calm', emoji: '😌', color: '#9C27B0', label: 'Calm' },
  { id: 'tired', emoji: '😴', color: '#607D8B', label: 'Tired' },
  { id: 'stressed', emoji: '😰', color: '#F44336', label: 'Stressed' },
  { id: 'sad', emoji: '😢', color: '#2196F3', label: 'Sad' },
];

export default function MoodTracker({ 
  currentMood = 'happy', 
  onMoodChange = () => {} 
}) {
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation when mood changes
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for selected mood
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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
  }, [selectedMood]);

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    onMoodChange(moodId);
  };

  const getCurrentMoodData = () => {
    return moods.find(mood => mood.id === selectedMood) || moods[0];
  };

  const getMotivationalMessage = () => {
    switch (selectedMood) {
      case 'happy':
        return "🌟 Your positivity is shining bright!";
      case 'excited':
        return "🚀 You're full of energy today!";
      case 'calm':
        return "🧘‍♀️ Peace and tranquility within you!";
      case 'tired':
        return "💤 Take some rest, you deserve it!";
      case 'stressed':
        return "🤗 It's okay to feel this way. Take deep breaths!";
      case 'sad':
        return "💙 This feeling will pass. You're stronger than you know!";
      default:
        return "💖 How are you feeling today?";
    }
  };

  const getCharacterType = () => {
    switch (selectedMood) {
      case 'happy':
      case 'excited':
        return 'celebrating';
      case 'calm':
        return 'yoga';
      case 'tired':
        return 'sleep';
      case 'stressed':
      case 'sad':
        return 'heart';
      default:
        return 'heart';
    }
  };

  const currentMoodData = getCurrentMoodData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="heart" size={24} color={currentMoodData.color} />
          <Text style={styles.title}>Today's Mood</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>Right now</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.characterWrapper,
            {
              transform: [
                { translateY: bounceAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <AnimatedCharacter
            type={getCharacterType()}
            size={80}
            color={currentMoodData.color}
            showText={false}
          />
        </Animated.View>

        <View style={styles.moodInfo}>
          <Text style={[styles.moodEmoji, { fontSize: 48 }]}>
            {currentMoodData.emoji}
          </Text>
          <Text style={[styles.moodLabel, { color: currentMoodData.color }]}>
            {currentMoodData.label}
          </Text>
          <Text style={styles.motivationalText}>
            {getMotivationalMessage()}
          </Text>
        </View>
      </View>

      <View style={styles.moodSelector}>
        <Text style={styles.selectorTitle}>How are you feeling?</Text>
        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodOption,
                selectedMood === mood.id && styles.selectedMoodOption,
                { borderColor: mood.color },
              ]}
              onPress={() => handleMoodSelect(mood.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.moodEmojiSmall}>{mood.emoji}</Text>
              <Text style={[
                styles.moodLabelSmall,
                selectedMood === mood.id && { color: mood.color }
              ]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  timeContainer: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E91E63',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterWrapper: {
    marginRight: 16,
  },
  moodInfo: {
    flex: 1,
    alignItems: 'center',
  },
  moodEmoji: {
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  moodSelector: {
    marginTop: 8,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: (width - 80) / 3,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    marginBottom: 8,
  },
  selectedMoodOption: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
  },
  moodEmojiSmall: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabelSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
});
