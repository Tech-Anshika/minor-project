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
              <Ionicons name="analytics" size={26} color="#FF6B9D" />
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
              <Ionicons name="time" size={26} color="#FF6B9D" />
              <Text style={styles.cardTitle}>Today's Schedule</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddSchedule(true)}
            >
              <Ionicons name="add" size={22} color="white" />
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
            <Ionicons name="medical" size={26} color="#FF6B9D" />
            <Text style={styles.cardTitle}>My Medicines</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddMedicine(true)}
          >
            <Ionicons name="add" size={22} color="white" />
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
                    <Ionicons name="time" size={22} color="#FF6B9D" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteMedicine(medicine.id)}
                  >
                    <Ionicons name="trash" size={22} color="#EF4444" />
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
            <Ionicons name="time" size={26} color="#FF6B9D" />
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
                    { backgroundColor: schedule.isActive ? '#4CAF50' : '#F44336' }
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
            <Ionicons name="calendar" size={26} color="#FF6B9D" />
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
                  color={selectedTab === tab.id ? '#E91E63' : '#9CA3AF'}
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
    color: '#E91E63',
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
        color: '#E91E63',
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
  
  // Modern Header - Updated Colors
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  titleText: {
    flex: 1,
  },
  modernTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  modernSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    fontWeight: '500',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarEmoji: {
    fontSize: 38,
  },

  // Tab Navigation - Updated Colors
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    minHeight: 65,
  },
  activeTab: {
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
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

  // Card Headers - Updated Colors
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    minHeight: 40,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  addButton: {
    backgroundColor: '#FF6B9D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    alignSelf: 'center',
  },

  // Statistics - Updated Colors
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 107, 157, 0.08)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Schedule Items - Updated Colors
  scheduleList: {
    gap: 14,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.15)',
    minHeight: 85,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  medicineIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  medicineDosage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 3,
    fontWeight: '500',
  },
  medicineTime: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  takenButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  takenButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
  },
  takenButtonInactive: {
    backgroundColor: 'white',
    borderColor: '#FFB6D9',
  },

  // Medicine Items - Updated Colors
  medicinesList: {
    gap: 14,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.15)',
    minHeight: 85,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  medicineDetails: {
    flex: 1,
    marginLeft: 14,
  },
  medicineDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  medicineActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Schedule Details - Updated Colors
  scheduleDays: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 3,
    fontWeight: '600',
  },
  schedulePeriod: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  scheduleStatus: {
    alignItems: 'center',
    marginLeft: 12,
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
  },

  // History Stats - Updated Colors
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  historyStat: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 107, 157, 0.08)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  historyStatValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 6,
  },
  historyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Empty State - Updated Colors
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
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

  // Days Picker - Updated Colors
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.3)',
    backgroundColor: 'white',
  },
  selectedDay: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dayButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  selectedDayText: {
    color: 'white',
  },

  // Buttons - Updated Colors
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 157, 0.3)',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700',
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
