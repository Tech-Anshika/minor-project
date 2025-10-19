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
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModernGradientBackground from '../components/ModernGradientBackground';
import ModernCard from '../components/ModernCard';
import MedicineManager from '../services/MedicineManager';

const { width } = Dimensions.get('window');

export default function MedicineScreen() {
  const [selectedTab, setSelectedTab] = useState('today');
  const [medicines, setMedicines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [takenRecords, setTakenRecords] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const tabs = [
    { id: 'today', label: 'Today', icon: 'today' },
    { id: 'medicines', label: 'Medicines', icon: 'medical' },
    { id: 'schedules', label: 'Schedules', icon: 'time' },
    { id: 'history', label: 'History', icon: 'calendar' },
  ];

  useEffect(() => {
    loadMedicineData();
    
    // Listen to changes
    const unsubscribeMedicines = MedicineManager.listenToMedicines(setMedicines);
    const unsubscribeSchedules = MedicineManager.listenToMedicineSchedules(setSchedules);

    return () => {
      unsubscribeMedicines();
      unsubscribeSchedules();
    };
  }, []);

  const loadMedicineData = async () => {
    try {
      setIsLoading(true);
      
      const [medicinesData, schedulesData, statisticsData] = await Promise.all([
        MedicineManager.getMedicines(),
        MedicineManager.getMedicineSchedules(),
        MedicineManager.getMedicineStatistics(30),
      ]);

      setMedicines(medicinesData);
      setSchedules(schedulesData);
      setStatistics(statisticsData);

      // Load today's taken records
      const today = new Date();
      const takenRecordsData = await MedicineManager.getMedicineTakenRecords(today, today);
      setTakenRecords(takenRecordsData);

    } catch (error) {
      console.error('Error loading medicine data:', error);
      Alert.alert('Error', 'Failed to load medicine data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTodaysSchedule = () => {
    return MedicineManager.getTodaysSchedule(schedules);
  };

  const isMedicineTaken = (scheduleId) => {
    const today = new Date().toISOString().split('T')[0];
    return takenRecords.some(record => 
      record.scheduleId === scheduleId && 
      record.date.toDate().toISOString().split('T')[0] === today
    );
  };

  const handleMarkTaken = async (scheduleId) => {
    try {
      await MedicineManager.markMedicineTaken(scheduleId);
      // Refresh taken records
      const today = new Date();
      const takenRecordsData = await MedicineManager.getMedicineTakenRecords(today, today);
      setTakenRecords(takenRecordsData);
    } catch (error) {
      console.error('Error marking medicine as taken:', error);
      Alert.alert('Error', 'Failed to mark medicine as taken. Please try again.');
    }
  };

  const renderToday = () => {
    const todaysSchedule = getTodaysSchedule();
    
    return (
      <View style={styles.tabContent}>
        {/* Statistics Card */}
        <ModernCard type="glass" style={styles.statsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="analytics" size={24} color="#FF6B9D" />
              <Text style={styles.cardTitle}>Today's Overview</Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{todaysSchedule.length}</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {todaysSchedule.filter(schedule => isMedicineTaken(schedule.id)).length}
              </Text>
              <Text style={styles.statLabel}>Taken</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {todaysSchedule.length - todaysSchedule.filter(schedule => isMedicineTaken(schedule.id)).length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{statistics.adherenceRate || 0}%</Text>
              <Text style={styles.statLabel}>Adherence</Text>
            </View>
          </View>
        </ModernCard>

        {/* Today's Schedule */}
        <ModernCard type="glass" style={styles.scheduleCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="time" size={24} color="#FF6B9D" />
              <Text style={styles.cardTitle}>Today's Schedule</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddSchedule(true)}
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {todaysSchedule.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No medicines scheduled for today</Text>
              <Text style={styles.emptyStateSubtext}>Add a medicine schedule to get started</Text>
            </View>
          ) : (
            <View style={styles.scheduleList}>
              {todaysSchedule.map((schedule) => (
                <View key={schedule.id} style={styles.scheduleItem}>
                  <View style={styles.scheduleInfo}>
                    <View style={[styles.medicineIcon, { backgroundColor: schedule.color + '20' }]}>
                      <Ionicons name={schedule.icon || 'medical'} size={24} color={schedule.color} />
                    </View>
                    <View style={styles.scheduleDetails}>
                      <Text style={styles.medicineName}>{schedule.medicineName}</Text>
                      <Text style={styles.medicineDosage}>
                        {schedule.dosage} {schedule.unit}
                      </Text>
                      <Text style={styles.medicineTime}>{schedule.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.takenButton,
                      isMedicineTaken(schedule.id) ? styles.takenButtonActive : styles.takenButtonInactive
                    ]}
                    onPress={() => handleMarkTaken(schedule.id)}
                    disabled={isMedicineTaken(schedule.id)}
                  >
                    <Ionicons 
                      name={isMedicineTaken(schedule.id) ? "checkmark" : "add"} 
                      size={20} 
                      color={isMedicineTaken(schedule.id) ? "white" : "#666"} 
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ModernCard>
      </View>
    );
  };

  const renderMedicines = () => (
    <View style={styles.tabContent}>
      <ModernCard type="glass" style={styles.medicinesCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="medical" size={24} color="#FF6B9D" />
            <Text style={styles.cardTitle}>My Medicines</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddMedicine(true)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {medicines.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No medicines added yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first medicine to get started</Text>
          </View>
        ) : (
          <View style={styles.medicinesList}>
            {medicines.map((medicine) => (
              <View key={medicine.id} style={styles.medicineItem}>
                <View style={[styles.medicineIcon, { backgroundColor: medicine.color + '20' }]}>
                  <Ionicons name={medicine.icon} size={24} color={medicine.color} />
                </View>
                <View style={styles.medicineDetails}>
                  <Text style={styles.medicineName}>{medicine.name}</Text>
                  <Text style={styles.medicineDosage}>
                    {medicine.dosage} {medicine.unit}
                  </Text>
                  {medicine.description && (
                    <Text style={styles.medicineDescription}>{medicine.description}</Text>
                  )}
                </View>
                <View style={styles.medicineActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      setSelectedMedicine(medicine);
                      setShowAddSchedule(true);
                    }}
                  >
                    <Ionicons name="time" size={20} color="#FF6B9D" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteMedicine(medicine.id)}
                  >
                    <Ionicons name="trash" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ModernCard>
    </View>
  );

  const renderSchedules = () => (
    <View style={styles.tabContent}>
      <ModernCard type="glass" style={styles.schedulesCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="time" size={24} color="#FF6B9D" />
            <Text style={styles.cardTitle}>Medicine Schedules</Text>
          </View>
        </View>
        
        {schedules.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No schedules created yet</Text>
            <Text style={styles.emptyStateSubtext}>Create a schedule for your medicines</Text>
          </View>
        ) : (
          <View style={styles.schedulesList}>
            {schedules.map((schedule) => (
              <View key={schedule.id} style={styles.scheduleItem}>
                <View style={[styles.medicineIcon, { backgroundColor: schedule.color + '20' }]}>
                  <Ionicons name={schedule.icon || 'medical'} size={24} color={schedule.color} />
                </View>
                <View style={styles.scheduleDetails}>
                  <Text style={styles.medicineName}>{schedule.medicineName}</Text>
                  <Text style={styles.medicineDosage}>
                    {schedule.dosage} {schedule.unit} at {schedule.time}
                  </Text>
                  <Text style={styles.scheduleDays}>
                    {schedule.days.map(day => MedicineManager.getDayNames()[day]).join(', ')}
                  </Text>
                  <Text style={styles.schedulePeriod}>
                    {schedule.startDate.toLocaleDateString()} - {schedule.endDate ? schedule.endDate.toLocaleDateString() : 'Ongoing'}
                  </Text>
                </View>
                <View style={styles.scheduleStatus}>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: schedule.isActive ? '#A855F7' : '#F44336' }
                  ]} />
                  <Text style={styles.statusText}>
                    {schedule.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ModernCard>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      <ModernCard type="glass" style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="calendar" size={24} color="#FF6B9D" />
            <Text style={styles.cardTitle}>Medicine History</Text>
          </View>
        </View>
        
        <View style={styles.historyStats}>
          <View style={styles.historyStat}>
            <Text style={styles.historyStatValue}>{statistics.totalMedicines || 0}</Text>
            <Text style={styles.historyStatLabel}>Total Medicines</Text>
          </View>
          <View style={styles.historyStat}>
            <Text style={styles.historyStatValue}>{statistics.totalDoses || 0}</Text>
            <Text style={styles.historyStatLabel}>Doses Taken</Text>
          </View>
          <View style={styles.historyStat}>
            <Text style={styles.historyStatValue}>{statistics.adherenceRate || 0}%</Text>
            <Text style={styles.historyStatLabel}>Adherence Rate</Text>
          </View>
        </View>
      </ModernCard>
    </View>
  );

  const handleDeleteMedicine = async (medicineId) => {
    Alert.alert(
      'Delete Medicine',
      'Are you sure you want to delete this medicine? This will also delete all associated schedules.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await MedicineManager.deleteMedicine(medicineId);
              Alert.alert('Success', 'Medicine deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete medicine. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading medicine data...</Text>
        </View>
      );
    }

    switch (selectedTab) {
      case 'today':
        return renderToday();
      case 'medicines':
        return renderMedicines();
      case 'schedules':
        return renderSchedules();
      case 'history':
        return renderHistory();
      default:
        return renderToday();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ModernGradientBackground type="medicine">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Modern Header */}
          <View style={styles.modernHeader}>
            <View style={styles.headerContent}>
              <View style={styles.titleSection}>
                <View style={styles.iconContainer}>
                  <Ionicons name="medical" size={28} color="white" />
                </View>
                <View style={styles.titleText}>
                  <Text style={styles.modernTitle}>Medicine Tracker</Text>
                  <Text style={styles.modernSubtitle}>Manage your medications</Text>
                </View>
              </View>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>💊</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  selectedTab === tab.id && styles.activeTab,
                ]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Ionicons
                  name={tab.icon}
                  size={20}
                  color={selectedTab === tab.id ? '#FF6B9D' : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.id && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </ScrollView>
      </ModernGradientBackground>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        visible={showAddMedicine}
        onClose={() => setShowAddMedicine(false)}
        onSave={loadMedicineData}
      />

      {/* Add Schedule Modal */}
      <AddScheduleModal
        visible={showAddSchedule}
        onClose={() => setShowAddSchedule(false)}
        onSave={loadMedicineData}
        medicines={medicines}
        selectedMedicine={selectedMedicine}
        onMedicineSelected={setSelectedMedicine}
      />
    </SafeAreaView>
  );
}

// Add Medicine Modal Component
const AddMedicineModal = ({ visible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    unit: 'mg',
    description: '',
    color: '#FF6B9D',
    icon: 'medical',
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter medicine name');
      return;
    }
    if (!formData.dosage.trim()) {
      Alert.alert('Error', 'Please enter dosage');
      return;
    }

    try {
      await MedicineManager.addMedicine(formData);
      Alert.alert('Success', 'Medicine added successfully');
      onSave();
      onClose();
      setFormData({
        name: '',
        dosage: '',
        unit: 'mg',
        description: '',
        color: '#FF6B9D',
        icon: 'medical',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add medicine. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Medicine</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Medicine Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter medicine name"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dosage *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.dosage}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dosage: text }))}
                placeholder="Enter dosage"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Unit</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>{formData.unit}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Enter description (optional)"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Color</Text>
            <View style={styles.colorPicker}>
              {MedicineManager.getMedicineColors().map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    formData.color === color.value && styles.selectedColor
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, color: color.value }))}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Medicine</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Add Schedule Modal Component
const AddScheduleModal = ({ visible, onClose, onSave, medicines, selectedMedicine, onMedicineSelected }) => {
  const [formData, setFormData] = useState({
    medicineId: selectedMedicine?.id || '',
    medicineName: selectedMedicine?.name || '',
    dosage: selectedMedicine?.dosage || '',
    unit: selectedMedicine?.unit || 'mg',
    time: '',
    days: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    notes: '',
  });
  const [showMedicinePicker, setShowMedicinePicker] = useState(false);

  useEffect(() => {
    if (selectedMedicine) {
      setFormData(prev => ({
        ...prev,
        medicineId: selectedMedicine.id,
        medicineName: selectedMedicine.name,
        dosage: selectedMedicine.dosage,
        unit: selectedMedicine.unit,
      }));
    }
  }, [selectedMedicine]);

  const handleSave = async () => {
    if (!formData.medicineId) {
      Alert.alert('Error', 'Please select a medicine');
      return;
    }
    if (!formData.time) {
      Alert.alert('Error', 'Please select time');
      return;
    }
    if (formData.days.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    try {
      await MedicineManager.addMedicineSchedule(formData);
      Alert.alert('Success', 'Schedule created successfully');
      onSave();
      onClose();
      setFormData({
        medicineId: '',
        medicineName: '',
        dosage: '',
        unit: 'mg',
        time: '',
        days: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true,
        notes: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create schedule. Please try again.');
    }
  };

  const toggleDay = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(dayIndex)
        ? prev.days.filter(d => d !== dayIndex)
        : [...prev.days, dayIndex]
    }));
  };

  const handleMedicineSelect = (medicine) => {
    setFormData(prev => ({
      ...prev,
      medicineId: medicine.id,
      medicineName: medicine.name,
      dosage: medicine.dosage,
      unit: medicine.unit,
    }));
    setShowMedicinePicker(false);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Schedule</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Medicine *</Text>
            <TouchableOpacity 
              style={styles.pickerContainer}
              onPress={() => setShowMedicinePicker(true)}
            >
              <Text style={styles.pickerText}>
                {formData.medicineName || 'Select medicine'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dosage</Text>
              <TextInput
                style={styles.textInput}
                value={formData.dosage}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dosage: text }))}
                placeholder="Enter dosage"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Unit</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>{formData.unit}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Time *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.time}
              onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
              placeholder="HH:MM (e.g., 09:00)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Days *</Text>
            <View style={styles.daysContainer}>
              {MedicineManager.getDayNames().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    formData.days.includes(index) && styles.selectedDay
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    formData.days.includes(index) && styles.selectedDayText
                  ]}>
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <TextInput
                style={styles.textInput}
                value={formData.startDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>End Date</Text>
              <TextInput
                style={styles.textInput}
                value={formData.endDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, endDate: text }))}
                placeholder="YYYY-MM-DD (optional)"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Enter notes (optional)"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Create Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Medicine Picker Modal */}
      <Modal visible={showMedicinePicker} animationType="slide" transparent={true}>
        <View style={styles.medicinePickerOverlay}>
          <View style={styles.medicinePickerContainer}>
            <View style={styles.medicinePickerHeader}>
              <Text style={styles.medicinePickerTitle}>Select Medicine</Text>
              <TouchableOpacity onPress={() => setShowMedicinePicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {medicines.length === 0 ? (
              <View style={styles.emptyMedicinesContainer}>
                <Ionicons name="medical-outline" size={48} color="#ccc" />
                <Text style={styles.emptyMedicinesText}>No medicines added yet</Text>
                <Text style={styles.emptyMedicinesSubtext}>Add a medicine first to create a schedule</Text>
              </View>
            ) : (
              <FlatList
                data={medicines}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.medicineItem}
                    onPress={() => handleMedicineSelect(item)}
                  >
                    <View style={styles.medicineItemIcon}>
                      <Ionicons name="medical" size={24} color={item.color} />
                    </View>
                    <View style={styles.medicineItemInfo}>
                      <Text style={styles.medicineItemName}>{item.name}</Text>
                      <Text style={styles.medicineItemDetails}>
                        {item.dosage} {item.unit}
                      </Text>
                    </View>
                    {formData.medicineId === item.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.medicineList}
              />
            )}
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  
  // Modern Header
  modernHeader: {
    paddingHorizontal: 20,
    paddingTop: 50,
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
    backgroundColor: '#FF6B9D',
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
    color: '#333',
    lineHeight: 22,
    fontWeight: '500',
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

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    minHeight: 60,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FF6B9D',
  },

  // Tab Content
  tabContent: {
    paddingHorizontal: 20,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Cards
  statsCard: {
    marginBottom: 16,
  },
  scheduleCard: {
    marginBottom: 16,
  },
  medicinesCard: {
    marginBottom: 16,
  },
  schedulesCard: {
    marginBottom: 16,
  },
  historyCard: {
    marginBottom: 16,
  },

  // Card Headers
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    minHeight: 40,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: '#FF6B9D',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },

  // Statistics
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Schedule Items
  scheduleList: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 80,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  medicineIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  medicineDosage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  medicineTime: {
    fontSize: 12,
    color: '#999',
  },
  takenButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'center',
  },
  takenButtonActive: {
    backgroundColor: '#A855F7',
    borderColor: '#A855F7',
  },
  takenButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#E2E8F0',
  },

  // Medicine Items
  medicinesList: {
    gap: 12,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 80,
  },
  medicineDetails: {
    flex: 1,
    marginLeft: 12,
  },
  medicineDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  medicineActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Schedule Details
  scheduleDays: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  schedulePeriod: {
    fontSize: 12,
    color: '#999',
  },
  scheduleStatus: {
    alignItems: 'center',
    marginLeft: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
  },

  // History Stats
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyStat: {
    alignItems: 'center',
    flex: 1,
  },
  historyStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  historyStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },

  // Form Styles
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },

  // Color Picker
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },

  // Days Picker
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  selectedDay: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  selectedDayText: {
    color: 'white',
  },

  // Buttons
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // Medicine Picker Styles
  medicinePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  medicinePickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  medicinePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  medicinePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyMedicinesContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyMedicinesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyMedicinesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  medicineList: {
    maxHeight: 300,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medicineItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicineItemInfo: {
    flex: 1,
  },
  medicineItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  medicineItemDetails: {
    fontSize: 14,
    color: '#666',
  },
});
