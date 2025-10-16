import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModernGradientBackground from '../components/ModernGradientBackground';
import ModernCard from '../components/ModernCard';
import ModernProgressRing from '../components/ModernProgressRing';
import ProgressAnalyzer from '../services/ProgressAnalyzer';
import ProgressTracker from '../services/ProgressTracker';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [progressData, setProgressData] = useState({
    waterIntake: { current: 0, target: 8 },
    steps: { current: 0, target: 8000 },
    sleep: { current: 0, target: 8 },
    mood: { current: 5, target: 10 },
    pain: { current: 0, target: 0 },
  });
  const [recommendations, setRecommendations] = useState({});
  const [progressSummary, setProgressSummary] = useState({});
  const [cyclePhase, setCyclePhase] = useState('unknown');
  const [isLoading, setIsLoading] = useState(true);
  const [todaysData, setTodaysData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [streaks, setStreaks] = useState({});

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'analytics' },
    { id: 'health', label: 'Health', icon: 'heart' },
    { id: 'fitness', label: 'Fitness', icon: 'fitness' },
    { id: 'nutrition', label: 'Nutrition', icon: 'restaurant' },
    { id: 'achievements', label: 'Achievements', icon: 'trophy' },
    { id: 'insights', label: 'Insights', icon: 'bulb' },
  ];

  useEffect(() => {
    loadProgressData();
    
    // Listen to today's progress data
    const unsubscribe = ProgressTracker.listenToDailyProgress((data) => {
      setTodaysData(data);
      if (data) {
        updateProgressDataWithTodaysData(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      
      // Load period data and generate recommendations
      await ProgressAnalyzer.loadPeriodData();
      const recs = ProgressAnalyzer.generateRecommendations();
      const summary = ProgressAnalyzer.getProgressSummary();
      
      setRecommendations(recs);
      setProgressSummary(summary);
      setCyclePhase(summary.cyclePhase);
      
      // Load progress history and calculate achievements/streaks
      const progressHistory = await ProgressTracker.getProgressHistory(30);
      const calculatedStreaks = ProgressTracker.calculateStreaks(progressHistory);
      const calculatedAchievements = ProgressTracker.getAchievements(progressHistory, calculatedStreaks);
      
      setStreaks(calculatedStreaks);
      setAchievements(calculatedAchievements);
      
      // Update progress data with personalized targets
      setProgressData({
        waterIntake: { 
          current: 0, // Will be updated by todaysData
          target: recs.waterIntake.target 
        },
        steps: { 
          current: 0, // Will be updated by todaysData
          target: recs.steps.target 
        },
        sleep: { 
          current: 0, // Will be updated by todaysData
          target: recs.sleep.targetHours 
        },
        mood: { 
          current: summary.avgMood === 'happy' ? 8 : summary.avgMood === 'sad' ? 3 : 5,
          target: 10 
        },
        pain: { 
          current: summary.avgPain,
          target: 0 
        },
      });
      
    } catch (error) {
      console.error('Error loading progress data:', error);
      Alert.alert('Error', 'Failed to load progress data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgressDataWithTodaysData = (data) => {
    setProgressData(prev => ({
      ...prev,
      waterIntake: { 
        ...prev.waterIntake,
        current: data.waterIntake || 0
      },
      steps: { 
        ...prev.steps,
        current: data.steps || 0
      },
      sleep: { 
        ...prev.sleep,
        current: data.sleep || 0
      },
      mood: { 
        ...prev.mood,
        current: data.mood || 5
      },
      pain: { 
        ...prev.pain,
        current: data.pain || 0
      },
    }));
  };

  const getCyclePhaseInfo = (phase) => {
    const phaseInfo = {
      menstrual: { 
        name: 'Menstrual Phase', 
        color: '#E91E63', 
        icon: 'water',
        description: 'Focus on rest and gentle self-care'
      },
      follicular: { 
        name: 'Follicular Phase', 
        color: '#4CAF50', 
        icon: 'leaf',
        description: 'Great time for new goals and activities'
      },
      ovulation: { 
        name: 'Ovulation Phase', 
        color: '#FF9800', 
        icon: 'sunny',
        description: 'Peak energy and performance time'
      },
      luteal: { 
        name: 'Luteal Phase', 
        color: '#9C27B0', 
        icon: 'moon',
        description: 'Focus on maintenance and preparation'
      },
      premenstrual: { 
        name: 'Premenstrual Phase', 
        color: '#F44336', 
        icon: 'warning',
        description: 'Gentle care and stress management'
      },
      unknown: { 
        name: 'Unknown Phase', 
        color: '#9CA3AF', 
        icon: 'help',
        description: 'Start tracking your cycle for personalized insights'
      }
    };
    
    return phaseInfo[phase] || phaseInfo.unknown;
  };

  const healthMetrics = [
    {
      id: 'water',
      title: 'Water Intake',
      current: progressData.waterIntake.current,
      target: progressData.waterIntake.target,
      unit: 'glasses',
      color: '#2196F3',
      icon: 'water',
      reason: recommendations.waterIntake?.reason || 'Maintain optimal hydration',
    },
    {
      id: 'steps',
      title: 'Steps',
      current: progressData.steps.current,
      target: progressData.steps.target,
      unit: 'steps',
      color: '#4CAF50',
      icon: 'walk',
      reason: recommendations.steps?.reason || 'Maintain healthy activity level',
    },
    {
      id: 'sleep',
      title: 'Sleep',
      current: progressData.sleep.current,
      target: progressData.sleep.target,
      unit: 'hours',
      color: '#9C27B0',
      icon: 'moon',
      reason: 'Essential for hormone balance and recovery',
    },
    {
      id: 'mood',
      title: 'Mood',
      current: progressData.mood.current,
      target: progressData.mood.target,
      unit: '/10',
      color: '#FF9800',
      icon: 'happy',
      reason: 'Track emotional well-being',
    },
    {
      id: 'pain',
      title: 'Pain Level',
      current: progressData.pain.current,
      target: progressData.pain.target,
      unit: '/10',
      color: '#F44336',
      icon: 'medical',
      reverse: true, // Lower is better
      reason: 'Monitor discomfort and symptoms',
    },
  ];

  const renderOverview = () => {
    const phaseInfo = getCyclePhaseInfo(cyclePhase);
    
    return (
      <View style={styles.tabContent}>
        {/* Cycle Phase Card */}
        <ModernCard type="glass" style={styles.cyclePhaseCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <View style={[styles.phaseIcon, { backgroundColor: phaseInfo.color + '20' }]}>
                <Ionicons name={phaseInfo.icon} size={24} color={phaseInfo.color} />
              </View>
              <View style={styles.phaseTitleText}>
                <Text style={styles.phaseTitle}>{phaseInfo.name}</Text>
                <Text style={styles.phaseDescription}>{phaseInfo.description}</Text>
              </View>
            </View>
            <View style={[styles.phaseBadge, { backgroundColor: phaseInfo.color + '20' }]}>
              <Text style={[styles.phaseBadgeText, { color: phaseInfo.color }]}>
                Day {progressSummary.daysInCycle || 0}
              </Text>
            </View>
          </View>
        </ModernCard>

        {/* Progress Summary */}
        <ModernCard type="glass" style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="trending-up" size={24} color="#E91E63" />
              <Text style={styles.cardTitle}>Personalized Goals</Text>
            </View>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>
                {progressSummary.overallHealth === 'good' ? 'Good' : 
                 progressSummary.overallHealth === 'moderate' ? 'Moderate' : 'Needs Attention'}
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{cyclePhase}</Text>
              <Text style={styles.summaryLabel}>Current Phase</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{progressSummary.daysInCycle || 0}</Text>
              <Text style={styles.summaryLabel}>Days in Cycle</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{progressSummary.recentSymptoms || 0}</Text>
              <Text style={styles.summaryLabel}>Recent Symptoms</Text>
            </View>
          </View>
        </ModernCard>

        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          {healthMetrics.slice(0, 4).map((metric) => (
            <ModernCard key={metric.id} type="glass" style={styles.quickStatCard}>
              <View style={styles.quickStatContent}>
                <View style={[styles.quickStatIcon, { backgroundColor: metric.color + '20' }]}>
                  <Ionicons name={metric.icon} size={24} color={metric.color} />
                </View>
                <View style={styles.quickStatInfo}>
                  <Text style={styles.quickStatValue}>
                    {metric.current}{metric.unit}
                  </Text>
                  <Text style={styles.quickStatLabel}>{metric.title}</Text>
                  <Text style={styles.quickStatReason}>{metric.reason}</Text>
                  <View style={styles.quickStatProgress}>
                    <View 
                      style={[
                        styles.quickStatProgressBar,
                        { 
                          width: `${Math.min(100, (metric.current / metric.target) * 100)}%`,
                          backgroundColor: metric.color
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            </ModernCard>
          ))}
        </View>

        {/* Current Streaks */}
        <ModernCard type="success" style={styles.streaksCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="flame" size={24} color="#1e3a8a" />
              <Text style={styles.cardTitleColored}>Current Streaks</Text>
            </View>
          </View>
          
          <View style={styles.streaksGrid}>
            <View style={styles.streakItem}>
              <View style={styles.streakIcon}>
                <Ionicons name="water" size={20} color="#2196F3" />
              </View>
              <Text style={styles.streakValue}>{streaks.water || 0}</Text>
              <Text style={styles.streakLabel}>Water Days</Text>
            </View>
            
            <View style={styles.streakItem}>
              <View style={styles.streakIcon}>
                <Ionicons name="walk" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.streakValue}>{streaks.steps || 0}</Text>
              <Text style={styles.streakLabel}>Step Days</Text>
            </View>
            
            <View style={styles.streakItem}>
              <View style={styles.streakIcon}>
                <Ionicons name="fitness" size={20} color="#FF9800" />
              </View>
              <Text style={styles.streakValue}>{streaks.exercise || 0}</Text>
              <Text style={styles.streakLabel}>Exercise Days</Text>
            </View>
            
            <View style={styles.streakItem}>
              <View style={styles.streakIcon}>
                <Ionicons name="medical" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.streakValue}>{streaks.medication || 0}</Text>
              <Text style={styles.streakLabel}>Medication Days</Text>
            </View>
          </View>
        </ModernCard>
      </View>
    );
  };

  const renderHealth = () => (
    <View style={styles.tabContent}>
      {healthMetrics.map((metric) => (
        <ModernCard key={metric.id} type="glass" style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={styles.metricTitleContainer}>
              <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                <Ionicons name={metric.icon} size={24} color={metric.color} />
              </View>
              <View style={styles.metricTitleText}>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <Text style={styles.metricSubtitle}>
                  {metric.current} / {metric.target} {metric.unit}
                </Text>
                <Text style={styles.metricReason}>{metric.reason}</Text>
              </View>
            </View>
            <View style={styles.metricProgressContainer}>
              <ModernProgressRing
                progress={metric.target > 0 ? (metric.current / metric.target) * 100 : 0}
                size={80}
                color={metric.color}
                backgroundColor="#E5E7EB"
                showPercentage={true}
              />
            </View>
          </View>
          
          <View style={styles.metricDetails}>
            <View style={styles.metricDetailItem}>
              <Text style={styles.metricDetailLabel}>Today's Progress</Text>
              <Text style={styles.metricDetailValue}>
                {metric.target > 0 ? Math.round((metric.current / metric.target) * 100) : 0}%
              </Text>
            </View>
            <View style={styles.metricDetailItem}>
              <Text style={styles.metricDetailLabel}>Remaining</Text>
              <Text style={styles.metricDetailValue}>
                {Math.max(0, metric.target - metric.current)} {metric.unit}
              </Text>
            </View>
            <View style={styles.metricDetailItem}>
              <Text style={styles.metricDetailLabel}>Phase</Text>
              <Text style={styles.metricDetailValue}>
                {cyclePhase}
              </Text>
            </View>
          </View>
        </ModernCard>
      ))}
    </View>
  );

  const renderFitness = () => (
    <View style={styles.tabContent}>
      <ModernCard type="glass" style={styles.fitnessCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="fitness" size={24} color="#E91E63" />
            <Text style={styles.cardTitle}>Personalized Fitness</Text>
          </View>
        </View>
        
        <View style={styles.fitnessStats}>
          <View style={styles.fitnessStat}>
            <Text style={styles.fitnessStatValue}>{progressData.steps.current.toLocaleString()}</Text>
            <Text style={styles.fitnessStatLabel}>Steps Today</Text>
            <Text style={styles.fitnessStatReason}>{recommendations.steps?.reason}</Text>
            <View style={styles.fitnessProgressBar}>
              <View style={[
                styles.fitnessProgressFill, 
                { width: `${Math.min(100, (progressData.steps.current / progressData.steps.target) * 100)}%` }
              ]} />
            </View>
          </View>
        </View>
      </ModernCard>

      <ModernCard type="info" style={styles.workoutCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="barbell" size={24} color="#0d9488" />
            <Text style={styles.cardTitleColored}>Recommended Activities</Text>
          </View>
        </View>
        
        <View style={styles.workoutList}>
          {recommendations.exercise?.recommendations?.slice(0, 3).map((workout, index) => (
            <View key={index} style={styles.workoutItem}>
              <View style={styles.workoutIcon}>
                <Ionicons name="fitness" size={20} color="#0d9488" />
              </View>
              <View style={styles.workoutContent}>
                <Text style={styles.workoutTitle}>{workout}</Text>
                <Text style={styles.workoutDesc}>
                  {recommendations.exercise?.intensity} intensity
                </Text>
              </View>
              <TouchableOpacity style={styles.workoutButton}>
                <Text style={styles.workoutButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ModernCard>
    </View>
  );

  const renderNutrition = () => (
    <View style={styles.tabContent}>
      <ModernCard type="glass" style={styles.nutritionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="restaurant" size={24} color="#E91E63" />
            <Text style={styles.cardTitle}>Personalized Nutrition</Text>
          </View>
        </View>
        
        <View style={styles.nutritionStats}>
          <View style={styles.nutritionStat}>
            <Text style={styles.nutritionStatValue}>{progressData.waterIntake.current}</Text>
            <Text style={styles.nutritionStatLabel}>Water Glasses</Text>
            <Text style={styles.nutritionStatReason}>{recommendations.waterIntake?.reason}</Text>
            <View style={styles.nutritionProgressBar}>
              <View style={[
                styles.nutritionProgressFill, 
                { width: `${Math.min(100, (progressData.waterIntake.current / progressData.waterIntake.target) * 100)}%` }
              ]} />
            </View>
          </View>
        </View>
      </ModernCard>

      <ModernCard type="warning" style={styles.recommendationsCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="bulb" size={24} color="#be185d" />
            <Text style={styles.cardTitleColored}>Nutrition Focus</Text>
          </View>
        </View>
        
        <View style={styles.recommendationsList}>
          <Text style={styles.nutritionFocus}>
            {recommendations.nutrition?.focus || 'Balanced nutrition for your cycle phase'}
          </Text>
          
          {recommendations.nutrition?.recommendations?.slice(0, 4).map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationIcon}>
                <Ionicons name="leaf" size={16} color="#be185d" />
              </View>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>
      </ModernCard>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.tabContent}>
      {/* Achievements Overview */}
      <ModernCard type="glass" style={styles.achievementsOverviewCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="trophy" size={24} color="#E91E63" />
            <Text style={styles.cardTitle}>Your Achievements</Text>
          </View>
          <View style={styles.achievementCount}>
            <Text style={styles.achievementCountText}>
              {achievements.length} Unlocked
            </Text>
          </View>
        </View>
        
        <View style={styles.achievementProgress}>
          <View style={styles.achievementProgressBar}>
            <View 
              style={[
                styles.achievementProgressFill,
                { width: `${Math.min(100, (achievements.length / 10) * 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.achievementProgressText}>
            {achievements.length} of 10 achievements unlocked
          </Text>
        </View>
      </ModernCard>

      {/* Unlocked Achievements */}
      {achievements.length > 0 ? (
        <ModernCard type="success" style={styles.unlockedAchievementsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#1e3a8a" />
              <Text style={styles.cardTitleColored}>Unlocked Achievements</Text>
            </View>
          </View>
          
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
                  <Ionicons name={achievement.icon} size={24} color={achievement.color} />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                <View style={styles.achievementBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={achievement.color} />
                </View>
              </View>
            ))}
          </View>
        </ModernCard>
      ) : (
        <ModernCard type="info" style={styles.noAchievementsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="trophy-outline" size={24} color="#0d9488" />
              <Text style={styles.cardTitleColored}>No Achievements Yet</Text>
            </View>
          </View>
          
          <View style={styles.noAchievementsContent}>
            <Text style={styles.noAchievementsText}>
              Keep tracking your progress to unlock achievements! Complete your daily goals consistently to earn your first badge.
            </Text>
            
            <View style={styles.achievementTips}>
              <Text style={styles.achievementTipsTitle}>Tips to unlock achievements:</Text>
              <Text style={styles.achievementTip}>• Meet your water intake goal for 7 days</Text>
              <Text style={styles.achievementTip}>• Complete your step goal for 7 days</Text>
              <Text style={styles.achievementTip}>• Exercise for 5 consecutive days</Text>
              <Text style={styles.achievementTip}>• Take medication consistently for 30 days</Text>
            </View>
          </View>
        </ModernCard>
      )}

      {/* Upcoming Achievements */}
      <ModernCard type="warning" style={styles.upcomingAchievementsCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="star" size={24} color="#be185d" />
            <Text style={styles.cardTitleColored}>Upcoming Achievements</Text>
          </View>
        </View>
        
        <View style={styles.upcomingAchievementsList}>
          <View style={styles.upcomingAchievementItem}>
            <View style={styles.upcomingAchievementIcon}>
              <Ionicons name="water" size={20} color="#2196F3" />
            </View>
            <View style={styles.upcomingAchievementContent}>
              <Text style={styles.upcomingAchievementTitle}>Hydration Hero</Text>
              <Text style={styles.upcomingAchievementDesc}>
                Meet water goal for 7 consecutive days
              </Text>
              <View style={styles.upcomingAchievementProgress}>
                <View style={styles.upcomingAchievementProgressBar}>
                  <View 
                    style={[
                      styles.upcomingAchievementProgressFill,
                      { width: `${Math.min(100, ((streaks.water || 0) / 7) * 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.upcomingAchievementProgressText}>
                  {streaks.water || 0}/7 days
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.upcomingAchievementItem}>
            <View style={styles.upcomingAchievementIcon}>
              <Ionicons name="walk" size={20} color="#4CAF50" />
            </View>
            <View style={styles.upcomingAchievementContent}>
              <Text style={styles.upcomingAchievementTitle}>Step Master</Text>
              <Text style={styles.upcomingAchievementDesc}>
                Achieve step goal for 7 consecutive days
              </Text>
              <View style={styles.upcomingAchievementProgress}>
                <View style={styles.upcomingAchievementProgressBar}>
                  <View 
                    style={[
                      styles.upcomingAchievementProgressFill,
                      { width: `${Math.min(100, ((streaks.steps || 0) / 7) * 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.upcomingAchievementProgressText}>
                  {streaks.steps || 0}/7 days
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ModernCard>
    </View>
  );

  const renderInsights = () => (
    <View style={styles.tabContent}>
      {/* Cycle Insights */}
      <ModernCard type="glass" style={styles.insightsCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="analytics" size={24} color="#E91E63" />
            <Text style={styles.cardTitle}>Cycle Insights</Text>
          </View>
        </View>
        
        <View style={styles.insightsContent}>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Current Phase</Text>
            <Text style={styles.insightValue}>{getCyclePhaseInfo(cyclePhase).name}</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Days in Cycle</Text>
            <Text style={styles.insightValue}>{progressSummary.daysInCycle || 0}</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Recent Symptoms</Text>
            <Text style={styles.insightValue}>{progressSummary.recentSymptoms || 0}</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Average Pain</Text>
            <Text style={styles.insightValue}>{progressSummary.avgPain || 0}/10</Text>
          </View>
        </View>
      </ModernCard>

      {/* Supplement Recommendations */}
      <ModernCard type="success" style={styles.supplementsCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="medical" size={24} color="#1e3a8a" />
            <Text style={styles.cardTitleColored}>Supplement Recommendations</Text>
          </View>
        </View>
        
        <View style={styles.supplementsContent}>
          <View style={styles.supplementPriority}>
            <Text style={styles.priorityTitle}>High Priority</Text>
            <View style={styles.supplementList}>
              {recommendations.supplements?.priority?.high?.map((supplement, index) => (
                <View key={index} style={styles.supplementItem}>
                  <Text style={styles.supplementText}>{supplement}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.supplementPriority}>
            <Text style={styles.priorityTitle}>Medium Priority</Text>
            <View style={styles.supplementList}>
              {recommendations.supplements?.priority?.medium?.map((supplement, index) => (
                <View key={index} style={styles.supplementItem}>
                  <Text style={styles.supplementText}>{supplement}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ModernCard>

      {/* Mood & Pain Management */}
      <ModernCard type="warning" style={styles.managementCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="heart" size={24} color="#be185d" />
            <Text style={styles.cardTitleColored}>Mood & Pain Management</Text>
          </View>
        </View>
        
        <View style={styles.managementContent}>
          <View style={styles.managementSection}>
            <Text style={styles.managementTitle}>Mood Support</Text>
            {recommendations.mood?.recommendations?.map((rec, index) => (
              <Text key={index} style={styles.managementText}>• {rec}</Text>
            ))}
          </View>
          
          <View style={styles.managementSection}>
            <Text style={styles.managementTitle}>Pain Management</Text>
            {recommendations.pain?.recommendations?.map((rec, index) => (
              <Text key={index} style={styles.managementText}>• {rec}</Text>
            ))}
          </View>
        </View>
      </ModernCard>
    </View>
  );

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading personalized recommendations...</Text>
        </View>
      );
    }

    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'health':
        return renderHealth();
      case 'fitness':
        return renderFitness();
      case 'nutrition':
        return renderNutrition();
      case 'achievements':
        return renderAchievements();
      case 'insights':
        return renderInsights();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ModernGradientBackground type="progress">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Modern Header */}
          <View style={styles.modernHeader}>
            <View style={styles.headerContent}>
              <View style={styles.titleSection}>
                <View style={styles.iconContainer}>
                  <Ionicons name="analytics" size={28} color="white" />
                </View>
                <View style={styles.titleText}>
                  <Text style={styles.modernTitle}>Progress Tracking</Text>
                  <Text style={styles.modernSubtitle}>Personalized health insights</Text>
                </View>
              </View>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>📊</Text>
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

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
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
    marginLeft: 6,
  },
  activeTabText: {
    color: '#E91E63',
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

  // Cycle Phase Card
  cyclePhaseCard: {
    marginBottom: 16,
  },
  phaseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  phaseTitleText: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  phaseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  phaseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  phaseBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Summary Card
  summaryCard: {
    marginBottom: 16,
  },
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
  summaryBadge: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  summaryBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Quick Stats
  quickStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickStatCard: {
    width: (width - 60) / 2,
    marginBottom: 12,
  },
  quickStatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickStatInfo: {
    flex: 1,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  quickStatReason: {
    fontSize: 10,
    color: '#999',
    marginBottom: 6,
  },
  quickStatProgress: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
  },
  quickStatProgressBar: {
    height: '100%',
    borderRadius: 2,
  },

  // Metric Cards
  metricCard: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metricTitleText: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricReason: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  metricProgressContainer: {
    marginLeft: 16,
  },
  metricDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Fitness Card
  fitnessCard: {
    marginBottom: 16,
  },
  fitnessStats: {
    gap: 16,
  },
  fitnessStat: {
    alignItems: 'center',
  },
  fitnessStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  fitnessStatLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  fitnessStatReason: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  fitnessProgressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    width: '100%',
  },
  fitnessProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },

  // Workout Card
  workoutCard: {
    marginBottom: 16,
  },
  cardTitleColored: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0d9488',
    marginLeft: 12,
  },
  workoutList: {
    gap: 12,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0d9488',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutContent: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  workoutDesc: {
    fontSize: 12,
    color: '#666',
  },
  workoutButton: {
    backgroundColor: '#0d9488',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  workoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Nutrition Card
  nutritionCard: {
    marginBottom: 16,
  },
  nutritionStats: {
    gap: 16,
  },
  nutritionStat: {
    alignItems: 'center',
  },
  nutritionStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nutritionStatLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  nutritionStatReason: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  nutritionProgressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    width: '100%',
  },
  nutritionProgressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },

  // Recommendations Card
  recommendationsCard: {
    marginBottom: 16,
  },
  recommendationsList: {
    gap: 12,
  },
  nutritionFocus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#be185d',
    marginBottom: 12,
    textAlign: 'center',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  recommendationIcon: {
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },

  // Insights Card
  insightsCard: {
    marginBottom: 16,
  },
  insightsContent: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  insightLabel: {
    fontSize: 14,
    color: '#666',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Supplements Card
  supplementsCard: {
    marginBottom: 16,
  },
  supplementsContent: {
    gap: 16,
  },
  supplementPriority: {
    gap: 8,
  },
  priorityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  supplementList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supplementItem: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  supplementText: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '600',
  },

  // Management Card
  managementCard: {
    marginBottom: 16,
  },
  managementContent: {
    gap: 16,
  },
  managementSection: {
    gap: 8,
  },
  managementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#be185d',
    marginBottom: 8,
  },
  managementText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  // Streaks Card
  streaksCard: {
    marginBottom: 16,
  },
  streaksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  streakItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    marginBottom: 8,
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Achievements
  achievementsOverviewCard: {
    marginBottom: 16,
  },
  achievementCount: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  achievementCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  achievementProgress: {
    marginTop: 16,
  },
  achievementProgressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 8,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 4,
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Unlocked Achievements
  unlockedAchievementsCard: {
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  achievementBadge: {
    marginLeft: 12,
  },

  // No Achievements
  noAchievementsCard: {
    marginBottom: 16,
  },
  noAchievementsContent: {
    gap: 16,
  },
  noAchievementsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
  achievementTips: {
    gap: 8,
  },
  achievementTipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: 4,
  },
  achievementTip: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },

  // Upcoming Achievements
  upcomingAchievementsCard: {
    marginBottom: 16,
  },
  upcomingAchievementsList: {
    gap: 12,
  },
  upcomingAchievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  upcomingAchievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingAchievementContent: {
    flex: 1,
  },
  upcomingAchievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  upcomingAchievementDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  upcomingAchievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upcomingAchievementProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  upcomingAchievementProgressFill: {
    height: '100%',
    backgroundColor: '#be185d',
    borderRadius: 2,
  },
  upcomingAchievementProgressText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
});