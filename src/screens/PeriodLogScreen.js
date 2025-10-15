import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import AnimatedCharacter from '../components/AnimatedCharacter';

const { width } = Dimensions.get('window');

export default function PeriodLogScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodData, setPeriodData] = useState({
    flow: 'medium', // light, medium, heavy
    symptoms: [],
    mood: 'normal',
    pain: 0, // 0-10 scale
    comments: '',
    duration: 1,
  });
  const [markedDates, setMarkedDates] = useState({});
  const [periodHistory, setPeriodHistory] = useState([]);
  const [predictions, setPredictions] = useState({});

  const flowOptions = [
    { id: 'light', label: 'Light', color: '#E91E63', icon: 'water' },
    { id: 'medium', label: 'Medium', color: '#C2185B', icon: 'water' },
    { id: 'heavy', label: 'Heavy', color: '#880E4F', icon: 'water' },
  ];

  const symptomOptions = [
    { id: 'cramps', label: 'Cramps', icon: 'medical' },
    { id: 'bloating', label: 'Bloating', icon: 'resize' },
    { id: 'headache', label: 'Headache', icon: 'headset' },
    { id: 'fatigue', label: 'Fatigue', icon: 'moon' },
    { id: 'mood_swings', label: 'Mood Swings', icon: 'happy' },
    { id: 'back_pain', label: 'Back Pain', icon: 'fitness' },
    { id: 'breast_tenderness', label: 'Breast Tenderness', icon: 'heart' },
    { id: 'acne', label: 'Acne', icon: 'medical' },
  ];

  const moodOptions = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: '#4CAF50' },
    { id: 'normal', label: 'Normal', emoji: '😐', color: '#FF9800' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: '#2196F3' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#F44336' },
    { id: 'irritable', label: 'Irritable', emoji: '😠', color: '#9C27B0' },
  ];

  useEffect(() => {
    loadPeriodHistory();
    generatePredictions();
  }, []);

  const loadPeriodHistory = () => {
    if (auth.currentUser) {
      const q = query(
        collection(db, 'periodLogs', auth.currentUser.uid, 'entries'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPeriodHistory(history);
        updateMarkedDates(history);
      });

      return unsubscribe;
    }
  };

  const updateMarkedDates = (history) => {
    const marked = {};
    
    history.forEach(entry => {
      const dateStr = entry.date.toDate().toISOString().split('T')[0];
      marked[dateStr] = {
        marked: true,
        dotColor: getFlowColor(entry.flow),
        activeOpacity: 0.7,
      };
    });

    setMarkedDates(marked);
  };

  const getFlowColor = (flow) => {
    switch (flow) {
      case 'light': return '#E91E63';
      case 'medium': return '#C2185B';
      case 'heavy': return '#880E4F';
      default: return '#E91E63';
    }
  };

  const generatePredictions = () => {
    if (periodHistory.length >= 2) {
      // Calculate average cycle length
      const cycles = [];
      for (let i = 0; i < periodHistory.length - 1; i++) {
        const current = periodHistory[i].date.toDate();
        const next = periodHistory[i + 1].date.toDate();
        const cycleLength = Math.floor((current - next) / (1000 * 60 * 60 * 24));
        cycles.push(cycleLength);
      }
      
      const avgCycleLength = Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length);
      const lastPeriod = periodHistory[0].date.toDate();
      const nextPeriod = new Date(lastPeriod);
      nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength);
      
      const ovulation = new Date(lastPeriod);
      ovulation.setDate(ovulation.getDate() + Math.floor(avgCycleLength / 2));
      
      setPredictions({
        nextPeriod: nextPeriod.toISOString().split('T')[0],
        ovulation: ovulation.toISOString().split('T')[0],
        cycleLength: avgCycleLength,
      });
    }
  };

  const handleSymptomToggle = (symptomId) => {
    setPeriodData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(id => id !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  const handleSavePeriod = async () => {
    try {
      const periodEntry = {
        date: new Date(selectedDate),
        flow: periodData.flow,
        symptoms: periodData.symptoms,
        mood: periodData.mood,
        pain: periodData.pain,
        comments: periodData.comments,
        duration: periodData.duration,
        timestamp: new Date(),
      };

      if (auth.currentUser) {
        await addDoc(collection(db, 'periodLogs', auth.currentUser.uid, 'entries'), periodEntry);
        Alert.alert('Success', 'Period logged successfully!');
        
        // Reset form
        setPeriodData({
          flow: 'medium',
          symptoms: [],
          mood: 'normal',
          pain: 0,
          comments: '',
          duration: 1,
        });
      }
    } catch (error) {
      console.error('Error saving period log:', error);
      Alert.alert('Error', 'Failed to save period log. Please try again.');
    }
  };

  const calendarTheme = {
    backgroundColor: 'white',
    calendarBackground: 'white',
    textSectionTitleColor: '#E91E63',
    selectedDayBackgroundColor: '#E91E63',
    selectedDayTextColor: 'white',
    todayTextColor: '#E91E63',
    dayTextColor: '#333',
    textDisabledColor: '#E0E0E0',
    dotColor: '#E91E63',
    selectedDotColor: 'white',
    arrowColor: '#E91E63',
    monthTextColor: '#E91E63',
    indicatorColor: '#E91E63',
    textDayFontWeight: '600',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AnimatedCharacter
          type="water"
          size={60}
          color="#E91E63"
          showText={false}
        />
        <Text style={styles.title}>Period Logging</Text>
        <Text style={styles.subtitle}>Track your cycle and symptoms</Text>
      </View>

      {/* Calendar */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Date</Text>
        <Calendar
          current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              selectedColor: '#E91E63',
              selectedTextColor: 'white',
            },
          }}
          theme={calendarTheme}
          style={styles.calendar}
        />
      </View>

      {/* Flow Intensity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Flow Intensity</Text>
        <View style={styles.flowOptions}>
          {flowOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.flowOption,
                periodData.flow === option.id && styles.selectedFlowOption,
                { borderColor: option.color }
              ]}
              onPress={() => setPeriodData(prev => ({ ...prev, flow: option.id }))}
            >
              <Ionicons name={option.icon} size={24} color={option.color} />
              <Text style={[styles.flowLabel, { color: option.color }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Symptoms */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Symptoms (Select all that apply)</Text>
        <View style={styles.symptomsGrid}>
          {symptomOptions.map((symptom) => (
            <TouchableOpacity
              key={symptom.id}
              style={[
                styles.symptomOption,
                periodData.symptoms.includes(symptom.id) && styles.selectedSymptomOption
              ]}
              onPress={() => handleSymptomToggle(symptom.id)}
            >
              <Ionicons 
                name={symptom.icon} 
                size={20} 
                color={periodData.symptoms.includes(symptom.id) ? '#E91E63' : '#666'} 
              />
              <Text style={[
                styles.symptomLabel,
                periodData.symptoms.includes(symptom.id) && styles.selectedSymptomLabel
              ]}>
                {symptom.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Mood */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mood</Text>
        <View style={styles.moodOptions}>
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodOption,
                periodData.mood === mood.id && styles.selectedMoodOption,
                { borderColor: mood.color }
              ]}
              onPress={() => setPeriodData(prev => ({ ...prev, mood: mood.id }))}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[styles.moodLabel, { color: mood.color }]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pain Level */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pain Level (0-10)</Text>
        <View style={styles.painSlider}>
          <Text style={styles.painValue}>{periodData.pain}</Text>
          <View style={styles.painScale}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.painDot,
                  level <= periodData.pain && styles.activePainDot,
                  { backgroundColor: level <= periodData.pain ? '#E91E63' : '#E0E0E0' }
                ]}
                onPress={() => setPeriodData(prev => ({ ...prev, pain: level }))}
              />
            ))}
          </View>
          <Text style={styles.painLabels}>
            <Text style={styles.painLabelStart}>No Pain</Text>
            <Text style={styles.painLabelEnd}>Severe Pain</Text>
          </Text>
        </View>
      </View>

      {/* Comments */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Comments</Text>
        <TextInput
          style={styles.commentsInput}
          value={periodData.comments}
          onChangeText={(text) => setPeriodData(prev => ({ ...prev, comments: text }))}
          placeholder="Add any additional notes about your period..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Predictions */}
      {Object.keys(predictions).length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cycle Predictions</Text>
          <View style={styles.predictionContainer}>
            <View style={styles.predictionItem}>
              <Ionicons name="calendar" size={20} color="#E91E63" />
              <Text style={styles.predictionLabel}>Next Period:</Text>
              <Text style={styles.predictionValue}>
                {new Date(predictions.nextPeriod).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.predictionItem}>
              <Ionicons name="sunny" size={20} color="#FF9800" />
              <Text style={styles.predictionLabel}>Ovulation:</Text>
              <Text style={styles.predictionValue}>
                {new Date(predictions.ovulation).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.predictionItem}>
              <Ionicons name="time" size={20} color="#4CAF50" />
              <Text style={styles.predictionLabel}>Cycle Length:</Text>
              <Text style={styles.predictionValue}>{predictions.cycleLength} days</Text>
            </View>
          </View>
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePeriod}>
        <Ionicons name="save" size={20} color="white" />
        <Text style={styles.saveButtonText}>Save Period Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
  },
  flowOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flowOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedFlowOption: {
    backgroundColor: '#FFF5F8',
  },
  flowLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomOption: {
    width: (width - 80) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedSymptomOption: {
    backgroundColor: '#FFF5F8',
    borderColor: '#E91E63',
  },
  symptomLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  selectedSymptomLabel: {
    color: '#E91E63',
    fontWeight: '600',
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: (width - 100) / 3,
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedMoodOption: {
    backgroundColor: '#FFF5F8',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  painSlider: {
    alignItems: 'center',
  },
  painValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 16,
  },
  painScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  painDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  activePainDot: {
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  painLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  painLabelStart: {
    fontSize: 12,
    color: '#666',
  },
  painLabelEnd: {
    fontSize: 12,
    color: '#666',
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F9FA',
  },
  predictionContainer: {
    gap: 12,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
