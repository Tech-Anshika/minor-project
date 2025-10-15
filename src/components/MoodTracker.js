import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MoodTracker({ 
  mood = 'neutral', 
  onPress = null,
  size = 120
}) {
  const [currentMood, setCurrentMood] = useState(mood);

  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  const moods = [
    { id: 'very-sad', emoji: '😢', color: '#ff6b6b', label: 'Very Sad' },
    { id: 'sad', emoji: '😔', color: '#ffa726', label: 'Sad' },
    { id: 'neutral', emoji: '😐', color: '#ffc107', label: 'Neutral' },
    { id: 'happy', emoji: '😊', color: '#66bb6a', label: 'Happy' },
    { id: 'very-happy', emoji: '😄', color: '#4caf50', label: 'Very Happy' },
  ];

  const currentMoodData = moods.find(m => m.id === currentMood) || moods[2];

  const getMotivationalText = () => {
    switch (currentMood) {
      case 'very-sad':
        return 'It\'s okay to feel this way. Take care of yourself.';
      case 'sad':
        return 'This feeling will pass. You\'re stronger than you know.';
      case 'neutral':
        return 'A balanced mood is perfectly fine.';
      case 'happy':
        return 'Great to see you feeling good!';
      case 'very-happy':
        return 'Your happiness is contagious!';
      default:
        return 'How are you feeling today?';
    }
  };

  const CardContent = () => (
    <View style={[styles.container, { width: size + 40, height: size + 40 }]}>
      <View style={styles.content}>
        {/* Mood Display */}
        <View style={[styles.moodCircle, { backgroundColor: currentMoodData.color }]}>
          <Text style={styles.moodEmoji}>{currentMoodData.emoji}</Text>
        </View>
        
        {/* Mood Info */}
        <View style={styles.moodInfo}>
          <Text style={[styles.moodLabel, { color: currentMoodData.color }]}>
            {currentMoodData.label}
          </Text>
          <Text style={styles.motivationalText}>
            {getMotivationalText()}
          </Text>
        </View>
      </View>
      
      {/* Mood Selector */}
      <View style={styles.moodSelector}>
        {moods.map((moodItem) => (
          <TouchableOpacity
            key={moodItem.id}
            style={[
              styles.moodButton,
              {
                backgroundColor: currentMood === moodItem.id 
                  ? moodItem.color 
                  : '#f5f5f5',
                borderColor: currentMood === moodItem.id 
                  ? moodItem.color 
                  : '#e0e0e0',
              }
            ]}
            onPress={() => setCurrentMood(moodItem.id)}
          >
            <Text style={styles.moodButtonEmoji}>{moodItem.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  moodCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodInfo: {
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  moodButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  moodButtonEmoji: {
    fontSize: 20,
  },
});