import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function YogaScreen() {
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [yogaPoses, setYogaPoses] = useState([]);

  const phases = ['All', 'Menstrual', 'Follicular', 'Ovulation', 'Luteal'];

  const yogaData = [
    {
      id: 1,
      name: 'Child\'s Pose (Balasana)',
      phase: 'Menstrual',
      duration: '5-10 minutes',
      benefits: ['Relieves menstrual cramps', 'Reduces stress', 'Calms the mind'],
      description: 'A gentle resting pose that helps relieve menstrual cramps and stress.',
      image: '🧘‍♀️',
    },
    {
      id: 2,
      name: 'Cat-Cow Stretch',
      phase: 'Menstrual',
      duration: '3-5 minutes',
      benefits: ['Improves spine flexibility', 'Relieves back pain', 'Massages reproductive organs'],
      description: 'Gentle spinal movement that helps with menstrual discomfort.',
      image: '🐱',
    },
    {
      id: 3,
      name: 'Warrior II (Virabhadrasana II)',
      phase: 'Follicular',
      duration: '30-60 seconds each side',
      benefits: ['Strengthens legs', 'Improves balance', 'Boosts energy'],
      description: 'A powerful standing pose that builds strength and confidence.',
      image: '⚔️',
    },
    {
      id: 4,
      name: 'Tree Pose (Vrikshasana)',
      phase: 'Follicular',
      duration: '30-60 seconds each side',
      benefits: ['Improves balance', 'Strengthens core', 'Enhances focus'],
      description: 'A balancing pose that helps improve concentration and stability.',
      image: '🌳',
    },
    {
      id: 5,
      name: 'Cobra Pose (Bhujangasana)',
      phase: 'Ovulation',
      duration: '15-30 seconds',
      benefits: ['Strengthens back', 'Opens chest', 'Improves circulation'],
      description: 'A gentle backbend that energizes the body during ovulation.',
      image: '🐍',
    },
    {
      id: 6,
      name: 'Bridge Pose (Setu Bandhasana)',
      phase: 'Ovulation',
      duration: '30-60 seconds',
      benefits: ['Strengthens glutes', 'Opens chest', 'Improves thyroid function'],
      description: 'A gentle backbend that helps with hormonal balance.',
      image: '🌉',
    },
    {
      id: 7,
      name: 'Legs Up the Wall (Viparita Karani)',
      phase: 'Luteal',
      duration: '5-15 minutes',
      benefits: ['Reduces swelling', 'Relieves stress', 'Improves circulation'],
      description: 'A restorative pose perfect for the luteal phase.',
      image: '🦵',
    },
    {
      id: 8,
      name: 'Seated Forward Bend (Paschimottanasana)',
      phase: 'Luteal',
      duration: '1-3 minutes',
      benefits: ['Calms nervous system', 'Stretches spine', 'Relieves anxiety'],
      description: 'A calming forward bend that helps with premenstrual symptoms.',
      image: '🧘',
    },
  ];

  useEffect(() => {
    filterYogaPoses();
  }, [selectedPhase]);

  const filterYogaPoses = () => {
    if (selectedPhase === 'All') {
      setYogaPoses(yogaData);
    } else {
      setYogaPoses(yogaData.filter(pose => pose.phase === selectedPhase));
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Menstrual': return '#E91E63';
      case 'Follicular': return '#9C27B0';
      case 'Ovulation': return '#FF9800';
      case 'Luteal': return '#4CAF50';
      default: return '#E91E63';
    }
  };

  const startYogaSession = (pose) => {
    // TODO: Implement yoga session timer
    alert(`Starting ${pose.name} session for ${pose.duration}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧘‍♀️ Yoga & Exercise</Text>
        <Text style={styles.subtitle}>AI-suggested poses for your cycle phase</Text>
      </View>

      {/* Phase Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.phaseFilter}
        contentContainerStyle={styles.phaseFilterContent}
      >
        {phases.map((phase) => (
          <TouchableOpacity
            key={phase}
            style={[
              styles.phaseButton,
              selectedPhase === phase && styles.selectedPhaseButton,
            ]}
            onPress={() => setSelectedPhase(phase)}
          >
            <Text style={[
              styles.phaseButtonText,
              selectedPhase === phase && styles.selectedPhaseButtonText,
            ]}>
              {phase}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Yoga Poses List */}
      <View style={styles.posesContainer}>
        {yogaPoses.map((pose) => (
          <View key={pose.id} style={styles.poseCard}>
            <View style={styles.poseHeader}>
              <View style={styles.poseImageContainer}>
                <Text style={styles.poseEmoji}>{pose.image}</Text>
              </View>
              <View style={styles.poseInfo}>
                <Text style={styles.poseName}>{pose.name}</Text>
                <View style={styles.poseMeta}>
                  <View style={[styles.phaseTag, { backgroundColor: getPhaseColor(pose.phase) }]}>
                    <Text style={styles.phaseTagText}>{pose.phase}</Text>
                  </View>
                  <Text style={styles.duration}>{pose.duration}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.poseDescription}>{pose.description}</Text>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits:</Text>
              {pose.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => startYogaSession(pose)}
            >
              <Ionicons name="play" size={20} color="white" />
              <Text style={styles.startButtonText}>Start Session</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Quick Tips */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb" size={24} color="#FF9800" />
          <Text style={styles.tipsTitle}>Quick Tips</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.tipText}>Practice for at least 15-20 minutes daily</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="water" size={16} color="#666" />
          <Text style={styles.tipText}>Stay hydrated before and after practice</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="heart" size={16} color="#666" />
          <Text style={styles.tipText}>Listen to your body and modify poses as needed</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  phaseFilter: {
    marginBottom: 20,
  },
  phaseFilterContent: {
    paddingHorizontal: 20,
  },
  phaseButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPhaseButton: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  phaseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedPhaseButtonText: {
    color: 'white',
  },
  posesContainer: {
    paddingHorizontal: 20,
  },
  poseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  poseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  poseImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  poseEmoji: {
    fontSize: 32,
  },
  poseInfo: {
    flex: 1,
  },
  poseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  poseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  phaseTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  poseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
});

