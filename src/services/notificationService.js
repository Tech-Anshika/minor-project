import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get push token
      this.expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your actual project ID
      });

      // Save token to Firestore
      if (auth.currentUser && this.expoPushToken) {
        await this.saveTokenToFirestore(this.expoPushToken.data);
      }

      // Set up notification listeners
      this.setupNotificationListeners();

      return this.expoPushToken;
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  async saveTokenToFirestore(token) {
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          expoPushToken: token,
          lastTokenUpdate: new Date(),
        });
      }
    } catch (error) {
      console.error('Error saving token to Firestore:', error);
    }
  }

  setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listener for when a user taps on or interacts with a notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification tap - navigate to relevant screen
      this.handleNotificationResponse(response);
    });
  }

  handleNotificationResponse(response) {
    const { data } = response.notification.request.content;
    
    // Navigate based on notification type
    switch (data?.type) {
      case 'medication':
        // Navigate to home screen or medication reminder
        break;
      case 'yoga':
        // Navigate to yoga screen
        break;
      case 'water':
        // Navigate to home screen
        break;
      case 'period':
        // Navigate to home screen or cycle tracker
        break;
      default:
        // Navigate to home screen
        break;
    }
  }

  // Schedule a local notification
  async scheduleNotification(title, body, data = {}, trigger = null) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: trigger || null, // null means show immediately
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Schedule daily medication reminder
  async scheduleMedicationReminder(medicationName, time) {
    const [hours, minutes] = time.split(':').map(Number);
    
    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    return await this.scheduleNotification(
      '💊 Medication Reminder',
      `Time to take your ${medicationName}`,
      { type: 'medication', medication: medicationName },
      trigger
    );
  }

  // Schedule yoga reminder
  async scheduleYogaReminder(time) {
    const [hours, minutes] = time.split(':').map(Number);
    
    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    return await this.scheduleNotification(
      '🧘‍♀️ Yoga Time',
      'Take a break and practice some yoga for your wellness',
      { type: 'yoga' },
      trigger
    );
  }

  // Schedule water intake reminder
  async scheduleWaterReminder() {
    const trigger = {
      hour: 9,
      minute: 0,
      repeats: true,
    };

    return await this.scheduleNotification(
      '💧 Water Reminder',
      'Stay hydrated! Remember to drink water regularly',
      { type: 'water' },
      trigger
    );
  }

  // Schedule period tracking reminder
  async schedulePeriodReminder() {
    const trigger = {
      hour: 20,
      minute: 0,
      repeats: true,
    };

    return await this.scheduleNotification(
      '🌸 Period Tracking',
      'Don\'t forget to log your period symptoms and mood',
      { type: 'period' },
      trigger
    );
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

export default new NotificationService();

