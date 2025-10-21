/**
 * Offline AI Health Assistant for PCOS/PCOD
 * A comprehensive rule-based AI system with pattern matching and contextual responses
 * No API keys required - completely free and offline
 */

class OfflineHealthAssistant {
  constructor() {
    // Knowledge base for different topics
    this.knowledgeBase = {
      // PCOS/PCOD Basic Information
      pcos_basics: [
        {
          keywords: ['what is pcos', 'what is pcod', 'explain pcos', 'pcos meaning', 'pcod meaning', 'difference between'],
          responses: [
            "PCOS (Polycystic Ovary Syndrome) and PCOD (Polycystic Ovarian Disease) are hormonal disorders affecting women of reproductive age. PCOS is more severe with metabolic issues, while PCOD is primarily about irregular periods and cysts. Both involve hormonal imbalances affecting ovaries, periods, and overall health.",
            "PCOS/PCOD happens when your ovaries produce excess male hormones (androgens), leading to irregular periods, weight gain, acne, and difficulty conceiving. It's very common - about 1 in 10 women have it. The good news is it's manageable with lifestyle changes!",
          ]
        },
        {
          keywords: ['cure', 'can pcos be cured', 'permanent solution', 'get rid of'],
          responses: [
            "While PCOS cannot be 'cured' permanently, it can be effectively managed! With the right combination of diet, exercise, stress management, and sometimes medication, most symptoms can be controlled. Many women lead completely normal, healthy lives with PCOS.",
            "Think of PCOS management as a lifestyle journey rather than a cure. Focus on: 1) Balanced diet with low GI foods 2) Regular exercise (150 mins/week) 3) Stress management 4) Quality sleep 5) Weight management. These can significantly reduce symptoms!",
          ]
        },
      ],

      // Symptoms
      symptoms: [
        {
          keywords: ['irregular period', 'missed period', 'no period', 'late period', 'period delay'],
          responses: [
            "Irregular periods are one of the most common PCOS symptoms. Track your cycles in our app to identify patterns. Generally: Menstrual phase support - consume iron-rich foods like palak, dates, and pomegranate. Consider seed cycling (flax + pumpkin seeds in first half of cycle).",
            "Period irregularity in PCOS happens due to hormonal imbalances affecting ovulation. Tips: 1) Maintain consistent sleep schedule 2) Reduce stress 3) Eat regular meals 4) Try chasteberry tea 5) Avoid crash diets. If periods are absent for >3 months, consult a gynecologist.",
          ]
        },
        {
          keywords: ['weight gain', 'cant lose weight', 'obesity', 'overweight', 'gaining weight'],
          responses: [
            "Weight gain with PCOS is frustrating but manageable! Insulin resistance makes it harder to lose weight. Focus on: 1) Low GI foods (brown rice, oats) 2) Protein with every meal 3) Strength training 4) 10,000 steps daily 5) Avoid sugar & refined carbs. Small consistent changes work better than crash diets!",
            "PCOS weight is stubborn because of insulin resistance. Indian diet tips: Replace white rice with brown rice/quinoa, roti with multigrain atta, regular tea with green tea. Add methi seeds water in morning. Try intermittent fasting (12-14 hours). Exercise: 30 mins daily - even brisk walking helps!",
          ]
        },
        {
          keywords: ['acne', 'pimples', 'skin problems', 'dark skin', 'pigmentation', 'facial hair', 'hirsutism'],
          responses: [
            "Acne & facial hair in PCOS are caused by excess androgens (male hormones). For acne: Drink 8-10 glasses water, avoid dairy, eat zinc-rich foods (pumpkin seeds, chickpeas). For facial hair: Spearmint tea (2 cups daily) naturally reduces androgens. Avoid waxing - consider threading or laser.",
            "Dark patches (acanthosis nigricans) signal insulin resistance. To improve: 1) Control blood sugar with low GI diet 2) Use natural scrubs (besan + turmeric) 3) Apply aloe vera 4) Lose 5-10% body weight 5) Take vitamin D supplements. Consistent skincare & diet changes show results in 2-3 months!",
          ]
        },
        {
          keywords: ['hair loss', 'hair fall', 'thinning hair', 'baldness'],
          responses: [
            "PCOS-related hair loss is due to high androgens. Natural remedies: 1) Onion juice + curry leaves paste on scalp 2) Methi seeds soaked overnight - eat & apply paste 3) Biotin supplements 4) Iron-rich diet (dates, pomegranate, spinach) 5) Reduce stress. Avoid tight hairstyles & heat styling!",
            "Hair fall tips for PCOS: Eat protein (dal, eggs, paneer), apply coconut oil + castor oil mix 2x/week, take amla juice daily, massage scalp to improve blood flow. Deficiency check: Get iron, vitamin D, B12 tested. Use mild sulfate-free shampoo. Patience - regrowth takes 3-6 months!",
          ]
        },
        {
          keywords: ['mood swings', 'depression', 'anxiety', 'stress', 'emotional', 'crying', 'irritable', 'angry'],
          responses: [
            "Hormonal imbalances in PCOS strongly affect mood. You're not alone! Try: 1) Daily 10-min meditation 2) Yoga (our app has PCOS-specific poses) 3) Omega-3 foods (walnuts, flaxseeds) 4) Magnesium-rich foods (dark chocolate, almonds) 5) Talk to friends/family. If severe, please consult a mental health professional.",
            "Managing PCOS emotions: Practice deep breathing (4-7-8 technique), maintain a gratitude journal, exercise daily (releases happy hormones!), ensure 7-8 hours sleep, reduce caffeine after 2 PM. Join PCOS support groups online. Remember: hormonal mood swings are temporary and manageable!",
          ]
        },
        {
          keywords: ['tired', 'fatigue', 'no energy', 'exhausted', 'weakness', 'lazy'],
          responses: [
            "PCOS fatigue is real! It's often due to insulin resistance, inflammation, or deficiencies. Boost energy: 1) Start day with protein breakfast 2) Avoid sugar crashes - eat every 3-4 hours 3) Stay hydrated 4) Take vitamin B12 & D supplements 5) Get bloodwork done (thyroid, iron, B12). Don't push through - rest when needed!",
            "Combat PCOS tiredness: Morning sunlight exposure (resets circadian rhythm), magnesium-rich foods (almonds, dark chocolate), avoid processed foods, try ashwagandha (stress adaptogen), ensure quality sleep (no screens 1 hour before bed). If extreme fatigue persists, check for thyroid issues with your doctor.",
          ]
        },
      ],

      // Diet & Nutrition
      diet: [
        {
          keywords: ['what to eat', 'diet plan', 'food', 'meal', 'breakfast', 'lunch', 'dinner', 'snacks'],
          responses: [
            "PCOS-friendly Indian diet: Breakfast - Palak poha/Besan chilla/Oats with nuts. Lunch - Brown rice/quinoa + sabzi + dal + salad. Evening snack - Roasted makhana/Fruit/Nuts. Dinner - Roti (multigrain) + paneer/chicken + soup. Key: Low GI, high fiber, balanced protein-carbs-healthy fats!",
            "Best PCOS foods in Delhi markets: Leafy greens (palak, methi), whole grains (jowar, bajra, quinoa), lean proteins (moong dal, rajma, chicken, eggs), healthy fats (ghee, nuts, seeds), fruits (apple, guava, papaya). Avoid: Maida, white rice, packaged foods, excessive tea/chai. Check our Food section for detailed recipes!",
          ]
        },
        {
          keywords: ['avoid', 'bad food', 'dont eat', 'what not to eat', 'restrict'],
          responses: [
            "Foods to limit/avoid in PCOS: 1) Refined carbs (maida, white bread, white rice) 2) Sugary foods (sweets, packaged juices, cold drinks) 3) Processed foods (chips, biscuits, fast food) 4) Excessive dairy (milk, paneer - some find it triggers acne) 5) Trans fats (fried foods, bakery items). Small portions occasionally are okay!",
            "Red flag foods for PCOS: Skip high-sugar breakfast cereals, instant noodles (Maggi), samosas, pakoras, kulfi, ice cream, regular soda. Indian sweets trigger insulin spikes. Instead: Choose stevia-sweetened options, air-fried snacks, homemade sugar-free desserts with dates/jaggery in moderation.",
          ]
        },
        {
          keywords: ['weight loss', 'lose weight', 'diet for weight loss', 'reduce weight'],
          responses: [
            "PCOS weight loss diet: Focus on insulin sensitivity! 1) Low-carb (not zero carb) - choose complex carbs 2) High protein (dal, eggs, chicken, paneer, Greek yogurt) 3) Healthy fats (ghee, nuts, coconut oil) 4) Intermittent fasting (12-14 hours) 5) No processed foods. Aim for 0.5-1 kg per month - slow & steady wins!",
            "Weight loss tips for PCOS: Start every meal with salad/vegetable, drink jeera water in morning, have dinner by 7-8 PM, walk 10k steps daily, strength train 3x/week, sleep 8 hours, manage stress (cortisol promotes belly fat!). Track portions - even healthy foods add up. Be patient - PCOS weight takes time!",
          ]
        },
        {
          keywords: ['supplements', 'vitamins', 'inositol', 'vitamin d', 'omega', 'magnesium'],
          responses: [
            "Beneficial PCOS supplements: 1) Inositol (improves insulin sensitivity) 2) Vitamin D (most PCOS women are deficient) 3) Omega-3 (reduces inflammation) 4) Magnesium (helps mood & sleep) 5) Zinc (for skin/hair) 6) Chromium (blood sugar control). Always consult a doctor before starting - get bloodwork to check deficiencies!",
            "Natural supplement sources: Vitamin D - 15 mins morning sunlight + fatty fish. Omega-3 - walnuts, flaxseeds, chia seeds. Magnesium - dark chocolate, almonds, spinach. Zinc - pumpkin seeds, chickpeas. Folate - leafy greens, lentils. Food-first approach is best, but supplements help with deficiencies!",
          ]
        },
      ],

      // Exercise & Yoga
      exercise: [
        {
          keywords: ['exercise', 'workout', 'gym', 'cardio', 'weight training', 'physical activity'],
          responses: [
            "Best PCOS exercises: 1) Strength training 3x/week (builds muscle, improves insulin sensitivity) 2) Moderate cardio 150 mins/week (brisk walking, cycling) 3) HIIT 2x/week (short bursts) 4) Yoga daily (stress relief) 5) 10,000 steps daily. Avoid: Excessive cardio (can spike cortisol). Mix of strength + cardio works best!",
            "Exercise plan for PCOS: Mon/Wed/Fri - 30 mins strength training (squats, lunges, push-ups, weights). Tue/Thu - 30 mins cardio (jogging, cycling, swimming). Sat - Yoga (check our Yoga section!). Sun - Active recovery (walk, stretch). Start small - even 15 mins daily counts. Consistency > intensity!",
          ]
        },
        {
          keywords: ['yoga', 'asana', 'pranayama', 'yoga poses', 'meditation'],
          responses: [
            "PCOS-friendly yoga poses in our app: 1) Butterfly pose (Baddha Konasana) - improves blood flow to pelvis 2) Cobra pose (Bhujangasana) - stimulates ovaries 3) Bridge pose (Setu Bandhasana) - balances hormones 4) Child's pose (Balasana) - relieves stress 5) Legs up wall (Viparita Karani) - calms nervous system. Practice 20-30 mins daily!",
            "Yoga benefits for PCOS: Reduces stress (lowers cortisol), improves insulin sensitivity, balances hormones, aids weight management, regulates periods. Start with gentle poses during menstruation, increase intensity in follicular phase. Add pranayama (breathing) - Anulom Vilom for 10 mins daily helps immensely!",
          ]
        },
        {
          keywords: ['walking', 'steps', 'daily walk', 'morning walk'],
          responses: [
            "Walking is AMAZING for PCOS! Target: 10,000 steps daily. Benefits: Improves insulin sensitivity, helps weight management, reduces stress, no equipment needed, gentle on joints. Tips: Morning walk (sunlight boosts vitamin D), post-meal walks (controls blood sugar), use our step counter, break it up throughout day. Every step counts!",
            "Daily walking strategy: Morning 20 mins (empty stomach - fat burning mode), after lunch 10 mins (blood sugar control), evening 20 mins (stress relief). Use stairs, park farther away, walk while on phone. In Delhi: Lodhi Garden, India Gate, Nehru Park are great spots. Aim for brisk pace where you can talk but not sing!",
          ]
        },
      ],

      // Menstrual Cycle & Fertility
      periods: [
        {
          keywords: ['period pain', 'cramps', 'menstrual pain', 'painful periods', 'dysmenorrhea'],
          responses: [
            "Natural remedies for period cramps: 1) Heat therapy - hot water bottle on abdomen 2) Ginger tea or chamomile tea 3) Gentle yoga (child's pose, cat-cow) 4) Magnesium-rich foods (dark chocolate, bananas) 5) Stay hydrated 6) Light walking. Avoid: Caffeine, salty foods. If pain is severe (can't function), see a doctor!",
            "PCOS period pain relief: Try ajwain water, saunf tea, warm sesame oil massage on lower abdomen, avoid cold foods/drinks during periods. Medications: Ibuprofen helps (if no contraindications). Long-term: Regular exercise & omega-3 reduce inflammation & pain. Track severity in app to identify patterns!",
          ]
        },
        {
          keywords: ['heavy bleeding', 'heavy period', 'bleeding', 'spotting'],
          responses: [
            "Heavy periods in PCOS can cause anemia. Eat iron-rich foods: dates, pomegranate, beetroot, spinach, jaggery. Drink nettle tea (reduces heavy flow). Take vitamin C with iron foods (improves absorption). If soaking >1 pad/hour or bleeding >7 days, consult doctor immediately - may need medication to regulate cycle.",
            "Managing heavy menstrual bleeding: Stay hydrated, avoid aspirin (increases bleeding), use period tracker, consume vitamin K (green leafy veggies), try shepherd's purse tea (natural astringent). Warning signs needing doctor: Clots larger than coin, dizziness, extreme fatigue, bleeding through pad in <2 hours.",
          ]
        },
        {
          keywords: ['pregnant', 'pregnancy', 'conceive', 'trying to conceive', 'fertility', 'infertility', 'ttc'],
          responses: [
            "PCOS affects fertility but many women conceive naturally! Tips: 1) Achieve healthy weight (even 5-10% loss helps) 2) Track ovulation (basal temp, ovulation kits) 3) Take folic acid daily 4) Reduce stress 5) Have sex every 2-3 days around ovulation. If trying >1 year without success, see a fertility specialist. Treatments like Clomid, IUI, IVF work well!",
            "Improving PCOS fertility naturally: Balance blood sugar (key!), reduce inflammatory foods, add fertility-boosting foods (eggs, nuts, seeds, leafy greens), maintain healthy BMI, consider inositol supplements, practice stress management. Partner should also optimize health (stop smoking, reduce alcohol, healthy diet). Be patient - it may take time but is possible!",
          ]
        },
        {
          keywords: ['ovulation', 'fertile days', 'when am i fertile', 'ovulation signs'],
          responses: [
            "Ovulation signs: 1) Egg white cervical mucus (clear, stretchy) 2) Mid-cycle spotting 3) Mild cramping on one side 4) Increased sex drive 5) Slight temperature rise. With PCOS, ovulation can be irregular. Use ovulation predictor kits (OPKs) or track basal body temperature. Fertile window is ~5 days before ovulation + ovulation day.",
            "PCOS ovulation tracking: Since cycles are irregular, standard day-14 ovulation may not apply. Use multiple methods: OPKs (test daily), cervical mucus check, basal body temperature (take every morning before getting up), track in period app. If not ovulating regularly, see doctor for ovulation induction medications.",
          ]
        },
      ],

      // Mental Health & Lifestyle
      mental_health: [
        {
          keywords: ['stress', 'stressed', 'tension', 'worried', 'overwhelmed'],
          responses: [
            "PCOS + stress create a vicious cycle (stress worsens hormones, hormones worsen mood). Break the cycle: 1) Daily meditation 10 mins (Headspace app) 2) Deep breathing (4-7-8 technique) 3) Exercise (releases endorphins) 4) Adequate sleep 7-8 hours 5) Talk to someone 6) Say no to over-commitment 7) Hobbies/fun activities. You've got this!",
            "Stress management for PCOS: Practice progressive muscle relaxation, journal your thoughts (5 mins daily), limit social media (comparison is thief of joy!), spend time in nature, listen to calming music, try aromatherapy (lavender oil). Remember: PCOS management is a marathon, not sprint. Be kind to yourself!",
          ]
        },
        {
          keywords: ['sleep', 'insomnia', 'cant sleep', 'sleep problems', 'sleeping'],
          responses: [
            "Sleep is CRUCIAL for PCOS - affects hormones, weight, mood! Better sleep tips: 1) Consistent schedule (even weekends) 2) No screens 1 hour before bed (blue light disrupts melatonin) 3) Dark, cool room 4) No caffeine after 2 PM 5) Chamomile tea before bed 6) Read/stretch before sleep 7) Magnesium supplement helps. Aim for 7-9 hours!",
            "PCOS sleep hygiene: Create bedtime routine (warm bath, gentle yoga, reading), avoid heavy meals after 8 PM, limit liquids 2 hours before bed (reduce bathroom trips), try melatonin supplement (if approved by doctor), practice 4-7-8 breathing in bed. Morning: Get sunlight exposure to reset circadian rhythm. Quality sleep = better hormone balance!",
          ]
        },
      ],

      // Medications & Treatment
      medications: [
        {
          keywords: ['metformin', 'medicine', 'medication', 'treatment', 'pills', 'birth control', 'contraceptive'],
          responses: [
            "Common PCOS medications: 1) Metformin (improves insulin sensitivity, may cause initial stomach upset) 2) Birth control pills (regulate periods, reduce androgens) 3) Spironolactone (anti-androgen for acne/hair) 4) Clomid (ovulation induction). All have pros/cons - work with your doctor to find what's right. Lifestyle changes are always foundation of treatment!",
            "About medications: They help manage symptoms but lifestyle changes are equally important. Birth control regulates cycles but doesn't 'treat' PCOS. Metformin helps insulin resistance. Always take as prescribed, report side effects to doctor. Don't stop suddenly. Combination of medication + diet + exercise gives best results. Regular follow-ups important!",
          ]
        },
      ],

      // Emergency & Medical Advice
      emergency: [
        {
          keywords: ['doctor', 'when to see doctor', 'hospital', 'gynecologist', 'consult'],
          responses: [
            "See a doctor if: 1) No period for 3+ months 2) Extremely heavy bleeding (>1 pad/hour) 3) Severe pelvic pain 4) Sudden weight changes (gain/loss >5kg in month) 5) Severe acne/hair growth 6) Trying to conceive >1 year 7) Depression/anxiety affecting daily life. Regular check-ups: Every 6 months for PCOS monitoring (hormones, ultrasound, sugar levels).",
            "Finding good PCOS doctor in Delhi: Look for gynecologist/endocrinologist specializing in PCOS. Good hospitals: AIIMS, Max Healthcare, Fortis, Apollo. Ask for comprehensive testing: Hormones (LH, FSH, testosterone, DHEA-S), fasting glucose/insulin, lipid profile, thyroid, ultrasound. A good doctor listens, doesn't dismiss symptoms, offers holistic approach (not just pills).",
          ]
        },
      ],

      // General Support
      support: [
        {
          keywords: ['help me', 'what should i do', 'advice', 'guide', 'lost', 'confused', 'dont know'],
          responses: [
            "I'm here to help! PCOS management has 4 pillars: 1) DIET - Low GI, balanced nutrition (check our Food section) 2) EXERCISE - 30 mins daily (check our Yoga section) 3) STRESS MANAGEMENT - Meditation, adequate sleep 4) MEDICAL CARE - Regular check-ups, medications if needed. Start small, pick one area to improve this week. What concerns you most right now?",
            "Let's tackle PCOS together! First step: Get proper diagnosis (ultrasound, blood tests). Then: Track your cycle in this app, start with 15-min daily walks, replace one unhealthy food with healthy option, practice 5-min breathing exercise. Small steps add up! Focus on progress, not perfection. You're not alone - millions manage PCOS successfully. What would you like to know more about?",
          ]
        },
        {
          keywords: ['thank you', 'thanks', 'helpful', 'appreciate'],
          responses: [
            "You're welcome! 😊 I'm always here to help. Remember, managing PCOS is a journey, and you're doing great by seeking information and taking care of yourself. Keep using the app to track your progress!",
            "Happy to help! 💕 Feel free to ask me anything, anytime. We're in this together. Check out the different sections of the app for yoga routines, meal plans, and progress tracking. You've got this!",
          ]
        },
        {
          keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
          responses: [
            "Hello! 👋 I'm your PCOS health assistant. I'm here to help you with questions about PCOS/PCOD, diet, exercise, symptoms, mental health, and more. What would you like to know today?",
            "Hi there! 😊 Welcome! I can help you with PCOS management, period tracking, nutrition advice, yoga recommendations, and answer any health questions you have. How can I assist you today?",
          ]
        },
      ],
    };

    // Quick action suggestions for users
    this.quickSuggestions = [
      "What should I eat for PCOS?",
      "How to manage period pain?",
      "Best exercises for PCOS",
      "How to lose weight with PCOS?",
      "What are PCOS symptoms?",
      "Natural remedies for PCOS",
      "Help with mood swings",
      "PCOS diet plan",
    ];

    // Empathetic fallback responses
    this.fallbackResponses = [
      "That's a great question! While I don't have specific information on that, I'd recommend: 1) Consulting your doctor for personalized advice 2) Checking reliable sources like medical journals 3) Joining PCOS support groups for shared experiences. Is there something specific about PCOS management I can help with?",
      "I want to help! Could you rephrase your question? I specialize in PCOS/PCOD topics like: symptoms management, diet & nutrition, exercise & yoga, mental health, menstrual cycle, fertility, and lifestyle tips. What aspect of PCOS would you like to know about?",
      "I'm still learning! For this specific query, I recommend consulting a healthcare professional. Meanwhile, I can help you with: PCOS symptoms, diet plans, exercise routines, stress management, period tracking tips, and more. What would you like to explore?",
    ];
  }

  /**
   * Main method to get AI response based on user query
   */
  getResponse(userMessage) {
    const normalizedQuery = userMessage.toLowerCase().trim();
    
    // Check all knowledge base categories
    for (const category in this.knowledgeBase) {
      const categoryData = this.knowledgeBase[category];
      
      for (const topic of categoryData) {
        // Check if any keyword matches
        const matchFound = topic.keywords.some(keyword => 
          normalizedQuery.includes(keyword.toLowerCase())
        );
        
        if (matchFound) {
          // Return a random response from the matching topic
          const responses = topic.responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // No match found - return fallback response
    return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
  }

  /**
   * Get quick suggestion buttons for user
   */
  getQuickSuggestions() {
    // Return 4 random suggestions
    const shuffled = [...this.quickSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }

  /**
   * Get context-aware greeting based on time of day
   */
  getGreeting() {
    const hour = new Date().getHours();
    let greeting = "Hello";
    
    if (hour < 12) greeting = "Good morning";
    else if (hour < 17) greeting = "Good afternoon";
    else greeting = "Good evening";

    return `${greeting}! 👋 I'm your personal PCOS health assistant. I'm here to help you manage PCOS/PCOD with diet tips, exercise guidance, symptom management, and emotional support. What would you like to know today?`;
  }

  /**
   * Get encouraging message based on user's interaction
   */
  getEncouragingMessage() {
    const messages = [
      "Remember: You're doing great by taking care of your health! 💪",
      "Small consistent steps lead to big changes. Keep going! ✨",
      "PCOS is manageable, and you're not alone in this journey. 💕",
      "Your health questions matter. Never hesitate to ask! 🌟",
      "Progress, not perfection! Every healthy choice counts. 🌸",
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// Export singleton instance
export default new OfflineHealthAssistant();


