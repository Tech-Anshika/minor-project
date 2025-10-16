import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

class ProgressAnalyzer {
  constructor() {
    this.periodData = [];
    this.currentCycle = null;
    this.cyclePhase = 'unknown';
    this.recommendations = {};
  }

  // Load period data from Firestore
  async loadPeriodData() {
    return new Promise((resolve, reject) => {
      if (!auth.currentUser) {
        reject(new Error('User not authenticated'));
        return;
      }

      const q = query(
        collection(db, 'periodLogs', auth.currentUser.uid, 'entries'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        }));
        
        this.periodData = data;
        this.analyzeCurrentCycle();
        resolve(data);
      }, (error) => {
        reject(error);
      });

      return unsubscribe;
    });
  }

  // Analyze current cycle and determine phase
  analyzeCurrentCycle() {
    if (this.periodData.length === 0) {
      this.cyclePhase = 'unknown';
      return;
    }

    const today = new Date();
    const lastPeriod = this.periodData[0];
    const daysSinceLastPeriod = Math.floor((today - lastPeriod.date) / (1000 * 60 * 60 * 24));

    // Calculate average cycle length
    const cycleLengths = this.calculateCycleLengths();
    const avgCycleLength = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28; // Default 28 days

    // Determine cycle phase
    if (daysSinceLastPeriod <= 5) {
      this.cyclePhase = 'menstrual';
    } else if (daysSinceLastPeriod <= 13) {
      this.cyclePhase = 'follicular';
    } else if (daysSinceLastPeriod <= 16) {
      this.cyclePhase = 'ovulation';
    } else if (daysSinceLastPeriod <= avgCycleLength) {
      this.cyclePhase = 'luteal';
    } else {
      this.cyclePhase = 'premenstrual';
    }

    this.currentCycle = {
      phase: this.cyclePhase,
      daysSinceLastPeriod,
      avgCycleLength,
      nextPeriodPredicted: this.predictNextPeriod(),
      ovulationPredicted: this.predictOvulation(),
    };
  }

  // Calculate cycle lengths from historical data
  calculateCycleLengths() {
    const lengths = [];
    for (let i = 0; i < this.periodData.length - 1; i++) {
      const current = this.periodData[i].date;
      const next = this.periodData[i + 1].date;
      const length = Math.floor((current - next) / (1000 * 60 * 60 * 24));
      if (length > 0 && length < 50) { // Reasonable cycle length
        lengths.push(length);
      }
    }
    return lengths;
  }

  // Predict next period date
  predictNextPeriod() {
    if (this.periodData.length === 0) return null;
    
    const cycleLengths = this.calculateCycleLengths();
    const avgCycleLength = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28;

    const lastPeriod = this.periodData[0].date;
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength);
    return nextPeriod;
  }

  // Predict ovulation date
  predictOvulation() {
    if (this.periodData.length === 0) return null;
    
    const cycleLengths = this.calculateCycleLengths();
    const avgCycleLength = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28;

    const lastPeriod = this.periodData[0].date;
    const ovulation = new Date(lastPeriod);
    ovulation.setDate(ovulation.getDate() + Math.floor(avgCycleLength / 2));
    return ovulation;
  }

  // Generate personalized recommendations based on cycle phase and symptoms
  generateRecommendations() {
    if (!this.currentCycle) {
      return this.getDefaultRecommendations();
    }

    const phase = this.currentCycle.phase;
    const recentSymptoms = this.getRecentSymptoms();
    const avgPain = this.getAveragePain();
    const avgMood = this.getAverageMood();

    const recommendations = {
      waterIntake: this.calculateWaterIntake(phase, recentSymptoms),
      steps: this.calculateSteps(phase, recentSymptoms),
      exercise: this.getExerciseRecommendations(phase, recentSymptoms),
      nutrition: this.getNutritionRecommendations(phase, recentSymptoms),
      sleep: this.getSleepRecommendations(phase, recentSymptoms),
      supplements: this.getSupplementRecommendations(phase, recentSymptoms),
      mood: this.getMoodRecommendations(phase, avgMood),
      pain: this.getPainRecommendations(phase, avgPain),
    };

    this.recommendations = recommendations;
    return recommendations;
  }

  // Get recent symptoms (last 7 days)
  getRecentSymptoms() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.periodData
      .filter(entry => entry.date >= sevenDaysAgo)
      .flatMap(entry => entry.symptoms || []);
  }

  // Get average pain level
  getAveragePain() {
    if (this.periodData.length === 0) return 0;
    
    const recentEntries = this.periodData.slice(0, 7); // Last 7 entries
    const totalPain = recentEntries.reduce((sum, entry) => sum + (entry.pain || 0), 0);
    return Math.round(totalPain / recentEntries.length);
  }

  // Get average mood
  getAverageMood() {
    if (this.periodData.length === 0) return 'normal';
    
    const recentEntries = this.periodData.slice(0, 7);
    const moodCounts = {};
    
    recentEntries.forEach(entry => {
      const mood = entry.mood || 'normal';
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    return Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
  }

  // Calculate water intake based on cycle phase and symptoms
  calculateWaterIntake(phase, symptoms) {
    let baseIntake = 8; // 8 glasses base

    // Adjust based on cycle phase
    switch (phase) {
      case 'menstrual':
        baseIntake += 2; // Extra hydration during period
        break;
      case 'ovulation':
        baseIntake += 1; // Slight increase during ovulation
        break;
      case 'luteal':
        baseIntake += 1; // Slight increase during luteal phase
        break;
      case 'premenstrual':
        baseIntake += 2; // Extra hydration before period
        break;
    }

    // Adjust based on symptoms
    if (symptoms.includes('bloating')) {
      baseIntake += 1; // Extra water for bloating
    }
    if (symptoms.includes('fatigue')) {
      baseIntake += 1; // Extra water for fatigue
    }
    if (symptoms.includes('headache')) {
      baseIntake += 2; // Extra water for headaches
    }

    return {
      target: baseIntake,
      current: 0, // This would be tracked separately
      unit: 'glasses',
      phase: phase,
      reason: this.getWaterIntakeReason(phase, symptoms)
    };
  }

  // Calculate step goals based on cycle phase and symptoms
  calculateSteps(phase, symptoms) {
    let baseSteps = 8000; // Base 8000 steps

    // Adjust based on cycle phase
    switch (phase) {
      case 'menstrual':
        baseSteps = 6000; // Reduce during period
        break;
      case 'follicular':
        baseSteps = 10000; // Increase during follicular phase
        break;
      case 'ovulation':
        baseSteps = 12000; // Peak activity during ovulation
        break;
      case 'luteal':
        baseSteps = 8000; // Moderate during luteal phase
        break;
      case 'premenstrual':
        baseSteps = 6000; // Reduce before period
        break;
    }

    // Adjust based on symptoms
    if (symptoms.includes('fatigue')) {
      baseSteps = Math.max(4000, baseSteps - 2000);
    }
    if (symptoms.includes('cramps')) {
      baseSteps = Math.max(3000, baseSteps - 3000);
    }
    if (symptoms.includes('back_pain')) {
      baseSteps = Math.max(4000, baseSteps - 2000);
    }

    return {
      target: baseSteps,
      current: 0, // This would be tracked separately
      phase: phase,
      reason: this.getStepsReason(phase, symptoms)
    };
  }

  // Get exercise recommendations
  getExerciseRecommendations(phase, symptoms) {
    const recommendations = [];

    switch (phase) {
      case 'menstrual':
        recommendations.push(
          'Gentle yoga and stretching',
          'Light walking',
          'Swimming (if comfortable)',
          'Avoid high-intensity workouts'
        );
        break;
      case 'follicular':
        recommendations.push(
          'Cardio workouts',
          'Strength training',
          'High-intensity interval training',
          'Outdoor activities'
        );
        break;
      case 'ovulation':
        recommendations.push(
          'Peak performance workouts',
          'Competitive sports',
          'Challenging fitness classes',
          'Outdoor adventures'
        );
        break;
      case 'luteal':
        recommendations.push(
          'Moderate cardio',
          'Pilates or barre',
          'Light strength training',
          'Mindful movement'
        );
        break;
      case 'premenstrual':
        recommendations.push(
          'Gentle yoga',
          'Walking or light cardio',
          'Stretching and relaxation',
          'Avoid intense workouts'
        );
        break;
    }

    // Adjust based on symptoms
    if (symptoms.includes('cramps') || symptoms.includes('back_pain')) {
      recommendations.push('Focus on gentle stretching and relaxation');
    }
    if (symptoms.includes('fatigue')) {
      recommendations.push('Listen to your body and rest when needed');
    }

    return {
      recommendations,
      phase,
      intensity: this.getExerciseIntensity(phase, symptoms)
    };
  }

  // Get nutrition recommendations
  getNutritionRecommendations(phase, symptoms) {
    const recommendations = [];

    switch (phase) {
      case 'menstrual':
        recommendations.push(
          'Iron-rich foods (spinach, lean meat)',
          'Vitamin C for iron absorption',
          'Anti-inflammatory foods',
          'Stay hydrated'
        );
        break;
      case 'follicular':
        recommendations.push(
          'Balanced macronutrients',
          'Fresh fruits and vegetables',
          'Lean proteins',
          'Whole grains'
        );
        break;
      case 'ovulation':
        recommendations.push(
          'High-energy foods',
          'Complex carbohydrates',
          'Healthy fats',
          'Plenty of water'
        );
        break;
      case 'luteal':
        recommendations.push(
          'Magnesium-rich foods',
          'B-complex vitamins',
          'Fiber-rich foods',
          'Limit processed foods'
        );
        break;
      case 'premenstrual':
        recommendations.push(
          'Magnesium and calcium',
          'Omega-3 fatty acids',
          'Limit salt and sugar',
          'Small, frequent meals'
        );
        break;
    }

    // Adjust based on symptoms
    if (symptoms.includes('bloating')) {
      recommendations.push('Limit gas-producing foods', 'Drink peppermint tea');
    }
    if (symptoms.includes('cramps')) {
      recommendations.push('Increase magnesium intake', 'Eat anti-inflammatory foods');
    }

    return {
      recommendations,
      phase,
      focus: this.getNutritionFocus(phase, symptoms)
    };
  }

  // Get sleep recommendations
  getSleepRecommendations(phase, symptoms) {
    let targetHours = 8;
    let recommendations = ['Maintain consistent sleep schedule'];

    switch (phase) {
      case 'menstrual':
        targetHours = 9;
        recommendations.push('Extra rest during period', 'Warm bath before bed');
        break;
      case 'luteal':
        targetHours = 8.5;
        recommendations.push('Cool bedroom temperature', 'Limit caffeine in afternoon');
        break;
      case 'premenstrual':
        targetHours = 9;
        recommendations.push('Relaxation techniques', 'Avoid screens before bed');
        break;
    }

    if (symptoms.includes('fatigue')) {
      recommendations.push('Take short naps if needed', 'Prioritize sleep quality');
    }

    return {
      targetHours,
      recommendations,
      phase
    };
  }

  // Get supplement recommendations
  getSupplementRecommendations(phase, symptoms) {
    const supplements = [];

    // Base supplements for PCOS
    supplements.push('Inositol', 'Vitamin D3', 'Omega-3', 'Magnesium');

    // Phase-specific supplements
    switch (phase) {
      case 'menstrual':
        supplements.push('Iron', 'Vitamin C', 'Turmeric');
        break;
      case 'follicular':
        supplements.push('Folate', 'B-complex', 'Zinc');
        break;
      case 'ovulation':
        supplements.push('CoQ10', 'Vitamin E', 'Selenium');
        break;
      case 'luteal':
        supplements.push('Magnesium', 'B6', 'Evening Primrose Oil');
        break;
      case 'premenstrual':
        supplements.push('Magnesium', 'B6', 'Chasteberry');
        break;
    }

    // Symptom-specific supplements
    if (symptoms.includes('cramps')) {
      supplements.push('Magnesium', 'Ginger', 'Turmeric');
    }
    if (symptoms.includes('mood_swings')) {
      supplements.push('B6', 'Omega-3', 'St. John\'s Wort');
    }

    return {
      supplements: [...new Set(supplements)], // Remove duplicates
      phase,
      priority: this.getSupplementPriority(phase, symptoms)
    };
  }

  // Get mood recommendations
  getMoodRecommendations(phase, avgMood) {
    const recommendations = [];

    if (avgMood === 'sad' || avgMood === 'anxious') {
      recommendations.push('Practice mindfulness meditation');
      recommendations.push('Spend time in nature');
      recommendations.push('Connect with loved ones');
    }

    if (phase === 'premenstrual' || phase === 'menstrual') {
      recommendations.push('Gentle self-care activities');
      recommendations.push('Limit stressful activities');
      recommendations.push('Practice gratitude journaling');
    }

    return {
      recommendations,
      phase,
      currentMood: avgMood
    };
  }

  // Get pain management recommendations
  getPainRecommendations(phase, avgPain) {
    const recommendations = [];

    if (avgPain > 5) {
      recommendations.push('Apply heat therapy');
      recommendations.push('Gentle massage');
      recommendations.push('Over-the-counter pain relief');
    }

    if (phase === 'menstrual' && avgPain > 3) {
      recommendations.push('Rest and relaxation');
      recommendations.push('Gentle stretching');
      recommendations.push('Warm herbal tea');
    }

    return {
      recommendations,
      phase,
      painLevel: avgPain,
      severity: avgPain > 7 ? 'severe' : avgPain > 4 ? 'moderate' : 'mild'
    };
  }

  // Helper methods for reasons and explanations
  getWaterIntakeReason(phase, symptoms) {
    const reasons = [];
    
    if (phase === 'menstrual') {
      reasons.push('Extra hydration needed during period');
    }
    if (symptoms.includes('bloating')) {
      reasons.push('Extra water helps with bloating');
    }
    if (symptoms.includes('fatigue')) {
      reasons.push('Dehydration can worsen fatigue');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Maintain optimal hydration';
  }

  getStepsReason(phase, symptoms) {
    const reasons = [];
    
    if (phase === 'menstrual') {
      reasons.push('Gentle movement during period');
    } else if (phase === 'ovulation') {
      reasons.push('Peak energy during ovulation');
    }
    if (symptoms.includes('fatigue')) {
      reasons.push('Reduced activity due to fatigue');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Maintain healthy activity level';
  }

  getExerciseIntensity(phase, symptoms) {
    if (symptoms.includes('cramps') || symptoms.includes('fatigue')) {
      return 'low';
    }
    
    switch (phase) {
      case 'menstrual':
      case 'premenstrual':
        return 'low';
      case 'follicular':
        return 'moderate';
      case 'ovulation':
        return 'high';
      case 'luteal':
        return 'moderate';
      default:
        return 'moderate';
    }
  }

  getNutritionFocus(phase, symptoms) {
    if (symptoms.includes('cramps')) {
      return 'Anti-inflammatory and magnesium-rich foods';
    }
    if (symptoms.includes('bloating')) {
      return 'Low-sodium, easily digestible foods';
    }
    
    switch (phase) {
      case 'menstrual':
        return 'Iron-rich and anti-inflammatory foods';
      case 'follicular':
        return 'Balanced nutrition for energy';
      case 'ovulation':
        return 'High-energy, nutrient-dense foods';
      case 'luteal':
        return 'Magnesium and B-vitamin rich foods';
      case 'premenstrual':
        return 'Mood-supporting and anti-bloating foods';
      default:
        return 'Balanced nutrition';
    }
  }

  getSupplementPriority(phase, symptoms) {
    const priority = { high: [], medium: [], low: [] };
    
    // High priority for PCOS management
    priority.high.push('Inositol', 'Vitamin D3');
    
    // Phase-specific priorities
    if (phase === 'menstrual') {
      priority.high.push('Iron');
    }
    if (phase === 'luteal' || phase === 'premenstrual') {
      priority.high.push('Magnesium', 'B6');
    }
    
    // Symptom-specific priorities
    if (symptoms.includes('cramps')) {
      priority.high.push('Magnesium');
    }
    if (symptoms.includes('mood_swings')) {
      priority.medium.push('B6', 'Omega-3');
    }

    return priority;
  }

  // Get default recommendations when no data is available
  getDefaultRecommendations() {
    return {
      waterIntake: { target: 8, current: 0, unit: 'glasses', reason: 'Maintain optimal hydration' },
      steps: { target: 8000, current: 0, reason: 'Maintain healthy activity level' },
      exercise: { 
        recommendations: ['Moderate cardio', 'Strength training', 'Yoga'], 
        intensity: 'moderate' 
      },
      nutrition: { 
        recommendations: ['Balanced diet', 'Fresh fruits and vegetables', 'Lean proteins'], 
        focus: 'Balanced nutrition' 
      },
      sleep: { targetHours: 8, recommendations: ['Consistent sleep schedule'] },
      supplements: { 
        supplements: ['Inositol', 'Vitamin D3', 'Omega-3', 'Magnesium'], 
        priority: { high: ['Inositol', 'Vitamin D3'], medium: ['Omega-3'], low: ['Magnesium'] }
      },
      mood: { recommendations: ['Practice mindfulness', 'Stay connected with others'] },
      pain: { recommendations: ['Apply heat therapy', 'Gentle stretching'], severity: 'mild' }
    };
  }

  // Get progress summary
  getProgressSummary() {
    if (!this.currentCycle) {
      return {
        cyclePhase: 'unknown',
        daysInCycle: 0,
        nextPeriod: null,
        overallHealth: 'unknown'
      };
    }

    const recentSymptoms = this.getRecentSymptoms();
    const avgPain = this.getAveragePain();
    const avgMood = this.getAverageMood();

    let overallHealth = 'good';
    if (avgPain > 6 || recentSymptoms.length > 4) {
      overallHealth = 'needs_attention';
    } else if (avgPain > 3 || recentSymptoms.length > 2) {
      overallHealth = 'moderate';
    }

    return {
      cyclePhase: this.currentCycle.phase,
      daysInCycle: this.currentCycle.daysSinceLastPeriod,
      nextPeriod: this.currentCycle.nextPeriodPredicted,
      ovulation: this.currentCycle.ovulationPredicted,
      overallHealth,
      recentSymptoms: recentSymptoms.length,
      avgPain,
      avgMood
    };
  }
}

export default new ProgressAnalyzer();
