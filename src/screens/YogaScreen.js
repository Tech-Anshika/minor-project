import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedCharacter from '../components/AnimatedCharacter';

const { width } = Dimensions.get('window');

export default function YogaScreen() {
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [yogaPoses, setYogaPoses] = useState([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentPose, setCurrentPose] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionPoses, setSessionPoses] = useState([]);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  
  const timerRef = useRef(null);
  const poseTimerRef = useRef(null);

  const phases = ['All', 'Menstrual', 'Follicular', 'Ovulation', 'Luteal'];

  const yogaData = [
    {
      id: 1,
      name: 'Child\'s Pose (Balasana)',
      phase: 'Menstrual',
      duration: '5-10 minutes',
      durationSeconds: 300,
      benefits: ['Relieves menstrual cramps', 'Reduces stress', 'Calms the mind'],
      description: 'A gentle resting pose that helps relieve menstrual cramps and stress.',
      instructions: [
        'Start on your hands and knees',
        'Bring your big toes together and knees hip-width apart',
        'Sit back on your heels and extend your arms forward',
        'Lower your forehead to the mat',
        'Breathe deeply and hold the pose'
      ],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      videoUrl: 'https://youtu.be/2MTbWLTIutM',
      difficulty: 'Beginner',
      category: 'Restorative'
    },
    {
      id: 2,
      name: 'Cat-Cow Stretch',
      phase: 'Menstrual',
      duration: '3-5 minutes',
      durationSeconds: 180,
      benefits: ['Improves spine flexibility', 'Relieves back pain', 'Massages reproductive organs'],
      description: 'Gentle spinal movement that helps with menstrual discomfort.',
      instructions: [
        'Start on hands and knees in tabletop position',
        'Inhale and arch your back (cow pose)',
        'Exhale and round your spine (cat pose)',
        'Continue flowing between poses',
        'Move slowly and breathe deeply'
      ],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
      videoUrl: 'https://youtu.be/kqnua4rHVVA',
      difficulty: 'Beginner',
      category: 'Gentle Flow'
    },
    {
      id: 3,
      name: 'Warrior II (Virabhadrasana II)',
      phase: 'Follicular',
      duration: '30-60 seconds each side',
      durationSeconds: 45,
      benefits: ['Strengthens legs', 'Improves balance', 'Boosts energy'],
      description: 'A powerful standing pose that builds strength and confidence.',
      instructions: [
        'Step feet wide apart',
        'Turn right foot out 90 degrees',
        'Bend right knee over ankle',
        'Extend arms parallel to floor',
        'Gaze over front fingertips'
      ],
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400',
      videoUrl: 'https://youtu.be/lbS2SjJBN4s',
      difficulty: 'Intermediate',
      category: 'Standing'
    },
    {
      id: 4,
      name: 'Tree Pose (Vrikshasana)',
      phase: 'Follicular',
      duration: '30-60 seconds each side',
      durationSeconds: 45,
      benefits: ['Improves balance', 'Strengthens core', 'Enhances focus'],
      description: 'A balancing pose that helps improve concentration and stability.',
      instructions: [
        'Stand on one leg',
        'Place other foot on inner thigh or calf',
        'Bring hands to prayer position',
        'Focus on a fixed point',
        'Breathe steadily and hold'
      ],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
      videoUrl: 'https://youtu.be/vITtwSNkQoQ',
      difficulty: 'Beginner',
      category: 'Balance'
    },
    {
      id: 5,
      name: 'Cobra Pose (Bhujangasana)',
      phase: 'Ovulation',
      duration: '15-30 seconds',
      durationSeconds: 30,
      benefits: ['Strengthens back', 'Opens chest', 'Improves circulation'],
      description: 'A gentle backbend that energizes the body during ovulation.',
      instructions: [
        'Lie face down on mat',
        'Place palms under shoulders',
        'Press tops of feet into mat',
        'Lift chest and head up',
        'Keep elbows close to body'
      ],
      image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400',
      videoUrl: 'https://youtu.be/JUP_YdYKfWY',
      difficulty: 'Beginner',
      category: 'Backbend'
    },
    {
      id: 6,
      name: 'Bridge Pose (Setu Bandhasana)',
      phase: 'Ovulation',
      duration: '30-60 seconds',
      durationSeconds: 45,
      benefits: ['Strengthens glutes', 'Opens chest', 'Improves thyroid function'],
      description: 'A gentle backbend that helps with hormonal balance.',
      instructions: [
        'Lie on back with knees bent',
        'Place feet hip-width apart',
        'Press feet into floor',
        'Lift hips up',
        'Interlace fingers under body'
      ],
      image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400',
      videoUrl: 'https://youtu.be/j4jDKc6Sq2s',
      difficulty: 'Beginner',
      category: 'Backbend'
    },
    {
      id: 7,
      name: 'Legs Up the Wall (Viparita Karani)',
      phase: 'Luteal',
      duration: '5-15 minutes',
      durationSeconds: 600,
      benefits: ['Reduces swelling', 'Relieves stress', 'Improves circulation'],
      description: 'A restorative pose perfect for the luteal phase.',
      instructions: [
        'Sit close to a wall',
        'Swing legs up the wall',
        'Lie back and rest',
        'Place arms by sides',
        'Close eyes and breathe deeply'
      ],
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
      videoUrl: 'https://youtu.be/wRyhJwJ2OOY',
      difficulty: 'Beginner',
      category: 'Restorative'
    },
    {
      id: 8,
      name: 'Seated Forward Bend (Paschimottanasana)',
      phase: 'Luteal',
      duration: '1-3 minutes',
      durationSeconds: 120,
      benefits: ['Calms nervous system', 'Stretches spine', 'Relieves anxiety'],
      description: 'A calming forward bend that helps with premenstrual symptoms.',
      instructions: [
        'Sit with legs extended',
        'Inhale and lengthen spine',
        'Exhale and fold forward',
        'Reach for feet or shins',
        'Keep spine long'
      ],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
      videoUrl: 'https://youtu.be/g_tea8ZNk5A',
      difficulty: 'Beginner',
      category: 'Forward Fold'
    },
  ];

  useEffect(() => {
    filterYogaPoses();
  }, [selectedPhase]);

  const filterYogaPoses = () => {
    if (selectedPhase === 'All') {
      setYogaPoses(yogaData);
    } else {
      setYogaPoses(yogaData.filter(pose => pose.phase === selectedPhase));
    }
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

  // Timer functions
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startPoseTimer = (duration) => {
    setPoseTime(0);
    poseTimerRef.current = setInterval(() => {
      setPoseTime(prev => {
        if (prev >= duration) {
          nextPose();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopPoseTimer = () => {
    if (poseTimerRef.current) {
      clearInterval(poseTimerRef.current);
      poseTimerRef.current = null;
    }
  };

  // Session management
  const startYogaSession = (pose) => {
    const session = [pose];
    setSessionPoses(session);
    setCurrentPose(pose);
    setCurrentPoseIndex(0);
    setSessionTime(0);
    setPoseTime(0);
    setSessionProgress(0);
    setIsSessionActive(true);
    setIsPaused(false);
    startTimer();
    startPoseTimer(pose.durationSeconds);
  };

  const startQuickSession = () => {
    const quickSession = yogaPoses.slice(0, 3); // First 3 poses
    setSessionPoses(quickSession);
    setCurrentPose(quickSession[0]);
    setCurrentPoseIndex(0);
    setSessionTime(0);
    setPoseTime(0);
    setSessionProgress(0);
    setIsSessionActive(true);
    setIsPaused(false);
    startTimer();
    startPoseTimer(quickSession[0].durationSeconds);
  };

  const nextPose = () => {
    stopPoseTimer();
    const nextIndex = currentPoseIndex + 1;
    if (nextIndex < sessionPoses.length) {
      setCurrentPoseIndex(nextIndex);
      setCurrentPose(sessionPoses[nextIndex]);
      setPoseTime(0);
      setSessionProgress((nextIndex / sessionPoses.length) * 100);
      startPoseTimer(sessionPoses[nextIndex].durationSeconds);
    } else {
      endSession();
    }
  };

  const previousPose = () => {
    if (currentPoseIndex > 0) {
      stopPoseTimer();
      const prevIndex = currentPoseIndex - 1;
      setCurrentPoseIndex(prevIndex);
      setCurrentPose(sessionPoses[prevIndex]);
      setPoseTime(0);
      setSessionProgress((prevIndex / sessionPoses.length) * 100);
      startPoseTimer(sessionPoses[prevIndex].durationSeconds);
    }
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      startTimer();
      startPoseTimer(currentPose.durationSeconds - poseTime);
    } else {
      stopTimer();
      stopPoseTimer();
    }
  };

  const endSession = () => {
    stopTimer();
    stopPoseTimer();
    setIsSessionActive(false);
    setCurrentPose(null);
    setSessionTime(0);
    setPoseTime(0);
    setSessionProgress(0);
    setCurrentPoseIndex(0);
    setSessionPoses([]);

    Alert.alert(
      'Session Complete! 🎉',
      `Great job! You completed ${sessionPoses.length} poses in ${formatTime(sessionTime)}.`,
      [{ text: 'OK' }]
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Open video tutorial
  const openVideoTutorial = async (videoUrl) => {
    try {
      // Extract video ID from YouTube URL
      let videoId = '';
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('watch?v=')[1].split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      }
      
      // Try to open in YouTube app first, then fallback to browser
      const youtubeAppUrl = `vnd.youtube://${videoId}`;
      const youtubeBrowserUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      const canOpenApp = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpenApp) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        await Linking.openURL(youtubeBrowserUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open video tutorial. Please make sure you have YouTube app installed or a web browser.');
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopPoseTimer();
    };
  }, []);

  // Yoga Session Interface
  if (isSessionActive && currentPose) {
    return (
      <View style={styles.sessionContainer}>
        <ScrollView style={styles.sessionScrollView} showsVerticalScrollIndicator={false}>
          {/* Session Header */}
          <View style={styles.sessionHeader}>
            <TouchableOpacity onPress={endSession} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#E91E63" />
            </TouchableOpacity>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Yoga Session</Text>
              <Text style={styles.sessionTime}>{formatTime(sessionTime)}</Text>
            </View>
            <TouchableOpacity onPress={() => openVideoTutorial(currentPose.videoUrl)} style={styles.videoIconButton}>
              <Ionicons name="logo-youtube" size={28} color="#FF0000" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.sessionProgressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${sessionProgress}%` }]} />
            </View>
            <Text style={styles.sessionProgressText}>{Math.round(sessionProgress)}% Complete</Text>
          </View>

          {/* Pose Image */}
          <View style={styles.sessionImageContainer}>
            <Image
              source={{ uri: currentPose.image }}
              style={styles.sessionPoseImage}
              resizeMode="cover"
            />
            <View style={styles.sessionImageOverlay}>
              <Text style={styles.sessionPoseName}>{currentPose.name}</Text>
              <Text style={styles.sessionPosePhase}>{currentPose.phase} Phase</Text>
            </View>
          </View>

          {/* Pose Timer */}
          <View style={styles.poseTimerContainer}>
            <View style={styles.timerRow}>
              <Ionicons name="time-outline" size={24} color="#E91E63" />
              <Text style={styles.poseTimerText}>
                {formatTime(poseTime)} / {formatTime(currentPose.durationSeconds)}
              </Text>
            </View>
            <View style={styles.poseProgressBar}>
              <View style={[styles.poseProgressFill, { 
                width: `${(poseTime / currentPose.durationSeconds) * 100}%` 
              }]} />
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>📋 Step-by-Step Instructions:</Text>
            {currentPose.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumberCircle}>
                  <Text style={styles.instructionNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Benefits */}
          <View style={styles.sessionBenefitsContainer}>
            <Text style={styles.sessionBenefitsTitle}>✨ Benefits:</Text>
            {currentPose.benefits.map((benefit, index) => (
              <View key={index} style={styles.sessionBenefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.sessionBenefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Session Controls */}
          <View style={styles.sessionControls}>
            <TouchableOpacity 
              style={[styles.navControlButton, currentPoseIndex === 0 && styles.disabledButton]} 
              onPress={previousPose}
              disabled={currentPoseIndex === 0}
            >
              <Ionicons name="chevron-back" size={28} color={currentPoseIndex === 0 ? "#CCC" : "#E91E63"} />
              <Text style={[styles.navControlText, currentPoseIndex === 0 && styles.disabledText]}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.pauseButton} onPress={pauseSession}>
              <Ionicons name={isPaused ? "play" : "pause"} size={36} color="white" />
              <Text style={styles.pauseButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navControlButton, currentPoseIndex === sessionPoses.length - 1 && styles.disabledButton]} 
              onPress={nextPose}
              disabled={currentPoseIndex === sessionPoses.length - 1}
            >
              <Ionicons name="chevron-forward" size={28} color={currentPoseIndex === sessionPoses.length - 1 ? "#CCC" : "#E91E63"} />
              <Text style={[styles.navControlText, currentPoseIndex === sessionPoses.length - 1 && styles.disabledText]}>Next</Text>
            </TouchableOpacity>
          </View>

          {/* Session Stats */}
          <View style={styles.sessionStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentPoseIndex + 1}</Text>
              <Text style={styles.statLabel}>of {sessionPoses.length} Poses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentPose.difficulty}</Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentPose.category}</Text>
              <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>
          
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AnimatedCharacter
          type="yoga"
          size={60}
          color="#E91E63"
          showText={false}
        />
        <Text style={styles.title}>🧘‍♀️ Yoga & Exercise</Text>
        <Text style={styles.subtitle}>AI-suggested poses for your cycle phase</Text>
      </View>

      {/* Quick Session Button */}
      <View style={styles.quickSessionContainer}>
        <TouchableOpacity style={styles.quickSessionButton} onPress={startQuickSession}>
          <Ionicons name="flash" size={24} color="white" />
          <Text style={styles.quickSessionText}>Start Quick Session (3 poses)</Text>
        </TouchableOpacity>
      </View>

      {/* Phase Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.phaseFilter}
        contentContainerStyle={styles.phaseFilterContent}
      >
        {phases.map((phase) => (
          <TouchableOpacity
            key={phase}
            style={[
              styles.phaseButton,
              selectedPhase === phase && styles.selectedPhaseButton,
            ]}
            onPress={() => setSelectedPhase(phase)}
          >
            <Text style={[
              styles.phaseButtonText,
              selectedPhase === phase && styles.selectedPhaseButtonText,
            ]}>
              {phase}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Yoga Poses List */}
      <View style={styles.posesContainer}>
        {yogaPoses.map((pose) => (
          <View key={pose.id} style={styles.poseCard}>
            {/* Pose Image Header */}
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: pose.image }}
                style={styles.poseImageFull}
                resizeMode="cover"
                onLoadStart={() => {
                  setImageLoadingStates(prev => ({ ...prev, [pose.id]: true }));
                }}
                onLoadEnd={() => {
                  setImageLoadingStates(prev => ({ ...prev, [pose.id]: false }));
                }}
                onError={() => {
                  setImageErrors(prev => ({ ...prev, [pose.id]: true }));
                  setImageLoadingStates(prev => ({ ...prev, [pose.id]: false }));
                }}
              />
              {imageLoadingStates[pose.id] && (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="large" color="#E91E63" />
                </View>
              )}
              {imageErrors[pose.id] && (
                <View style={styles.imageErrorContainer}>
                  <Ionicons name="image-outline" size={48} color="#CCC" />
                  <Text style={styles.imageErrorText}>Image not available</Text>
                </View>
              )}
            </View>
            
            <View style={styles.poseContent}>
              <View style={styles.poseHeader}>
                <View style={styles.poseInfo}>
                  <Text style={styles.poseName}>{pose.name}</Text>
                  <View style={styles.poseMeta}>
                    <View style={[styles.phaseTag, { backgroundColor: getPhaseColor(pose.phase) }]}>
                      <Text style={styles.phaseTagText}>{pose.phase}</Text>
                    </View>
                    <View style={styles.difficultyTag}>
                      <Ionicons name="star" size={12} color="#FF9800" />
                      <Text style={styles.difficultyText}>{pose.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.durationBadge}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.durationText}>{pose.duration}</Text>
                </View>
              </View>

              <Text style={styles.poseDescription}>{pose.description}</Text>

              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                {pose.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.videoButton]}
                  onPress={() => openVideoTutorial(pose.videoUrl)}
                >
                  <Ionicons name="logo-youtube" size={22} color="#FF0000" />
                  <Text style={styles.videoButtonText}>Watch Tutorial</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.startButton]}
                  onPress={() => startYogaSession(pose)}
                >
                  <Ionicons name="fitness" size={22} color="white" />
                  <Text style={styles.startButtonText}>Start Session</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Tips */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons name="bulb" size={24} color="#FF9800" />
          <Text style={styles.tipsTitle}>Quick Tips</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.tipText}>Practice for at least 15-20 minutes daily</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="water" size={16} color="#666" />
          <Text style={styles.tipText}>Stay hydrated before and after practice</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="heart" size={16} color="#666" />
          <Text style={styles.tipText}>Listen to your body and modify poses as needed</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  phaseFilter: {
    marginBottom: 20,
  },
  phaseFilterContent: {
    paddingHorizontal: 20,
  },
  phaseButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPhaseButton: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  phaseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedPhaseButtonText: {
    color: 'white',
  },
  posesContainer: {
    paddingHorizontal: 20,
  },
  poseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  poseImageFull: {
    width: '100%',
    height: '100%',
  },
  imageLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  imageErrorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  imageErrorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  poseContent: {
    padding: 20,
  },
  poseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  poseInfo: {
    flex: 1,
    marginRight: 12,
  },
  poseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  poseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  phaseTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  phaseTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  difficultyText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '600',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  poseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  videoButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  videoButtonText: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  startButton: {
    backgroundColor: '#E91E63',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  tipsCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  // Quick Session Styles
  quickSessionContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quickSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quickSessionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Yoga Session Styles
  sessionContainer: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  sessionScrollView: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 8,
  },
  videoIconButton: {
    padding: 8,
  },
  sessionInfo: {
    flex: 1,
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sessionTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sessionProgressContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 3,
  },
  sessionProgressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sessionImageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 250,
    position: 'relative',
  },
  sessionPoseImage: {
    width: '100%',
    height: '100%',
  },
  sessionImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  sessionPoseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  sessionPosePhase: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  poseTimerContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  poseTimerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginLeft: 8,
  },
  poseProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  poseProgressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 4,
  },
  instructionsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  sessionBenefitsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sessionBenefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sessionBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionBenefitText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  sessionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  navControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E91E63',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  navControlText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
    marginLeft: 4,
  },
  disabledText: {
    color: '#CCC',
  },
  pauseButton: {
    backgroundColor: '#E91E63',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});

