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
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import ModernGradientBackground from '../components/ModernGradientBackground';
import ModernCard from '../components/ModernCard';
import ModernProgressRing from '../components/ModernProgressRing';

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
    
    if (history && history.length > 0) {
      history.forEach(entry => {
        const dateStr = entry.date.toDate().toISOString().split('T')[0];
        marked[dateStr] = {
          marked: true,
          dotColor: getFlowColor(entry.flow),
          activeOpacity: 0.7,
        };
      });
    }

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
    if (periodHistory && periodHistory.length >= 2) {
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
        date: Timestamp.fromDate(new Date(selectedDate)),
        flow: periodData.flow,
        symptoms: periodData.symptoms,
        mood: periodData.mood,
        pain: periodData.pain,
        comments: periodData.comments,
        duration: periodData.duration,
        timestamp: Timestamp.now(),
      };

      if (auth.currentUser) {
        await addDoc(collection(db, 'periodLogs', auth.currentUser.uid, 'entries'), periodEntry);
        Alert.alert('Success', 'Period logged successfully! 🌸');
        
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
    <ModernGradientBackground type="period">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.headerContent}>
            <View style={styles.titleSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={28} color="white" />
              </View>
              <View style={styles.titleText}>
                <Text style={styles.modernTitle}>Period Tracker</Text>
                <Text style={styles.modernSubtitle}>Track your cycle & symptoms</Text>
              </View>
            </View>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>🌸</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Calendar Card */}
        <ModernCard type="glass" style={styles.calendarCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="calendar" size={24} color="#E91E63" />
              <Text style={styles.cardTitle}>Select Date</Text>
            </View>
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </View>
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
        </ModernCard>

        {/* Flow Intensity Card */}
        <ModernCard type="period" style={styles.flowCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="water" size={24} color="white" />
              <Text style={styles.cardTitleWhite}>Flow Intensity</Text>
            </View>
            <View style={styles.flowIndicator}>
              <Text style={styles.flowIndicatorText}>
                {flowOptions.find(f => f.id === periodData.flow)?.label}
              </Text>
            </View>
          </View>
          <View style={styles.flowOptions}>
            {flowOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.flowOption,
                  periodData.flow === option.id && styles.selectedFlowOption,
                ]}
                onPress={() => setPeriodData(prev => ({ ...prev, flow: option.id }))}
              >
                <View style={[
                  styles.flowIconContainer,
                  { backgroundColor: periodData.flow === option.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }
                ]}>
                  <Ionicons name={option.icon} size={24} color="white" />
                </View>
                <Text style={styles.flowLabel}>
                  {option.label}
                </Text>
                {periodData.flow === option.id && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ModernCard>

        {/* Symptoms Card */}
        <ModernCard type="info" style={styles.symptomsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="medical" size={24} color="#0d9488" />
              <Text style={styles.cardTitleColored}>Symptoms</Text>
            </View>
            <Text style={styles.symptomsSubtitle}>Select all that apply</Text>
          </View>
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
                <View style={[
                  styles.symptomIconContainer,
                  { backgroundColor: periodData.symptoms.includes(symptom.id) ? '#0d9488' : '#f0f9ff' }
                ]}>
                  <Ionicons 
                    name={symptom.icon} 
                    size={20} 
                    color={periodData.symptoms.includes(symptom.id) ? 'white' : '#0d9488'} 
                  />
                </View>
                <Text style={[
                  styles.symptomLabel,
                  periodData.symptoms.includes(symptom.id) && styles.selectedSymptomLabel
                ]}>
                  {symptom.label}
                </Text>
                {periodData.symptoms.includes(symptom.id) && (
                  <View style={styles.symptomCheckmark}>
                    <Ionicons name="checkmark-circle" size={16} color="#0d9488" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ModernCard>

        {/* Mood Card */}
        <ModernCard type="warning" style={styles.moodCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="heart" size={24} color="#be185d" />
              <Text style={styles.cardTitleColored}>Mood</Text>
            </View>
            <View style={styles.moodIndicator}>
              <Text style={styles.moodIndicatorText}>
                {moodOptions.find(m => m.id === periodData.mood)?.emoji} {moodOptions.find(m => m.id === periodData.mood)?.label}
              </Text>
            </View>
          </View>
          <View style={styles.moodOptions}>
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodOption,
                  periodData.mood === mood.id && styles.selectedMoodOption,
                ]}
                onPress={() => setPeriodData(prev => ({ ...prev, mood: mood.id }))}
              >
                <View style={[
                  styles.moodEmojiContainer,
                  { backgroundColor: periodData.mood === mood.id ? '#be185d' : '#fef2f2' }
                ]}>
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                </View>
                <Text style={[
                  styles.moodLabel,
                  periodData.mood === mood.id && styles.selectedMoodLabel
                ]}>
                  {mood.label}
                </Text>
                {periodData.mood === mood.id && (
                  <View style={styles.moodCheckmark}>
                    <Ionicons name="checkmark-circle" size={16} color="#be185d" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ModernCard>

        {/* Pain Level Card */}
        <ModernCard type="success" style={styles.painCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="medical" size={24} color="#1e3a8a" />
              <Text style={styles.cardTitleColored}>Pain Level</Text>
            </View>
            <View style={styles.painIndicator}>
              <Text style={styles.painIndicatorText}>
                {periodData.pain === 0 ? 'No Pain' : 
                 periodData.pain <= 3 ? 'Mild' :
                 periodData.pain <= 6 ? 'Moderate' : 'Severe'}
              </Text>
            </View>
          </View>
          
          <View style={styles.painContent}>
            <View style={styles.painDisplay}>
              <ModernProgressRing
                progress={(periodData.pain / 10) * 100}
                size={120}
                color="#1e3a8a"
                backgroundColor="#E5E7EB"
                showPercentage={false}
                centerText={periodData.pain.toString()}
              />
            </View>
            
            <View style={styles.painScale}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.painDot,
                    level <= periodData.pain && styles.activePainDot,
                    { backgroundColor: level <= periodData.pain ? '#1e3a8a' : '#E5E7EB' }
                  ]}
                  onPress={() => setPeriodData(prev => ({ ...prev, pain: level }))}
                />
              ))}
            </View>
            
            <View style={styles.painLabels}>
              <Text style={styles.painLabelStart}>No Pain</Text>
              <Text style={styles.painLabelEnd}>Severe Pain</Text>
            </View>
          </View>
        </ModernCard>

        {/* Comments Card */}
        <ModernCard type="glass" style={styles.commentsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="chatbubble" size={24} color="#4338ca" />
              <Text style={styles.cardTitleColored}>Comments</Text>
            </View>
          </View>
          <TextInput
            style={styles.commentsInput}
            value={periodData.comments}
            onChangeText={(text) => setPeriodData(prev => ({ ...prev, comments: text }))}
            placeholder="Add any additional notes about your period..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ModernCard>

        {/* Predictions Card */}
        {Object.keys(predictions).length > 0 && (
          <ModernCard type="info" style={styles.predictionsCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Ionicons name="analytics" size={24} color="#0d9488" />
                <Text style={styles.cardTitleColored}>Cycle Predictions</Text>
              </View>
            </View>
            <View style={styles.predictionContainer}>
              <View style={styles.predictionItem}>
                <View style={styles.predictionIconContainer}>
                  <Ionicons name="calendar" size={20} color="#0d9488" />
                </View>
                <View style={styles.predictionContent}>
                  <Text style={styles.predictionLabel}>Next Period</Text>
                  <Text style={styles.predictionValue}>
                    {new Date(predictions.nextPeriod).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.predictionItem}>
                <View style={styles.predictionIconContainer}>
                  <Ionicons name="sunny" size={20} color="#0d9488" />
                </View>
                <View style={styles.predictionContent}>
                  <Text style={styles.predictionLabel}>Ovulation</Text>
                  <Text style={styles.predictionValue}>
                    {new Date(predictions.ovulation).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.predictionItem}>
                <View style={styles.predictionIconContainer}>
                  <Ionicons name="time" size={20} color="#0d9488" />
                </View>
                <View style={styles.predictionContent}>
                  <Text style={styles.predictionLabel}>Cycle Length</Text>
                  <Text style={styles.predictionValue}>{predictions.cycleLength} days</Text>
                </View>
              </View>
            </View>
          </ModernCard>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePeriod}>
          <View style={styles.saveButtonContent}>
            <Ionicons name="save" size={24} color="white" />
            <Text style={styles.saveButtonText}>Save Period Log</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ModernGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  // Modern Header
  modernHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  titleText: {
    flex: 1,
  },
  modernTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modernSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 35,
  },
  
  // Card Styles
  calendarCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  flowCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  symptomsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  moodCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  painCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  commentsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  predictionsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  
  // Card Headers
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginLeft: 12,
  },
  cardTitleWhite: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  cardTitleColored: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 12,
  },
  
  // Calendar
  selectedDateContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
  },
  calendar: {
    borderRadius: 12,
  },
  
  // Flow Options
  flowIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  flowIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  flowOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  flowOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedFlowOption: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  flowIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  flowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  
  // Symptoms
  symptomsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  symptomOption: {
    width: (width - 80) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedSymptomOption: {
    backgroundColor: '#F0FDF4',
    borderColor: '#0d9488',
  },
  symptomIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  symptomLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  selectedSymptomLabel: {
    color: '#0d9488',
    fontWeight: '600',
  },
  symptomCheckmark: {
    marginLeft: 4,
  },
  
  // Mood
  moodIndicator: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  moodIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#be185d',
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodOption: {
    width: (width - 100) / 3,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedMoodOption: {
    backgroundColor: '#FEF2F2',
    borderColor: '#be185d',
  },
  moodEmojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedMoodLabel: {
    color: '#be185d',
  },
  moodCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  
  // Pain Level
  painIndicator: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  painIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  painContent: {
    alignItems: 'center',
  },
  painDisplay: {
    marginBottom: 20,
  },
  painScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  painDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  activePainDot: {
    shadowColor: '#1e3a8a',
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
    color: '#6B7280',
  },
  painLabelEnd: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Comments
  commentsInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#F8FAFC',
    minHeight: 100,
  },
  
  // Predictions
  predictionContainer: {
    gap: 16,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
  },
  predictionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0d9488',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  predictionContent: {
    flex: 1,
  },
  predictionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d9488',
  },
  
  // Save Button
  saveButton: {
    backgroundColor: '#E91E63',
    margin: 20,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
