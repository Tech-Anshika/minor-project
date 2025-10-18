import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

class MedicineManager {
  constructor() {
    this.medicines = [];
    this.schedules = [];
    this.listeners = [];
  }

  // Add a new medicine
  async addMedicine(medicineData) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const medicine = {
      name: medicineData.name,
      dosage: medicineData.dosage,
      unit: medicineData.unit,
      description: medicineData.description || '',
      color: medicineData.color || '#E91E63',
      icon: medicineData.icon || 'medical',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, 'medicines', auth.currentUser.uid, 'medications'), medicine);
      console.log('Medicine added successfully:', docRef.id);
      return { id: docRef.id, ...medicine };
    } catch (error) {
      console.error('Error adding medicine:', error);
      throw error;
    }
  }

  // Update medicine
  async updateMedicine(medicineId, updateData) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const medicineRef = doc(db, 'medicines', auth.currentUser.uid, 'medications', medicineId);
      await updateDoc(medicineRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
      console.log('Medicine updated successfully');
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  }

  // Delete medicine
  async deleteMedicine(medicineId) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const medicineRef = doc(db, 'medicines', auth.currentUser.uid, 'medications', medicineId);
      await deleteDoc(medicineRef);
      console.log('Medicine deleted successfully');
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  }

  // Add medicine schedule
  async addMedicineSchedule(scheduleData) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const schedule = {
      medicineId: scheduleData.medicineId,
      medicineName: scheduleData.medicineName,
      dosage: scheduleData.dosage,
      unit: scheduleData.unit,
      time: scheduleData.time, // Format: "HH:MM"
      days: scheduleData.days, // Array of days: [0,1,2,3,4,5,6] (0=Sunday)
      startDate: Timestamp.fromDate(new Date(scheduleData.startDate)),
      endDate: scheduleData.endDate ? Timestamp.fromDate(new Date(scheduleData.endDate)) : null,
      isActive: scheduleData.isActive !== false,
      notes: scheduleData.notes || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, 'medicines', auth.currentUser.uid, 'schedules'), schedule);
      console.log('Medicine schedule added successfully:', docRef.id);
      return { id: docRef.id, ...schedule };
    } catch (error) {
      console.error('Error adding medicine schedule:', error);
      throw error;
    }
  }

  // Update medicine schedule
  async updateMedicineSchedule(scheduleId, updateData) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const scheduleRef = doc(db, 'medicines', auth.currentUser.uid, 'schedules', scheduleId);
      await updateDoc(scheduleRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
      console.log('Medicine schedule updated successfully');
    } catch (error) {
      console.error('Error updating medicine schedule:', error);
      throw error;
    }
  }

  // Delete medicine schedule
  async deleteMedicineSchedule(scheduleId) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const scheduleRef = doc(db, 'medicines', auth.currentUser.uid, 'schedules', scheduleId);
      await deleteDoc(scheduleRef);
      console.log('Medicine schedule deleted successfully');
    } catch (error) {
      console.error('Error deleting medicine schedule:', error);
      throw error;
    }
  }

  // Mark medicine as taken
  async markMedicineTaken(scheduleId, takenAt = new Date()) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const takenRecord = {
      scheduleId: scheduleId,
      takenAt: Timestamp.fromDate(takenAt),
      date: Timestamp.fromDate(new Date(takenAt.getFullYear(), takenAt.getMonth(), takenAt.getDate())),
      timestamp: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, 'medicines', auth.currentUser.uid, 'taken'), takenRecord);
      console.log('Medicine marked as taken:', docRef.id);
      return { id: docRef.id, ...takenRecord };
    } catch (error) {
      console.error('Error marking medicine as taken:', error);
      throw error;
    }
  }

  // Get all medicines
  async getMedicines() {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const q = query(
        collection(db, 'medicines', auth.currentUser.uid, 'medications'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }));
    } catch (error) {
      console.error('Error getting medicines:', error);
      throw error;
    }
  }

  // Get all medicine schedules
  async getMedicineSchedules() {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const q = query(
        collection(db, 'medicines', auth.currentUser.uid, 'schedules'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate ? doc.data().endDate.toDate() : null,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }));
    } catch (error) {
      console.error('Error getting medicine schedules:', error);
      throw error;
    }
  }

  // Get today's medicine schedule
  getTodaysSchedule(schedules) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayStr = today.toISOString().split('T')[0];

    return schedules.filter(schedule => {
      if (!schedule.isActive) return false;
      
      // Check if today is within the schedule period
      const startDate = schedule.startDate;
      const endDate = schedule.endDate;
      
      if (startDate && today < startDate) return false;
      if (endDate && today > endDate) return false;
      
      // Check if today is one of the scheduled days
      return schedule.days.includes(dayOfWeek);
    });
  }

  // Get medicine taken records for a date range
  async getMedicineTakenRecords(startDate, endDate) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const q = query(
        collection(db, 'medicines', auth.currentUser.uid, 'taken'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        takenAt: doc.data().takenAt.toDate(),
        date: doc.data().date.toDate(),
        timestamp: doc.data().timestamp.toDate(),
      }));
    } catch (error) {
      console.error('Error getting medicine taken records:', error);
      throw error;
    }
  }

  // Listen to medicines changes
  listenToMedicines(callback) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'medicines', auth.currentUser.uid, 'medications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const medicines = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }));
      callback(medicines);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Listen to medicine schedules changes
  listenToMedicineSchedules(callback) {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'medicines', auth.currentUser.uid, 'schedules'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const schedules = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate ? doc.data().endDate.toDate() : null,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }));
      callback(schedules);
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Get medicine statistics
  async getMedicineStatistics(days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const schedules = await this.getMedicineSchedules();
      const takenRecords = await this.getMedicineTakenRecords(startDate, endDate);
      
      const stats = {
        totalMedicines: schedules.length,
        activeSchedules: schedules.filter(s => s.isActive).length,
        totalDoses: takenRecords.length,
        adherenceRate: 0,
        missedDoses: 0,
        upcomingDoses: 0,
      };

      // Calculate adherence rate
      const todaysSchedule = this.getTodaysSchedule(schedules);
      const todayTaken = takenRecords.filter(record => {
        const recordDate = record.date;
        return recordDate.toDateString() === endDate.toDateString();
      });

      if (todaysSchedule.length > 0) {
        stats.adherenceRate = Math.round((todayTaken.length / todaysSchedule.length) * 100);
        stats.missedDoses = todaysSchedule.length - todayTaken.length;
      }

      // Calculate upcoming doses for today
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      stats.upcomingDoses = todaysSchedule.filter(schedule => {
        const [hours, minutes] = schedule.time.split(':').map(Number);
        const scheduleTime = hours * 60 + minutes;
        return scheduleTime > currentTime;
      }).length;

      return stats;
    } catch (error) {
      console.error('Error getting medicine statistics:', error);
      throw error;
    }
  }

  // Get medicine colors
  getMedicineColors() {
    return [
      { name: 'Pink', value: '#E91E63' },
      { name: 'Blue', value: '#2196F3' },
      { name: 'Green', value: '#4CAF50' },
      { name: 'Orange', value: '#FF9800' },
      { name: 'Purple', value: '#9C27B0' },
      { name: 'Red', value: '#F44336' },
      { name: 'Teal', value: '#009688' },
      { name: 'Indigo', value: '#3F51B5' },
    ];
  }

  // Get medicine icons
  getMedicineIcons() {
    return [
      'medical',
      'pills',
      'flask',
      'bandage',
      'heart',
      'eye',
      'thermometer',
      'fitness',
      'leaf',
      'water',
    ];
  }

  // Get dosage units
  getDosageUnits() {
    return [
      'mg',
      'g',
      'ml',
      'tablet',
      'capsule',
      'drop',
      'spoon',
      'tsp',
      'tbsp',
    ];
  }

  // Get day names
  getDayNames() {
    return [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
  }

  // Clean up listeners
  cleanup() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}

export default new MedicineManager();




