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
      image: { uri: 'https://www.healthshots.com/wp-content/uploads/2023/05/childs-pose.jpg' },
      videoUrl: 'https://www.youtube.com/watch?v=SjB4sKe_IXk',
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
      image: { uri: 'https://media1.popsugar-assets.com/files/thumbor/bVzpK_JqkQDhJLqXDRVXNKqLxII/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2016/05/06/912/n/1922729/2e4d3f98_edit_img_cover_file_42649584_1462566893_Cat-Cow-Stretch/i/Cat-Cow-Stretch.jpg' },
      videoUrl: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
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
      image: { uri: 'https://www.shvasa.com/wp-content/uploads/2023/03/Warrior-II-Pose.jpg' },
      videoUrl: 'https://www.youtube.com/watch?v=NcCBaiCCl0A',
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
      image: { uri: 'https://www.myyogateacher.com/blog/wp-content/uploads/2022/08/Vrikshasana-Tree-Pose.jpg' },
      videoUrl: 'https://www.youtube.com/watch?v=Dic293YNJI8',
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
      image: { uri: 'https://rishikeshashtangayogaschool.com/blog/wp-content/uploads/2020/07/Bhujangasana.jpg' },
      videoUrl: 'https://www.youtube.com/watch?v=fOdrW7nf9gw',
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
      image: { uri: 'https://www.gynaecworld.com/wp-content/uploads/2022/09/Setu-Bandhasana-Bridge-Pose.jpg' },
      videoUrl: 'https://www.youtube.com/watch?v=hgtfNp8KywM',
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
      image: { uri: 'https://www.stylecraze.com/wp-content/uploads/2023/07/Viparita-Karani-Legs-Up-The-Wall-Pose.jpg' },
      videoUrl: 'https://www.youtube.com/watch?v=xmcDj4Bf--0',
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
      image: { uri: 'https://www.vinyasayogaacademy.com/blog/wp-content/uploads/2023/04/Paschimottanasana-Seated-Forward-Bend.jpg' },
      videoUrl: 'https://www.youtube.com/watch?v=T8sgVyF4Ux4',
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

  // Open YouTube video tutorial
  const openVideoTutorial = async (videoUrl) => {
    try {
      const canOpen = await Linking.canOpenURL(videoUrl);
      if (canOpen) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert('Error', 'Cannot open video tutorial. Please check your internet connection.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open video tutorial. Please try again later.');
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
      <ScrollView style={styles.sessionContainer}>
        <View style={styles.sessionContent}>
          {/* Session Header */}
          <View style={styles.sessionHeader}>
            <TouchableOpacity onPress={endSession} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#E91E63" />
            </TouchableOpacity>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>Practice Session</Text>
              <Text style={styles.sessionTime}>{formatTime(sessionTime)}</Text>
            </View>
            <TouchableOpacity onPress={() => openVideoTutorial(currentPose.videoUrl)} style={styles.videoIconButton}>
              <Ionicons name="logo-youtube" size={28} color="#FF0000" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${sessionProgress}%` }]} />
            </View>
            <Text style={styles.progressLabelText}>
              Pose {currentPoseIndex + 1} of {sessionPoses.length}
            </Text>
          </View>

          {/* Pose Image */}
          <View style={styles.sessionPoseImageContainer}>
            <Image
              source={currentPose.image}
              style={styles.sessionPoseImage}
              resizeMode="cover"
            />
            <View style={styles.poseInfoOverlay}>
              <View style={[styles.phaseTagSession, { backgroundColor: getPhaseColor(currentPose.phase) }]}>
                <Text style={styles.phaseTagText}>{currentPose.phase}</Text>
              </View>
              <View style={styles.difficultyTagSession}>
                <Ionicons name="star" size={14} color="#FF9800" />
                <Text style={styles.difficultyTagText}>{currentPose.difficulty}</Text>
              </View>
            </View>
          </View>

          {/* Pose Name and Timer */}
          <View style={styles.poseNameSection}>
            <Text style={styles.currentPoseName}>{currentPose.name}</Text>
            <Text style={styles.currentPoseDescription}>{currentPose.description}</Text>
            
            {/* Pose Timer */}
            <View style={styles.poseTimerContainer}>
              <Ionicons name="timer-outline" size={20} color="#E91E63" />
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

          {/* Benefits */}
          <View style={styles.sessionBenefitsContainer}>
            <View style={styles.sessionSectionHeader}>
              <Ionicons name="heart" size={20} color="#E91E63" />
              <Text style={styles.sessionSectionTitle}>Benefits</Text>
            </View>
            {currentPose.benefits.map((benefit, index) => (
              <View key={index} style={styles.sessionBenefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.sessionBenefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <View style={styles.sessionSectionHeader}>
              <Ionicons name="list" size={20} color="#E91E63" />
              <Text style={styles.sessionSectionTitle}>Step-by-Step Instructions</Text>
            </View>
            {currentPose.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumberBadge}>
                  <Text style={styles.instructionNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Important Tips */}
          <View style={styles.tipsSection}>
            <View style={styles.sessionSectionHeader}>
              <Ionicons name="information-circle" size={20} color="#FF9800" />
              <Text style={styles.sessionSectionTitle}>Important Tips</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="fitness" size={16} color="#666" />
              <Text style={styles.tipText}>Breathe deeply and maintain steady rhythm</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="warning" size={16} color="#666" />
              <Text style={styles.tipText}>Stop if you feel pain or discomfort</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="water" size={16} color="#666" />
              <Text style={styles.tipText}>Stay hydrated during practice</Text>
            </View>
          </View>

          {/* Session Controls */}
          <View style={styles.sessionControls}>
            <TouchableOpacity 
              style={[styles.navControlButton, currentPoseIndex === 0 && styles.disabledButton]} 
              onPress={previousPose}
              disabled={currentPoseIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color={currentPoseIndex === 0 ? "#CCC" : "white"} />
              <Text style={[styles.navButtonText, currentPoseIndex === 0 && styles.disabledButtonText]}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.pauseButton} onPress={pauseSession}>
              <Ionicons name={isPaused ? "play" : "pause"} size={36} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navControlButton, currentPoseIndex === sessionPoses.length - 1 && styles.disabledButton]} 
              onPress={nextPose}
              disabled={currentPoseIndex === sessionPoses.length - 1}
            >
              <Text style={[styles.navButtonText, currentPoseIndex === sessionPoses.length - 1 && styles.disabledButtonText]}>Next</Text>
              <Ionicons name="chevron-forward" size={24} color={currentPoseIndex === sessionPoses.length - 1 ? "#CCC" : "white"} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
                source={pose.image}
                style={styles.poseImageFull}
                resizeMode="cover"
              />
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
                  <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                  <Text style={styles.videoButtonText}>Watch Tutorial</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.startButton]}
                  onPress={() => startYogaSession(pose)}
                >
                  <Ionicons name="fitness" size={20} color="white" />
                  <Text style={styles.startButtonText}>Start Practice</Text>
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
  sessionContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 10,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sessionTime: {
    fontSize: 16,
    color: '#E91E63',
    marginTop: 4,
    fontWeight: '600',
  },
  progressBarContainer: {
    marginBottom: 20,
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
  progressLabelText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  sessionPoseImageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  sessionPoseImage: {
    width: '100%',
    height: '100%',
  },
  poseInfoOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phaseTagSession: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyTagSession: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  difficultyTagText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '700',
  },
  poseNameSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  currentPoseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  currentPoseDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  poseTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  poseTimerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  poseProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  poseProgressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 4,
  },
  sessionBenefitsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sessionSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sessionSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sessionBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  sessionBenefitText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  instructionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  instructionNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 15,
    color: '#666',
    flex: 1,
    lineHeight: 22,
    paddingTop: 4,
  },
  tipsSection: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  sessionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  navControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledButtonText: {
    color: '#999',
  },
  pauseButton: {
    backgroundColor: '#E91E63',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

