import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCharacter from './AnimatedCharacter';

const { width } = Dimensions.get('window');

export default function PeriodCalendar({ 
  cycleData = {},
  onDateSelect = () => {},
  onPeriodLog = () => {},
  onSymptomLog = () => {}
}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    currentDay = 1,
    cycleLength = 28,
    lastPeriod = null,
    nextPeriod = null,
    phase = 'Menstrual'
  } = cycleData;

  useEffect(() => {
    // Animate calendar entrance
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    generateMarkedDates();
  }, [cycleData]);

  const generateMarkedDates = () => {
    const marked = {};
    const today = new Date();
    
    // Mark current day
    const todayStr = today.toISOString().split('T')[0];
    marked[todayStr] = {
      selected: true,
      selectedColor: '#E91E63',
      selectedTextColor: 'white',
    };

    // Mark period days based on cycle phase
    if (lastPeriod) {
      const periodStart = new Date(lastPeriod);
      for (let i = 0; i < 5; i++) {
        const periodDate = new Date(periodStart);
        periodDate.setDate(periodStart.getDate() + i);
        const periodStr = periodDate.toISOString().split('T')[0];
        
        if (i === 0) {
          marked[periodStr] = {
            marked: true,
            dotColor: '#E91E63',
            activeOpacity: 0.7,
          };
        } else {
          marked[periodStr] = {
            marked: true,
            dotColor: '#F8BBD9',
            activeOpacity: 0.7,
          };
        }
      }
    }

    // Mark predicted next period
    if (nextPeriod) {
      const nextPeriodDate = new Date(nextPeriod);
      const nextStr = nextPeriodDate.toISOString().split('T')[0];
      marked[nextStr] = {
        marked: true,
        dotColor: '#FF9800',
        activeOpacity: 0.7,
      };
    }

    // Mark ovulation days
    if (lastPeriod) {
      const ovulationDate = new Date(lastPeriod);
      ovulationDate.setDate(ovulationDate.getDate() + 14);
      const ovulationStr = ovulationDate.toISOString().split('T')[0];
      marked[ovulationStr] = {
        marked: true,
        dotColor: '#4CAF50',
        activeOpacity: 0.7,
      };
    }

    setMarkedDates(marked);
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

  const getPhaseGradient = (phase) => {
    switch (phase) {
      case 'Menstrual': return ['#E91E63', '#F8BBD9'];
      case 'Follicular': return ['#9C27B0', '#E1BEE7'];
      case 'Ovulation': return ['#FF9800', '#FFE0B2'];
      case 'Luteal': return ['#4CAF50', '#C8E6C9'];
      default: return ['#E91E63', '#F8BBD9'];
    }
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'Menstrual': return 'water';
      case 'Follicular': return 'leaf';
      case 'Ovulation': return 'sunny';
      case 'Luteal': return 'flower';
      default: return 'water';
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    onDateSelect(day);
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
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Header with Phase Info */}
      <View style={[styles.header, { backgroundColor: getPhaseColor(phase) }]}>
        <View style={styles.phaseInfo}>
          <AnimatedCharacter
            type={getPhaseIcon(phase)}
            size={50}
            color="white"
            showText={false}
          />
          <View style={styles.phaseText}>
            <Text style={styles.phaseName}>{phase} Phase</Text>
            <Text style={styles.dayText}>Day {currentDay} of {cycleLength}</Text>
          </View>
        </View>
        <View style={styles.cycleStats}>
          <Text style={styles.statsText}>Cycle Length: {cycleLength} days</Text>
          {nextPeriod && (
            <Text style={styles.statsText}>
              Next: {Math.ceil((new Date(nextPeriod) - new Date()) / (1000 * 60 * 60 * 24))} days
            </Text>
          )}
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={currentMonth.toISOString().split('T')[0]}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={calendarTheme}
          style={styles.calendar}
          hideExtraDays={true}
          firstDay={1}
          showWeekNumbers={false}
          disableMonthChange={false}
          enableSwipeMonths={true}
          markingType={'multi-dot'}
        />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E91E63' }]} />
            <Text style={styles.legendText}>Period Start</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F8BBD9' }]} />
            <Text style={styles.legendText}>Period Days</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Ovulation</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Predicted Period</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#E91E63' }]}
          onPress={onPeriodLog}
          activeOpacity={0.8}
        >
          <Ionicons name="water" size={20} color="white" />
          <Text style={styles.actionText}>Log Period</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
          onPress={onSymptomLog}
          activeOpacity={0.8}
        >
          <Ionicons name="medical" size={20} color="white" />
          <Text style={styles.actionText}>Log Symptoms</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Date Info */}
      {selectedDate && (
        <Animated.View style={styles.selectedDateInfo}>
          <Text style={styles.selectedDateTitle}>Selected Date</Text>
          <Text style={styles.selectedDateText}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseText: {
    marginLeft: 16,
    flex: 1,
  },
  phaseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cycleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  calendarContainer: {
    padding: 16,
  },
  calendar: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  legend: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  selectedDateInfo: {
    padding: 16,
    backgroundColor: '#FFF5F8',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  selectedDateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#333',
  },
});


