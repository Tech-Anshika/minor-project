import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    cycleLength: 28,
    symptoms: [],
  });
  const [notifications, setNotifications] = useState({
    medication: true,
    yoga: true,
    water: true,
    period: true,
  });

  const commonSymptoms = [
    'Irregular periods',
    'Heavy bleeding',
    'Acne',
    'Weight gain',
    'Hair loss',
    'Mood swings',
    'Fatigue',
    'Insulin resistance',
  ];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (auth.currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setFormData({
            name: userData.name || '',
            age: userData.age?.toString() || '',
            weight: userData.weight?.toString() || '',
            height: userData.height?.toString() || '',
            cycleLength: userData.cycleLength || 28,
            symptoms: userData.symptoms || [],
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        updatedAt: new Date(),
      });
      
      setUser(prev => ({ ...prev, ...formData }));
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }
        },
      ]
    );
  };

  const toggleSymptom = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getBMI = () => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return 'N/A';
  };

  const getBMIStatus = (bmi) => {
    if (bmi === 'N/A') return { status: 'Unknown', color: '#666' };
    if (bmi < 18.5) return { status: 'Underweight', color: '#2196F3' };
    if (bmi < 25) return { status: 'Normal', color: '#4CAF50' };
    if (bmi < 30) return { status: 'Overweight', color: '#FF9800' };
    return { status: 'Obese', color: '#F44336' };
  };

  const bmi = getBMI();
  const bmiStatus = getBMIStatus(bmi);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👩‍⚕️ Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setEditing(!editing)}
        >
          <Ionicons 
            name={editing ? "close" : "create"} 
            size={24} 
            color="#E91E63" 
          />
        </TouchableOpacity>
      </View>

      {/* Profile Info Card */}
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#E91E63" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your name"
                />
              ) : (
                user?.name || 'User'
              )}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {editing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Health Stats */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="fitness" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>Health Statistics</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData.age}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                  placeholder="Age"
                  keyboardType="numeric"
                />
              ) : (
                formData.age || 'N/A'
              )}
            </Text>
            <Text style={styles.statLabel}>Age</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData.weight}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
                  placeholder="Weight"
                  keyboardType="numeric"
                />
              ) : (
                formData.weight ? `${formData.weight} kg` : 'N/A'
              )}
            </Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData.height}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, height: text }))}
                  placeholder="Height"
                  keyboardType="numeric"
                />
              ) : (
                formData.height ? `${formData.height} cm` : 'N/A'
              )}
            </Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: bmiStatus.color }]}>
              {bmi}
            </Text>
            <Text style={styles.statLabel}>BMI</Text>
            <Text style={[styles.bmiStatus, { color: bmiStatus.color }]}>
              {bmiStatus.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Cycle Information */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>Cycle Information</Text>
        </View>

        <View style={styles.cycleInfo}>
          <Text style={styles.cycleLabel}>Cycle Length</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.cycleLength.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cycleLength: parseInt(text) || 28 }))}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.cycleValue}>{formData.cycleLength} days</Text>
          )}
        </View>
      </View>

      {/* Symptoms */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="medical" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>Symptoms</Text>
        </View>

        <View style={styles.symptomsGrid}>
          {commonSymptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom}
              style={[
                styles.symptomChip,
                formData.symptoms.includes(symptom) && styles.selectedSymptomChip,
                !editing && styles.disabledChip
              ]}
              onPress={() => editing && toggleSymptom(symptom)}
              disabled={!editing}
            >
              <Text style={[
                styles.symptomText,
                formData.symptoms.includes(symptom) && styles.selectedSymptomText
              ]}>
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="notifications" size={24} color="#E91E63" />
          <Text style={styles.cardTitle}>Notifications</Text>
        </View>

        <View style={styles.notificationList}>
          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="medical" size={20} color="#666" />
              <Text style={styles.notificationLabel}>Medication Reminders</Text>
            </View>
            <Switch
              value={notifications.medication}
              onValueChange={() => toggleNotification('medication')}
              trackColor={{ false: '#E0E0E0', true: '#E91E63' }}
              thumbColor={notifications.medication ? '#FFF' : '#FFF'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="fitness" size={20} color="#666" />
              <Text style={styles.notificationLabel}>Yoga Reminders</Text>
            </View>
            <Switch
              value={notifications.yoga}
              onValueChange={() => toggleNotification('yoga')}
              trackColor={{ false: '#E0E0E0', true: '#E91E63' }}
              thumbColor={notifications.yoga ? '#FFF' : '#FFF'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="water" size={20} color="#666" />
              <Text style={styles.notificationLabel}>Water Intake</Text>
            </View>
            <Switch
              value={notifications.water}
              onValueChange={() => toggleNotification('water')}
              trackColor={{ false: '#E0E0E0', true: '#E91E63' }}
              thumbColor={notifications.water ? '#FFF' : '#FFF'}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.notificationLabel}>Period Tracking</Text>
            </View>
            <Switch
              value={notifications.period}
              onValueChange={() => toggleNotification('period')}
              trackColor={{ false: '#E0E0E0', true: '#E91E63' }}
              thumbColor={notifications.period ? '#FFF' : '#FFF'}
            />
          </View>
        </View>
      </View>

      {/* AI Insights */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bulb" size={24} color="#FF9800" />
          <Text style={styles.cardTitle}>AI Insights</Text>
        </View>

        <View style={styles.insightsList}>
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={20} color="#4CAF50" />
            <Text style={styles.insightText}>
              Your cycle is becoming more regular! Keep up the good work with your diet and exercise routine.
            </Text>
          </View>

          <View style={styles.insightItem}>
            <Ionicons name="water" size={20} color="#2196F3" />
            <Text style={styles.insightText}>
              Consider increasing your water intake to 10-12 glasses daily to help with bloating.
            </Text>
          </View>

          <View style={styles.insightItem}>
            <Ionicons name="fitness" size={20} color="#E91E63" />
            <Text style={styles.insightText}>
              Your yoga practice is showing positive results. Try adding 10 more minutes daily.
            </Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="white" />
        <Text style={styles.logoutButtonText}>Logout</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  bmiStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  cycleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cycleLabel: {
    fontSize: 16,
    color: '#333',
  },
  cycleValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedSymptomChip: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  disabledChip: {
    opacity: 0.6,
  },
  symptomText: {
    fontSize: 14,
    color: '#666',
  },
  selectedSymptomText: {
    color: 'white',
  },
  notificationList: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

