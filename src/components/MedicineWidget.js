import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MedicineManager from '../services/MedicineManager';
import ModernCard from './ModernCard';

export default function MedicineWidget({ navigation, style = {} }) {
  const [medicines, setMedicines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [takenRecords, setTakenRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayMedicines, setTodayMedicines] = useState([]);

  useEffect(() => {
    const unsubscribeMedicines = MedicineManager.listenToMedicines(setMedicines);
    const unsubscribeSchedules = MedicineManager.listenToMedicineSchedules(setSchedules);
    
    // For taken records, we'll use a different approach since there's no direct listener
    const loadTakenRecords = async () => {
      try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        const records = await MedicineManager.getMedicineTakenRecords(startOfDay, endOfDay);
        setTakenRecords(records);
      } catch (error) {
        console.error('Error loading taken records:', error);
      }
    };
    
    loadTakenRecords();
    setIsLoading(false);

    return () => {
      unsubscribeMedicines();
      unsubscribeSchedules();
    };
  }, []);

  useEffect(() => {
    if (medicines.length > 0 && schedules.length > 0) {
      const today = new Date();
      const todayString = today.toDateString();
      const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

      // Filter schedules for today using the MedicineManager's logic
      const todaySchedules = MedicineManager.getTodaysSchedule(schedules);

      const todayMeds = todaySchedules.map(schedule => {
        const medicine = medicines.find(med => med.id === schedule.medicineId);
        if (!medicine) return null;

        const takenToday = takenRecords.find(record => 
          record.scheduleId === schedule.id && 
          record.date.toDateString() === todayString
        );

        return {
          ...schedule,
          medicine,
          takenToday: !!takenToday,
          takenAt: takenToday?.takenAt || null,
        };
      }).filter(Boolean);

      setTodayMedicines(todayMeds);
    }
  }, [medicines, schedules, takenRecords]);

  const handleMarkTaken = async (scheduleId) => {
    try {
      await MedicineManager.markMedicineTaken(scheduleId);
      // Reload taken records after marking as taken
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      const records = await MedicineManager.getMedicineTakenRecords(startOfDay, endOfDay);
      setTakenRecords(records);
    } catch (error) {
      console.error('Error marking medicine as taken:', error);
    }
  };

  const getTimeString = (time) => {
    // Time is stored as string in format "HH:MM"
    if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    // Fallback for Timestamp objects
    const date = time.toDate();
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getNextMedicineTime = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const upcomingMedicines = todayMedicines
      .filter(med => {
        if (med.takenToday) return false;
        
        // Parse time string to minutes since midnight
        const [hours, minutes] = med.time.split(':').map(Number);
        const medicineTime = hours * 60 + minutes;
        
        return medicineTime > currentTime;
      })
      .sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        const aTime = aHours * 60 + aMinutes;
        const bTime = bHours * 60 + bMinutes;
        return aTime - bTime;
      });
    
    return upcomingMedicines.length > 0 ? upcomingMedicines[0] : null;
  };

  if (isLoading) {
    return (
      <ModernCard type="info" style={[styles.medicineCard, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#E91E63" />
          <Text style={styles.loadingText}>Loading medicines...</Text>
        </View>
      </ModernCard>
    );
  }

  const nextMedicine = getNextMedicineTime();
  const takenCount = todayMedicines.filter(med => med.takenToday).length;
  const totalCount = todayMedicines.length;

  return (
    <ModernCard type="info" style={[styles.medicineCard, style]}>
      <View style={styles.medicineHeader}>
        <View style={styles.medicineTitleContainer}>
          <Ionicons name="medical" size={24} color="white" />
          <Text style={styles.medicineTitle}>Today's Medicines</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('Medicine')}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {todayMedicines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical-outline" size={48} color="rgba(255,255,255,0.6)" />
          <Text style={styles.emptyTitle}>No medicines scheduled</Text>
          <Text style={styles.emptySubtitle}>Add your first medicine to get started</Text>
          <TouchableOpacity 
            style={styles.addFirstButton}
            onPress={() => navigation.navigate('Medicine')}
          >
            <Ionicons name="add-circle" size={20} color="#E91E63" />
            <Text style={styles.addFirstButtonText}>Add Medicine</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Progress Summary */}
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {takenCount} of {totalCount} taken today
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${totalCount > 0 ? (takenCount / totalCount) * 100 : 0}%` }
                  ]} 
                />
              </View>
            </View>
            <View style={styles.progressPercentage}>
              <Text style={styles.progressPercentageText}>
                {totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0}%
              </Text>
            </View>
          </View>

          {/* Next Medicine */}
          {nextMedicine && (
            <View style={styles.nextMedicineContainer}>
              <View style={styles.nextMedicineHeader}>
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.nextMedicineTitle}>Next Medicine</Text>
              </View>
              <View style={styles.nextMedicineInfo}>
                <Text style={styles.nextMedicineName}>{nextMedicine.medicine.name}</Text>
                <Text style={styles.nextMedicineTime}>
                  {getTimeString(nextMedicine.time)}
                </Text>
              </View>
            </View>
          )}

          {/* Medicine List */}
          <ScrollView style={styles.medicineList} showsVerticalScrollIndicator={false}>
            {todayMedicines.slice(0, 3).map((medicine, index) => (
              <View key={`${medicine.id}-${index}`} style={styles.medicineItem}>
                <View style={styles.medicineIcon}>
                  <Ionicons 
                    name={medicine.takenToday ? "checkmark-circle" : "medical"} 
                    size={20} 
                    color={medicine.takenToday ? "#4ade80" : "#a8edea"} 
                  />
                </View>
                <View style={styles.medicineInfo}>
                  <Text style={styles.medicineName}>{medicine.medicine.name}</Text>
                  <Text style={styles.medicineDetails}>
                    {medicine.medicine.dosage} {medicine.medicine.unit} • {getTimeString(medicine.time)}
                  </Text>
                  {medicine.takenToday && medicine.takenAt && (
                    <Text style={styles.takenTime}>
                      Taken at {medicine.takenAt.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </Text>
                  )}
                </View>
                {!medicine.takenToday && (
                  <TouchableOpacity 
                    style={styles.takeButton}
                    onPress={() => handleMarkTaken(medicine.id)}
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          {todayMedicines.length > 3 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Medicine')}
            >
              <Text style={styles.viewAllText}>
                View all {todayMedicines.length} medicines
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#E91E63" />
            </TouchableOpacity>
          )}
        </>
      )}
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  medicineCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  medicineTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 3,
  },
  progressPercentage: {
    marginLeft: 12,
  },
  progressPercentageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextMedicineContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  nextMedicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextMedicineTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  nextMedicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextMedicineName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextMedicineTime: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
  },
  medicineList: {
    maxHeight: 200,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  medicineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  medicineDetails: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  takenTime: {
    color: '#4ade80',
    fontSize: 11,
    marginTop: 2,
  },
  takeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});
