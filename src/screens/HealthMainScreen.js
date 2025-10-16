import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModernGradientBackground from '../components/ModernGradientBackground';
import ModernCard from '../components/ModernCard';

const { width } = Dimensions.get('window');

export default function HealthMainScreen({ navigation }) {
  const healthFeatures = [
    {
      id: 'period',
      title: 'Period Log',
      subtitle: 'Track your menstrual cycle and symptoms',
      icon: 'calendar-outline',
      color: '#E91E63',
      screen: 'PeriodLog',
    },
    {
      id: 'yoga',
      title: 'Yoga & Exercise',
      subtitle: 'PCOD-friendly workout routines',
      icon: 'fitness-outline',
      color: '#4CAF50',
      screen: 'Yoga',
    },
    {
      id: 'food',
      title: 'Food & Diet',
      subtitle: 'PCOD-friendly nutrition guide',
      icon: 'restaurant-outline',
      color: '#FF9800',
      screen: 'Food',
    },
    {
      id: 'chatbot',
      title: 'AI Health Assistant',
      subtitle: 'Personalized health advice',
      icon: 'chatbubble-outline',
      color: '#9C27B0',
      screen: 'Chatbot',
    },
  ];

  const handleFeaturePress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ModernGradientBackground type="home">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health & Wellness</Text>
          <Text style={styles.headerSubtitle}>Manage your health journey</Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {healthFeatures.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => handleFeaturePress(feature.screen)}
              activeOpacity={0.7}
            >
              <ModernCard type="feature" style={styles.cardContent}>
                <View style={styles.featureIcon}>
                  <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                    <Ionicons name={feature.icon} size={24} color="white" />
                  </View>
                </View>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                </View>
                <View style={styles.featureArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#E91E63" />
                </View>
              </ModernCard>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ModernGradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  featuresGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  featureCard: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  featureIcon: {
    marginRight: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  featureArrow: {
    marginLeft: 8,
  },
});
