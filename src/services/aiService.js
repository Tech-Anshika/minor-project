import axios from 'axios';

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

class AIService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.baseURL = GEMINI_API_URL;
  }

  async generateContent(prompt, context = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: this.buildPrompt(prompt, context)
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get AI response');
    }
  }

  buildPrompt(userMessage, context) {
    const basePrompt = `You are PcoSense, a specialized AI health assistant for women with PCOD/PCOS. 
    You provide supportive, evidence-based advice while being empathetic and understanding.
    
    Context about the user:
    - Age: ${context.age || 'Not specified'}
    - Weight: ${context.weight || 'Not specified'}
    - Current cycle phase: ${context.cyclePhase || 'Not specified'}
    - Symptoms: ${context.symptoms?.join(', ') || 'Not specified'}
    - Cycle length: ${context.cycleLength || 28} days
    
    Guidelines:
    1. Always be supportive and non-judgmental
    2. Provide evidence-based information
    3. Encourage consulting healthcare providers for medical advice
    4. Focus on lifestyle modifications that can help with PCOD/PCOS
    5. Be specific about diet, exercise, and stress management
    6. Keep responses concise but informative
    7. Use emojis sparingly and appropriately
    8. If the question is not related to PCOD/PCOS or women's health, politely redirect
    
    User's question: ${userMessage}
    
    Please provide a helpful response:`;

    return basePrompt;
  }

  // Get diet suggestions based on cycle phase
  async getDietSuggestions(cyclePhase, symptoms = []) {
    const prompt = `Suggest specific foods and meal ideas for a woman in the ${cyclePhase} phase of her menstrual cycle who has PCOD/PCOS. 
    Current symptoms: ${symptoms.join(', ')}. 
    Focus on foods that help with hormonal balance and symptom management.`;
    
    return await this.generateContent(prompt, { cyclePhase, symptoms });
  }

  // Get exercise recommendations
  async getExerciseRecommendations(cyclePhase, fitnessLevel = 'beginner') {
    const prompt = `Recommend specific exercises and yoga poses for a woman in the ${cyclePhase} phase with PCOD/PCOS. 
    Fitness level: ${fitnessLevel}. 
    Include duration, intensity, and benefits for PCOD management.`;
    
    return await this.generateContent(prompt, { cyclePhase, fitnessLevel });
  }

  // Get symptom management advice
  async getSymptomAdvice(symptoms) {
    const prompt = `Provide practical advice for managing these PCOD/PCOS symptoms: ${symptoms.join(', ')}. 
    Include lifestyle modifications, dietary changes, and stress management techniques.`;
    
    return await this.generateContent(prompt, { symptoms });
  }

  // Get general health tips
  async getHealthTips(cyclePhase, currentGoals = []) {
    const prompt = `Give personalized health tips for a woman with PCOD/PCOS in the ${cyclePhase} phase. 
    Current goals: ${currentGoals.join(', ')}. 
    Focus on practical, actionable advice.`;
    
    return await this.generateContent(prompt, { cyclePhase, currentGoals });
  }

  // Analyze progress and provide insights
  async analyzeProgress(progressData) {
    const prompt = `Analyze this PCOD/PCOS management progress data and provide insights:
    - Yoga days this week: ${progressData.yogaDays || 0}
    - Diet adherence: ${progressData.dietDays || 0} days
    - Medication compliance: ${progressData.medicationDays || 0} days
    - Average steps: ${progressData.avgSteps || 0}
    - Water intake: ${progressData.avgWater || 0} glasses
    
    Provide encouragement and specific recommendations for improvement.`;
    
    return await this.generateContent(prompt, progressData);
  }

  // Get period prediction insights
  async getPeriodInsights(cycleData) {
    const prompt = `Based on this menstrual cycle data, provide insights:
    - Cycle length: ${cycleData.cycleLength} days
    - Last period: ${cycleData.lastPeriod}
    - Current day: ${cycleData.currentDay}
    - Phase: ${cycleData.phase}
    
    Predict next period date and provide phase-specific health recommendations.`;
    
    return await this.generateContent(prompt, cycleData);
  }

  // Get stress management advice
  async getStressManagementAdvice(stressLevel = 'moderate') {
    const prompt = `Provide stress management techniques specifically for women with PCOD/PCOS. 
    Current stress level: ${stressLevel}. 
    Include breathing exercises, meditation, and lifestyle changes that help with hormonal balance.`;
    
    return await this.generateContent(prompt, { stressLevel });
  }

  // Get sleep optimization tips
  async getSleepTips(sleepIssues = []) {
    const prompt = `Provide sleep optimization tips for women with PCOD/PCOS who experience: ${sleepIssues.join(', ')}. 
    Include bedtime routines, sleep hygiene, and natural remedies.`;
    
    return await this.generateContent(prompt, { sleepIssues });
  }

  // Get fertility awareness information
  async getFertilityInfo(cyclePhase, tryingToConceive = false) {
    const prompt = `Provide fertility awareness information for a woman with PCOD/PCOS in the ${cyclePhase} phase. 
    Trying to conceive: ${tryingToConceive}. 
    Include cycle tracking tips and when to consult a fertility specialist.`;
    
    return await this.generateContent(prompt, { cyclePhase, tryingToConceive });
  }
}

export default new AIService();
