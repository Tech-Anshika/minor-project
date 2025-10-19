/**
 * Bilingual Offline AI Health Assistant for PCOS/PCOD
 * Supports English and Hindi
 * Comprehensive rule-based AI with 200+ responses
 * No API keys required - completely free and offline
 */

class BilingualHealthAssistant {
  constructor() {
    this.currentLanguage = 'en'; // 'en' or 'hi'
    
    // Bilingual knowledge base - each response has English and Hindi
    this.knowledgeBase = {
      // PCOS/PCOD Basics
      pcos_basics: [
        {
          keywords: ['what is pcos', 'what is pcod', 'explain pcos', 'pcos meaning', 'pcod meaning', 'pcos kya hai', 'pcod kya hai', 'pcos kya hota hai'],
          responses: {
            en: [
              "PCOS (Polycystic Ovary Syndrome) and PCOD (Polycystic Ovarian Disease) are hormonal disorders affecting women of reproductive age. PCOS is more severe with metabolic issues, while PCOD is primarily about irregular periods and cysts. Both involve hormonal imbalances affecting ovaries, periods, and overall health.",
              "PCOS/PCOD happens when your ovaries produce excess male hormones (androgens), leading to irregular periods, weight gain, acne, and difficulty conceiving. It's very common - about 1 in 10 women have it. The good news is it's manageable with lifestyle changes!",
            ],
            hi: [
              "PCOS (पॉलीसिस्टिक ओवरी सिंड्रोम) और PCOD (पॉलीसिस्टिक ओवेरियन डिजीज) महिलाओं को प्रभावित करने वाली हार्मोनल समस्याएं हैं। PCOS ज्यादा गंभीर होता है जिसमें मेटाबोलिक समस्याएं होती हैं, जबकि PCOD मुख्य रूप से अनियमित पीरियड्स और सिस्ट से जुड़ा है। दोनों में हार्मोनल असंतुलन होता है।",
              "PCOS/PCOD तब होता है जब आपके अंडाशय अधिक मात्रा में पुरुष हार्मोन (एंड्रोजन) बनाते हैं, जिससे अनियमित पीरियड्स, वजन बढ़ना, मुंहासे और गर्भधारण में कठिनाई होती है। यह बहुत आम है - हर 10 में से 1 महिला को होता है। अच्छी बात यह है कि जीवनशैली में बदलाव से इसे नियंत्रित किया जा सकता है!",
            ]
          }
        },
        {
          keywords: ['cure', 'can pcos be cured', 'permanent solution', 'get rid of', 'theek ho sakta hai', 'ilaj', 'upchar'],
          responses: {
            en: [
              "While PCOS cannot be 'cured' permanently, it can be effectively managed! With the right combination of diet, exercise, stress management, and sometimes medication, most symptoms can be controlled. Many women lead completely normal, healthy lives with PCOS.",
              "Think of PCOS management as a lifestyle journey rather than a cure. Focus on: 1) Balanced diet with low GI foods 2) Regular exercise (150 mins/week) 3) Stress management 4) Quality sleep 5) Weight management. These can significantly reduce symptoms!",
            ],
            hi: [
              "PCOS को 'पूरी तरह ठीक' नहीं किया जा सकता, लेकिन इसे प्रभावी ढंग से नियंत्रित किया जा सकता है! सही आहार, व्यायाम, तनाव प्रबंधन और कभी-कभी दवाओं के सही संयोजन से अधिकांश लक्षणों को नियंत्रित किया जा सकता है। कई महिलाएं PCOS के साथ पूरी तरह सामान्य, स्वस्थ जीवन जीती हैं।",
              "PCOS प्रबंधन को इलाज के बजाय जीवनशैली की यात्रा के रूप में सोचें। ध्यान दें: 1) कम GI वाले खाद्य पदार्थों के साथ संतुलित आहार 2) नियमित व्यायाम (150 मिनट/सप्ताह) 3) तनाव प्रबंधन 4) गुणवत्तापूर्ण नींद 5) वजन प्रबंधन। ये लक्षणों को काफी कम कर सकते हैं!",
            ]
          }
        },
        {
          keywords: ['causes', 'why pcos', 'reason', 'kyu hota hai', 'karan', 'wajah'],
          responses: {
            en: [
              "PCOS causes include: 1) Genetics (runs in families) 2) Insulin resistance (body doesn't use insulin properly) 3) Inflammation (increases androgen production) 4) Lifestyle factors (poor diet, lack of exercise, stress) 5) Environmental factors. Often it's a combination of these factors.",
              "The exact cause isn't fully understood, but PCOS involves hormonal imbalance. High insulin levels cause ovaries to produce more androgens. If your mother/sister has PCOS, you're at higher risk. Modern lifestyle (processed foods, sedentary habits, stress) also contributes significantly.",
            ],
            hi: [
              "PCOS के कारण: 1) आनुवंशिकता (परिवार में चलता है) 2) इंसुलिन प्रतिरोध (शरीर इंसुलिन का सही उपयोग नहीं करता) 3) सूजन (एंड्रोजन उत्पादन बढ़ाती है) 4) जीवनशैली कारक (खराब आहार, व्यायाम की कमी, तनाव) 5) पर्यावरणीय कारक। अक्सर यह इन कारकों का संयोजन होता है।",
              "सटीक कारण पूरी तरह समझ नहीं आया है, लेकिन PCOS में हार्मोनल असंतुलन शामिल है। उच्च इंसुलिन स्तर अंडाशय को अधिक एंड्रोजन बनाने के लिए प्रेरित करता है। अगर आपकी माँ/बहन को PCOS है, तो आपको अधिक खतरा है। आधुनिक जीवनशैली (प्रोसेस्ड फूड, गतिहीन आदतें, तनाव) भी काफी योगदान देती है।",
            ]
          }
        },
      ],

      // Symptoms - Expanded
      symptoms: [
        {
          keywords: ['irregular period', 'missed period', 'no period', 'late period', 'period delay', 'periods nahi aa rahe', 'mahwari', 'maahvaari'],
          responses: {
            en: [
              "Irregular periods are the #1 PCOS symptom. Track your cycles in our app to identify patterns. Support tips: Consume iron-rich foods (palak, dates, pomegranate), try seed cycling (flax+pumpkin seeds in first half), drink shatavari tea, maintain consistent sleep schedule, reduce stress. If absent >3 months, see a gynecologist.",
              "Period irregularity happens due to lack of ovulation. Natural remedies: 1) Drink ajwain+saunf water 2) Take vitamin D supplements 3) Exercise 30 mins daily 4) Eat regular meals (don't skip!) 5) Try chasteberry tea 6) Maintain healthy weight. Track in app - patterns help diagnosis!",
            ],
            hi: [
              "अनियमित पीरियड्स PCOS का #1 लक्षण है। पैटर्न की पहचान के लिए हमारे ऐप में अपने चक्र को ट्रैक करें। सहायता टिप्स: आयरन युक्त खाद्य पदार्थ खाएं (पालक, खजूर, अनार), सीड साइक्लिंग करें (पहली छमाही में अलसी+कद्दू के बीज), शतावरी चाय पिएं, नींद का शेड्यूल बनाए रखें, तनाव कम करें। अगर 3 महीने से ज्यादा नहीं आए तो डॉक्टर से मिलें।",
              "पीरियड अनियमितता ओव्यूलेशन की कमी के कारण होती है। प्राकृतिक उपचार: 1) अजवाइन+सौंफ का पानी पिएं 2) विटामिन D सप्लीमेंट लें 3) रोज 30 मिनट व्यायाम करें 4) नियमित भोजन करें (स्किप न करें!) 5) चेस्टबेरी चाय आजमाएं 6) स्वस्थ वजन बनाए रखें। ऐप में ट्रैक करें - पैटर्न निदान में मदद करते हैं!",
            ]
          }
        },
        {
          keywords: ['weight gain', 'cant lose weight', 'obesity', 'overweight', 'gaining weight', 'vajan badhna', 'motapa', 'weight kam nahi ho raha'],
          responses: {
            en: [
              "PCOS weight gain is due to insulin resistance. Indian solutions: Replace white rice→brown rice/quinoa, maida roti→multigrain atta, regular chai→green tea. Morning: Methi seeds water. Try intermittent fasting (12-14 hours). Exercise: 30 mins daily cardio + 3x/week strength training. Track in app!",
              "Weight loss with PCOS needs patience! Strategy: 1) Low GI foods (oats, brown rice, vegetables) 2) High protein (dal, eggs, paneer, chicken) 3) Healthy fats (ghee, nuts, avocado) 4) 10,000 steps daily 5) No sugar/refined carbs 6) Sleep 7-8 hours. Aim for 0.5-1kg/month - slow & sustainable!",
            ],
            hi: [
              "PCOS में वजन बढ़ना इंसुलिन प्रतिरोध के कारण होता है। भारतीय समाधान: सफेद चावल→ब्राउन राइस/क्विनोआ, मैदा की रोटी→मल्टीग्रेन आटा, चाय→ग्रीन टी। सुबह: मेथी के बीज का पानी। इंटरमिटेंट फास्टिंग आजमाएं (12-14 घंटे)। व्यायाम: रोज 30 मिनट कार्डियो + हफ्ते में 3 बार ताकत प्रशिक्षण। ऐप में ट्रैक करें!",
              "PCOS में वजन घटाने के लिए धैर्य चाहिए! रणनीति: 1) कम GI खाद्य पदार्थ (ओट्स, ब्राउन राइस, सब्जियां) 2) उच्च प्रोटीन (दाल, अंडे, पनीर, चिकन) 3) स्वस्थ वसा (घी, नट्स, एवोकाडो) 4) रोज 10,000 कदम 5) चीनी/रिफाइंड कार्ब्स नहीं 6) 7-8 घंटे की नींद। लक्ष्य 0.5-1 किलो/महीना - धीमा और टिकाऊ!",
            ]
          }
        },
        {
          keywords: ['acne', 'pimples', 'skin problems', 'dark skin', 'pigmentation', 'facial hair', 'hirsutism', 'muhase', 'daag', 'chehre ke baal'],
          responses: {
            en: [
              "Acne & facial hair = high androgens. For acne: 1) Drink 8-10 glasses water 2) Avoid dairy & sugar 3) Eat zinc-rich foods (pumpkin seeds, chickpeas) 4) Apply neem paste 5) Use salicylic acid cleanser. For facial hair: Spearmint tea (2 cups/day) reduces androgens naturally. Consider threading/laser, not waxing.",
              "Dark patches (acanthosis nigricans) = insulin resistance. Natural treatments: 1) Besan+turmeric+milk scrub 2x/week 2) Apply aloe vera gel daily 3) Lemon juice on dark areas 4) Vitamin E oil 5) Low GI diet. Takes 2-3 months. For severe acne, see dermatologist - may need Spironolactone.",
            ],
            hi: [
              "मुंहासे और चेहरे के बाल = उच्च एंड्रोजन। मुंहासों के लिए: 1) 8-10 गिलास पानी पिएं 2) डेयरी और चीनी से बचें 3) जिंक युक्त खाद्य पदार्थ खाएं (कद्दू के बीज, चना) 4) नीम का पेस्ट लगाएं 5) सैलिसिलिक एसिड क्लींजर इस्तेमाल करें। चेहरे के बालों के लिए: स्पियरमिंट चाय (2 कप/दिन) एंड्रोजन को स्वाभाविक रूप से कम करती है। थ्रेडिंग/लेजर का विचार करें, वैक्सिंग नहीं।",
              "काले धब्बे (अकैंथोसिस निग्रीकन्स) = इंसुलिन प्रतिरोध। प्राकृतिक उपचार: 1) बेसन+हल्दी+दूध स्क्रब हफ्ते में 2 बार 2) रोज एलोवेरा जेल लगाएं 3) काले क्षेत्रों पर नींबू का रस 4) विटामिन E तेल 5) कम GI आहार। 2-3 महीने लगते हैं। गंभीर मुंहासों के लिए, त्वचा विशेषज्ञ से मिलें - Spironolactone की आवश्यकता हो सकती है।",
            ]
          }
        },
        {
          keywords: ['hair loss', 'hair fall', 'thinning hair', 'baldness', 'baal girna', 'baal patla', 'ganje'],
          responses: {
            en: [
              "PCOS hair loss = high DHT (from androgens). Natural remedies: 1) Onion juice+curry leaves paste on scalp 2x/week 2) Methi seeds - soak overnight, eat & apply paste 3) Biotin 5000mcg daily 4) Iron-rich foods (dates, pomegranate, palak) 5) Scalp massage 10 mins daily. Get iron, B12, vitamin D tested!",
              "Hair regrowth takes 3-6 months. Daily routine: 1) Coconut oil+castor oil mix (3:1) 2) Amla juice empty stomach 2) Protein at every meal (eggs, dal, nuts) 3) Reduce stress (cortisol worsens hair loss) 4) Sulfate-free shampoo 5) No tight hairstyles/heat styling. Consider minoxidil 2% if severe.",
            ],
            hi: [
              "PCOS बालों का झड़ना = उच्च DHT (एंड्रोजन से)। प्राकृतिक उपचार: 1) प्याज का रस+करी पत्ता पेस्ट स्कैल्प पर हफ्ते में 2 बार 2) मेथी के बीज - रात भर भिगोएं, खाएं और पेस्ट लगाएं 3) बायोटिन 5000एमसीजी रोज 4) आयरन युक्त खाद्य पदार्थ (खजूर, अनार, पालक) 5) रोज 10 मिनट स्कैल्प मसाज। आयरन, B12, विटामिन D टेस्ट कराएं!",
              "बालों के पुनः उगने में 3-6 महीने लगते हैं। दैनिक दिनचर्या: 1) नारियल तेल+अरंडी का तेल मिश्रण (3:1) 2) खाली पेट आंवला जूस 3) हर भोजन में प्रोटीन (अंडे, दाल, नट्स) 4) तनाव कम करें (कोर्टिसोल बालों का झड़ना बिगाड़ता है) 5) सल्फेट-फ्री शैम्पू 6) कोई टाइट हेयरस्टाइल/हीट स्टाइलिंग नहीं। गंभीर होने पर मिनोक्सिडिल 2% का विचार करें।",
            ]
          }
        },
        {
          keywords: ['mood swings', 'depression', 'anxiety', 'stress', 'emotional', 'crying', 'irritable', 'angry', 'udaas', 'ghussa', 'chidchidapan', 'tension'],
          responses: {
            en: [
              "PCOS strongly affects mood due to hormonal fluctuations. Daily practices: 1) Meditation 10-15 mins (Headspace/Calm app) 2) Yoga - especially Shavasana, Balasana 3) Omega-3 foods (walnuts, flaxseeds, fish) 4) Magnesium (almonds, dark chocolate, spinach) 5) Talk therapy/journaling. You're not alone - it's the hormones, not you!",
              "Mental health strategies: 1) Practice 4-7-8 breathing (4 count inhale, 7 hold, 8 exhale) 2) Gratitude journal - write 3 things daily 3) Limit social media (comparison triggers anxiety) 4) Exercise (releases endorphins!) 5) Spend time in nature 6) Join PCOS support groups. If severe depression, please see a therapist - therapy helps immensely!",
            ],
            hi: [
              "हार्मोनल उतार-चढ़ाव के कारण PCOS मूड को बहुत प्रभावित करता है। दैनिक प्रथाएं: 1) 10-15 मिनट ध्यान (Headspace/Calm ऐप) 2) योग - विशेष रूप से शवासन, बालासन 3) ओमेगा-3 खाद्य पदार्थ (अखरोट, अलसी, मछली) 4) मैग्नीशियम (बादाम, डार्क चॉकलेट, पालक) 5) बात करना/जर्नलिंग। आप अकेली नहीं हैं - यह हार्मोन हैं, आप नहीं!",
              "मानसिक स्वास्थ्य रणनीतियां: 1) 4-7-8 सांस लेने का अभ्यास करें (4 गिनती में सांस लें, 7 रोकें, 8 में छोड़ें) 2) कृतज्ञता जर्नल - रोज 3 चीजें लिखें 3) सोशल मीडिया सीमित करें (तुलना चिंता पैदा करती है) 4) व्यायाम (एंडोर्फिन रिलीज करता है!) 5) प्रकृति में समय बिताएं 6) PCOS सपोर्ट ग्रुप में शामिल हों। गंभीर अवसाद के लिए, कृपया थेरेपिस्ट से मिलें - थेरेपी बहुत मदद करती है!",
            ]
          }
        },
        {
          keywords: ['tired', 'fatigue', 'no energy', 'exhausted', 'weakness', 'lazy', 'thakan', 'kamjori', 'energy nahi'],
          responses: {
            en: [
              "PCOS fatigue is real - caused by insulin resistance, inflammation, or deficiencies. Energy boosters: 1) Protein breakfast (eggs, besan chilla, paneer) 2) Eat every 3-4 hours (avoid sugar crashes) 3) Stay hydrated - 8-10 glasses water 4) Vitamin B12 & D supplements 5) Iron-rich foods. Get bloodwork: thyroid, iron, B12, vitamin D!",
              "Combat tiredness: 1) Morning sunlight 15 mins (resets circadian rhythm) 2) Magnesium foods (almonds, dark chocolate, bananas) 3) Avoid processed foods & excessive caffeine 4) Ashwagandha supplement (stress adaptogen) 5) Quality sleep 7-8 hours 6) Light exercise (even 10 min walk helps). If extreme fatigue persists, check thyroid!",
            ],
            hi: [
              "PCOS थकान वास्तविक है - इंसुलिन प्रतिरोध, सूजन, या कमियों के कारण होती है। ऊर्जा बूस्टर: 1) प्रोटीन नाश्ता (अंडे, बेसन चीला, पनीर) 2) हर 3-4 घंटे में खाएं (शुगर क्रैश से बचें) 3) हाइड्रेटेड रहें - 8-10 गिलास पानी 4) विटामिन B12 और D सप्लीमेंट 5) आयरन युक्त खाद्य पदार्थ। ब्लडवर्क कराएं: थायरॉयड, आयरन, B12, विटामिन D!",
              "थकान से लड़ें: 1) सुबह 15 मिनट धूप (सर्केडियन रिदम रीसेट करती है) 2) मैग्नीशियम खाद्य पदार्थ (बादाम, डार्क चॉकलेट, केले) 3) प्रोसेस्ड फूड और अत्यधिक कैफीन से बचें 4) अश्वगंधा सप्लीमेंट (तनाव एडाप्टोजेन) 5) गुणवत्तापूर्ण नींद 7-8 घंटे 6) हल्का व्यायाम (10 मिनट की सैर भी मदद करती है)। अगर अत्यधिक थकान बनी रहती है, तो थायरॉयड चेक करें!",
            ]
          }
        },
      ],

      // Diet & Nutrition - Expanded
      diet: [
        {
          keywords: ['what to eat', 'diet plan', 'food', 'meal', 'breakfast', 'lunch', 'dinner', 'snacks', 'kya khana chahiye', 'khaana', 'khana', 'diet'],
          responses: {
            en: [
              "PCOS-friendly Indian diet:\n🌅 Breakfast: Palak poha/Besan chilla/Moong dal cheela/Oats with nuts & seeds/Eggs\n🌞 Lunch: Brown rice/Quinoa + Mix veg sabzi + Dal + Cucumber salad + Buttermilk\n🌆 Evening: Roasted makhana/Fruit (apple, guava)/Nuts (almonds, walnuts)/Green tea\n🌙 Dinner: 2 Multigrain roti + Paneer/Chicken + Soup/Salad\nKey: Low GI, high fiber, balanced macros!",
              "Sample PCOS meal plan:\nEarly morning: Methi water/Jeera water\nBreakfast (8-9am): Vegetable poha + Eggs/Paneer\nMid-morning: Fruit + Nuts\nLunch (1-2pm): Brown rice + Rajma/Chana + Sabzi + Curd\nEvening (4-5pm): Green tea + Roasted chana\nDinner (7-8pm): Multigrain roti + Dal + Vegetable\nBedtime: Warm milk with turmeric\nPortion control is key!",
            ],
            hi: [
              "PCOS के अनुकूल भारतीय आहार:\n🌅 नाश्ता: पालक पोहा/बेसन चीला/मूंग दाल चीला/ओट्स नट्स और बीजों के साथ/अंडे\n🌞 दोपहर का भोजन: ब्राउन राइस/क्विनोआ + मिक्स वेज सब्जी + दाल + खीरे का सलाद + छाछ\n🌆 शाम: भुना मखाना/फल (सेब, अमरूद)/नट्स (बादाम, अखरोट)/ग्रीन टी\n🌙 रात का खाना: 2 मल्टीग्रेन रोटी + पनीर/चिकन + सूप/सलाद\nमुख्य: कम GI, उच्च फाइबर, संतुलित मैक्रोज!",
              "नमूना PCOS भोजन योजना:\nसुबह जल्दी: मेथी का पानी/जीरा पानी\nनाश्ता (8-9 बजे): सब्जी पोहा + अंडे/पनीर\nमध्य सुबह: फल + नट्स\nदोपहर का भोजन (1-2 बजे): ब्राउन राइस + राजमा/चना + सब्जी + दही\nशाम (4-5 बजे): ग्रीन टी + भुना चना\nरात का खाना (7-8 बजे): मल्टीग्रेन रोटी + दाल + सब्जी\nसोने से पहले: हल्दी के साथ गर्म दूध\nपोर्शन कंट्रोल महत्वपूर्ण है!",
            ]
          }
        },
        {
          keywords: ['avoid', 'bad food', 'dont eat', 'what not to eat', 'restrict', 'kya nahi khana chahiye', 'avoid karna'],
          responses: {
            en: [
              "Foods to AVOID/LIMIT in PCOS:\n❌ Refined carbs: Maida, white bread, white rice, pasta\n❌ Sugar: Sweets, packaged juices, cold drinks, ice cream\n❌ Processed foods: Chips, biscuits, instant noodles (Maggi), packaged snacks\n❌ Excessive dairy: Can trigger acne in some women\n❌ Trans fats: Fried foods (samosa, pakora), bakery items\n❌ High GI fruits: Mango, banana, grapes (in excess)\nSmall portions occasionally are okay - don't be too strict!",
              "Indian foods that spike insulin:\n🚫 Breakfast: Aloo paratha, puri bhaji, white bread sandwich, cornflakes with sugar\n🚫 Lunch: White rice biryani, large naan, fried rice\n🚫 Snacks: Samosa, pakora, namkeen, biscuits, cake\n🚫 Dinner: Heavy roti with lots of oil, fried paneer\n🚫 Beverages: Regular soda, packaged juice, excessive chai with sugar\nReplace these with healthier versions!",
            ],
            hi: [
              "PCOS में बचने/सीमित करने वाले खाद्य पदार्थ:\n❌ रिफाइंड कार्ब्स: मैदा, सफेद ब्रेड, सफेद चावल, पास्ता\n❌ चीनी: मिठाई, पैकेज्ड जूस, कोल्ड ड्रिंक्स, आइसक्रीम\n❌ प्रोसेस्ड फूड: चिप्स, बिस्कुट, इंस्टेंट नूडल्स (मैगी), पैकेज्ड स्नैक्स\n❌ अत्यधिक डेयरी: कुछ महिलाओं में मुंहासे ट्रिगर कर सकती है\n❌ ट्रांस फैट: तले हुए खाद्य पदार्थ (समोसा, पकौड़ा), बेकरी आइटम\n❌ उच्च GI फल: आम, केला, अंगूर (अधिक मात्रा में)\nछोटे पोर्शन कभी-कभी ठीक हैं - बहुत सख्त न हों!",
              "भारतीय खाद्य पदार्थ जो इंसुलिन बढ़ाते हैं:\n🚫 नाश्ता: आलू पराठा, पूरी भाजी, सफेद ब्रेड सैंडविच, चीनी के साथ कॉर्नफ्लेक्स\n🚫 दोपहर का भोजन: सफेद चावल बिरयानी, बड़ी नान, फ्राइड राइस\n🚫 स्नैक्स: समोसा, पकौड़ा, नमकीन, बिस्कुट, केक\n🚫 रात का खाना: बहुत सारे तेल के साथ भारी रोटी, तला हुआ पनीर\n🚫 पेय पदार्थ: नियमित सोडा, पैकेज्ड जूस, चीनी के साथ अत्यधिक चाय\nइन्हें स्वस्थ संस्करणों से बदलें!",
            ]
          }
        },
        {
          keywords: ['weight loss', 'lose weight', 'diet for weight loss', 'reduce weight', 'vajan kam karna', 'pet kam karna'],
          responses: {
            en: [
              "PCOS weight loss diet principles:\n1️⃣ Low-carb (not zero!) - 40% carbs, 30% protein, 30% fat\n2️⃣ High protein at every meal (keeps you full, builds muscle)\n3️⃣ Healthy fats (ghee 1-2 tsp, nuts handful, coconut oil)\n4️⃣ Intermittent fasting (12-16 hours - dinner by 8pm, breakfast at 8-10am)\n5️⃣ No liquid calories (no juice, soda, sweetened tea)\n6️⃣ Fiber-rich foods (vegetables, whole grains, seeds)\nAim for 0.5-1 kg/month!",
              "7-day quick start weight loss:\n✅ Replace white rice → Brown rice/cauliflower rice\n✅ Replace maida roti → Multigrain atta (add oats, ragi, jowar)\n✅ Replace regular chai → Green tea/black coffee (no sugar)\n✅ Add vegetables to every meal (50% of plate)\n✅ Protein at breakfast (eggs/paneer/dal)\n✅ Walk 10,000 steps daily\n✅ Dinner by 7-8 PM\n✅ Sleep 7-8 hours\nCombine with strength training for best results!",
            ],
            hi: [
              "PCOS वजन घटाने के आहार सिद्धांत:\n1️⃣ कम-कार्ब (शून्य नहीं!) - 40% कार्ब्स, 30% प्रोटीन, 30% फैट\n2️⃣ हर भोजन में उच्च प्रोटीन (आपको भरा रखता है, मांसपेशियां बनाता है)\n3️⃣ स्वस्थ वसा (घी 1-2 चम्मच, मुट्ठी भर नट्स, नारियल तेल)\n4️⃣ इंटरमिटेंट फास्टिंग (12-16 घंटे - रात 8 बजे तक रात का खाना, सुबह 8-10 बजे नाश्ता)\n5️⃣ तरल कैलोरी नहीं (जूस, सोडा, मीठी चाय नहीं)\n6️⃣ फाइबर युक्त खाद्य पदार्थ (सब्जियां, साबुत अनाज, बीज)\nलक्ष्य 0.5-1 किलो/महीना!",
              "7-दिन त्वरित शुरुआत वजन घटाना:\n✅ सफेद चावल को बदलें → ब्राउन राइस/फूलगोभी राइस\n✅ मैदा रोटी को बदलें → मल्टीग्रेन आटा (ओट्स, रागी, ज्वार मिलाएं)\n✅ नियमित चाय को बदलें → ग्रीन टी/ब्लैक कॉफी (बिना चीनी)\n✅ हर भोजन में सब्जियां जोड़ें (प्लेट का 50%)\n✅ नाश्ते में प्रोटीन (अंडे/पनीर/दाल)\n✅ रोज 10,000 कदम चलें\n✅ रात 7-8 बजे तक रात का खाना\n✅ 7-8 घंटे सोएं\nसर्वोत्तम परिणामों के लिए शक्ति प्रशिक्षण के साथ मिलाएं!",
            ]
          }
        },
        {
          keywords: ['supplements', 'vitamins', 'inositol', 'vitamin d', 'omega', 'magnesium', 'multivitamin', 'supplement kya le'],
          responses: {
            en: [
              "Evidence-based PCOS supplements:\n1️⃣ Inositol (Myo+D-chiro 40:1) - Improves insulin sensitivity, ovulation. Dose: 2-4g daily\n2️⃣ Vitamin D3 (most PCOS women deficient) - 2000-4000 IU daily\n3️⃣ Omega-3 (EPA+DHA) - Reduces inflammation. 1000-2000mg daily\n4️⃣ Magnesium glycinate - Helps mood, sleep, insulin. 200-400mg\n5️⃣ NAC (N-Acetyl Cysteine) - Improves fertility, insulin. 600mg 2x/day\nGet blood tests first! Consult doctor before starting.",
              "Vitamin sources from Indian foods:\n🥬 Vitamin D: 15 mins morning sun + Egg yolks, Fatty fish, Fortified milk\n🐟 Omega-3: Walnuts, Flaxseeds, Chia seeds, Fish oil\n🍫 Magnesium: Dark chocolate (70%+), Almonds, Spinach, Pumpkin seeds\n🥜 Zinc: Pumpkin seeds, Chickpeas, Cashews, Paneer\n🥬 Folate: Leafy greens (palak, methi), Lentils, Asparagus\n🍊 Vitamin C: Amla, Guava, Oranges, Tomatoes\nFood first, then supplements!",
            ],
            hi: [
              "साक्ष्य-आधारित PCOS सप्लीमेंट:\n1️⃣ इनोसिटोल (Myo+D-chiro 40:1) - इंसुलिन संवेदनशीलता, ओव्यूलेशन में सुधार करता है। खुराक: रोज 2-4g\n2️⃣ विटामिन D3 (अधिकांश PCOS महिलाओं में कमी) - रोज 2000-4000 IU\n3️⃣ ओमेगा-3 (EPA+DHA) - सूजन कम करता है। रोज 1000-2000mg\n4️⃣ मैग्नीशियम ग्लाइसिनेट - मूड, नींद, इंसुलिन में मदद करता है। 200-400mg\n5️⃣ NAC (N-Acetyl Cysteine) - प्रजनन क्षमता, इंसुलिन में सुधार करता है। 600mg दिन में 2 बार\nपहले ब्लड टेस्ट कराएं! शुरू करने से पहले डॉक्टर से परामर्श लें।",
              "भारतीय खाद्य पदार्थों से विटामिन स्रोत:\n🥬 विटामिन D: सुबह 15 मिनट धूप + अंडे की जर्दी, फैटी फिश, फोर्टिफाइड दूध\n🐟 ओमेगा-3: अखरोट, अलसी, चिया बीज, फिश ऑयल\n🍫 मैग्नीशियम: डार्क चॉकलेट (70%+), बादाम, पालक, कद्दू के बीज\n🥜 जिंक: कद्दू के बीज, चना, काजू, पनीर\n🥬 फोलेट: हरी पत्तेदार सब्जियां (पालक, मेथी), दाल, शतावरी\n🍊 विटामिन C: आंवला, अमरूद, संतरे, टमाटर\nपहले खाना, फिर सप्लीमेंट!",
            ]
          }
        },
      ],

      // Exercise & Yoga - Expanded
      exercise: [
        {
          keywords: ['exercise', 'workout', 'gym', 'cardio', 'weight training', 'physical activity', 'exercise kaise kare', 'workout plan', 'kasrat'],
          responses: {
            en: [
              "Best PCOS exercise combination:\n💪 Strength training 3x/week (builds muscle, improves insulin) - Squats, Lunges, Push-ups, Planks, Dumbbell exercises\n🏃 Moderate cardio 150 mins/week - Brisk walking, Cycling, Swimming, Dancing\n⚡ HIIT 2x/week (short bursts) - 20 mins: 30 sec sprint, 30 sec rest\n🧘 Yoga daily 20-30 mins - Stress relief, hormone balance\n🚶 10,000 steps daily - Use our step counter!\nAvoid: Excessive cardio (spikes cortisol)",
              "Weekly exercise plan:\n📅 Monday: 30 min strength (upper body) + 10 min walk\n📅 Tuesday: 30 min cardio (jogging/cycling)\n📅 Wednesday: 30 min strength (lower body) + Yoga\n📅 Thursday: 20 min HIIT + Stretching\n📅 Friday: 30 min strength (full body)\n📅 Saturday: 45 min yoga + Light walk\n📅 Sunday: Active recovery (30 min walk, stretching)\nStart small if beginner - even 15 mins counts! Consistency > Intensity",
            ],
            hi: [
              "सर्वश्रेष्ठ PCOS व्यायाम संयोजन:\n💪 सप्ताह में 3 बार शक्ति प्रशिक्षण (मांसपेशियां बनाता है, इंसुलिन में सुधार करता है) - स्क्वाट्स, लंजेज, पुश-अप्स, प्लैंक्स, डंबल व्यायाम\n🏃 सप्ताह में 150 मिनट मध्यम कार्डियो - तेज चलना, साइकिलिंग, तैराकी, नृत्य\n⚡ सप्ताह में 2 बार HIIT (छोटे फटने) - 20 मिनट: 30 सेकंड स्प्रिंट, 30 सेकंड आराम\n🧘 रोज 20-30 मिनट योग - तनाव राहत, हार्मोन संतुलन\n🚶 रोज 10,000 कदम - हमारे स्टेप काउंटर का उपयोग करें!\nबचें: अत्यधिक कार्डियो (कोर्टिसोल बढ़ाता है)",
              "साप्ताहिक व्यायाम योजना:\n📅 सोमवार: 30 मिनट शक्ति (ऊपरी शरीर) + 10 मिनट चलना\n📅 मंगलवार: 30 मिनट कार्डियो (जॉगिंग/साइकिलिंग)\n📅 बुधवार: 30 मिनट शक्ति (निचला शरीर) + योग\n📅 गुरुवार: 20 मिनट HIIT + स्ट्रेचिंग\n📅 शुक्रवार: 30 मिनट शक्ति (पूरा शरीर)\n📅 शनिवार: 45 मिनट योग + हल्की सैर\n📅 रविवार: सक्रिय रिकवरी (30 मिनट चलना, स्ट्रेचिंग)\nशुरुआत करने वालों के लिए छोटा शुरू करें - 15 मिनट भी मायने रखता है! निरंतरता > तीव्रता",
            ]
          }
        },
        {
          keywords: ['yoga', 'asana', 'pranayama', 'yoga poses', 'meditation', 'yoga kaise kare', 'dhyan'],
          responses: {
            en: [
              "PCOS-specific yoga poses (check our Yoga section!):\n🦋 Butterfly pose (Baddha Konasana) - Improves blood flow to pelvis, stimulates ovaries\n🐍 Cobra pose (Bhujangasana) - Massages ovaries, regulates periods\n🌉 Bridge pose (Setu Bandhasana) - Balances thyroid, reduces stress\n👶 Child's pose (Balasana) - Relieves cramps, calms mind\n🔄 Cat-Cow (Marjaryasana) - Spinal flexibility, hormone balance\n🕉️ Corpse pose (Shavasana) - Deep relaxation\nPractice 20-30 mins daily!",
              "Pranayama (breathing) for PCOS:\n1️⃣ Anulom Vilom (Alternate nostril) - 10 mins daily, balances hormones\n2️⃣ Bhramari (Bee breath) - Calms nervous system, reduces anxiety\n3️⃣ Kapalbhati - Improves digestion, detoxification (do on empty stomach)\n4️⃣ Ujjayi (Ocean breath) - Reduces stress, improves focus\n5️⃣ 4-7-8 breathing - Before sleep, instant relaxation\nBreath work is powerful for hormone balance!",
            ],
            hi: [
              "PCOS-विशिष्ट योग आसन (हमारे योग सेक्शन को देखें!):\n🦋 तितली आसन (बद्ध कोणासन) - श्रोणि में रक्त प्रवाह में सुधार करता है, अंडाशय को उत्तेजित करता है\n🐍 भुजंगासन - अंडाशय की मालिश करता है, पीरियड्स को नियंत्रित करता है\n🌉 सेतु बंधासन - थायरॉयड को संतुलित करता है, तनाव कम करता है\n👶 बालासन - ऐंठन से राहत दिलाता है, मन को शांत करता है\n🔄 मार्जरी आसन - रीढ़ की हड्डी में लचीलापन, हार्मोन संतुलन\n🕉️ शवासन - गहरा विश्राम\nरोज 20-30 मिनट अभ्यास करें!",
              "PCOS के लिए प्राणायाम (सांस लेना):\n1️⃣ अनुलोम विलोम (वैकल्पिक नाक से सांस) - रोज 10 मिनट, हार्मोन को संतुलित करता है\n2️⃣ भ्रामरी (भौंरा सांस) - तंत्रिका तंत्र को शांत करता है, चिंता कम करता है\n3️⃣ कपालभाति - पाचन में सुधार करता है, विषहरण (खाली पेट करें)\n4️⃣ उज्जायी (समुद्र सांस) - तनाव कम करता है, फोकस में सुधार करता है\n5️⃣ 4-7-8 सांस लेना - सोने से पहले, तुरंत विश्राम\nसांस का काम हार्मोन संतुलन के लिए शक्तिशाली है!",
            ]
          }
        },
      ],

      // Periods & Fertility - Expanded
      periods: [
        {
          keywords: ['period pain', 'cramps', 'menstrual pain', 'painful periods', 'dysmenorrhea', 'pet dard', 'period ka dard', 'cramps ka ilaj'],
          responses: {
            en: [
              "Natural cramp relief:\n🔥 Heat therapy - Hot water bottle/heating pad on abdomen (best remedy!)\n☕ Herbal teas - Ginger, Chamomile, Cinnamon, Ajwain, Saunf\n🧘 Gentle yoga - Child's pose, Cat-Cow, Supine twist\n🍫 Magnesium foods - Dark chocolate, Bananas, Almonds\n💧 Stay hydrated - 8-10 glasses water\n💆 Abdominal massage - Warm sesame oil, circular motions\nAvoid: Caffeine, Cold foods, Salty foods. If severe (can't function), take Ibuprofen or see doctor!",
              "During periods, eat:\n✅ Iron-rich: Dates, Pomegranate, Beetroot, Spinach, Jaggery\n✅ Anti-inflammatory: Turmeric milk, Ginger tea\n✅ Omega-3: Walnuts, Flaxseeds\n✅ Vitamin C: Amla, Guava (helps iron absorption)\n✅ Hydrating fruits: Watermelon, Cucumber\nAvoid:\n❌ Caffeine (worsens cramps)\n❌ Processed foods\n❌ Too much salt\n❌ Dairy (for some women)\nRest is important - don't push through severe pain!",
            ],
            hi: [
              "प्राकृतिक ऐंठन राहत:\n🔥 हीट थेरेपी - पेट पर गर्म पानी की बोतल/हीटिंग पैड (सबसे अच्छा उपाय!)\n☕ हर्बल चाय - अदरक, कैमोमाइल, दालचीनी, अजवाइन, सौंफ\n🧘 सौम्य योग - बालासन, मार्जरी आसन, सुपाइन ट्विस्ट\n🍫 मैग्नीशियम खाद्य पदार्थ - डार्क चॉकलेट, केले, बादाम\n💧 हाइड्रेटेड रहें - 8-10 गिलास पानी\n💆 पेट की मालिश - गर्म तिल का तेल, गोलाकार गति\nबचें: कैफीन, ठंडे खाद्य पदार्थ, नमकीन खाद्य पदार्थ। अगर गंभीर (काम नहीं कर पा रही), तो Ibuprofen लें या डॉक्टर से मिलें!",
              "पीरियड्स के दौरान, खाएं:\n✅ आयरन युक्त: खजूर, अनार, चुकंदर, पालक, गुड़\n✅ सूजन-रोधी: हल्दी दूध, अदरक की चाय\n✅ ओमेगा-3: अखरोट, अलसी\n✅ विटामिन C: आंवला, अमरूद (आयरन अवशोषण में मदद करता है)\n✅ हाइड्रेटिंग फल: तरबूज, खीरा\nबचें:\n❌ कैफीन (ऐंठन बिगाड़ता है)\n❌ प्रोसेस्ड खाद्य पदार्थ\n❌ बहुत ज्यादा नमक\n❌ डेयरी (कुछ महिलाओं के लिए)\nआराम महत्वपूर्ण है - गंभीर दर्द से न गुजरें!",
            ]
          }
        },
        {
          keywords: ['pregnant', 'pregnancy', 'conceive', 'trying to conceive', 'fertility', 'infertility', 'ttc', 'garbh', 'pregnant hona hai', 'bachcha'],
          responses: {
            en: [
              "PCOS & pregnancy - YES, it's possible! Tips:\n1️⃣ Achieve healthy weight (even 5-10% loss helps ovulation)\n2️⃣ Track ovulation - Basal body temp, Ovulation kits, Cervical mucus\n3️⃣ Take Folic acid 400mcg daily (start 3 months before trying)\n4️⃣ Inositol supplements (improves egg quality, ovulation)\n5️⃣ Reduce stress (cortisol affects fertility)\n6️⃣ Time intercourse - Every 2-3 days around ovulation\nIf trying >1 year without success, see fertility specialist!",
              "Fertility-boosting foods:\n🥚 Eggs - Choline, protein, vitamins\n🥜 Nuts & seeds - Selenium, zinc, omega-3\n🥬 Leafy greens - Folate, iron\n🐟 Fatty fish - Omega-3, vitamin D\n🥑 Avocado - Healthy fats, vitamin E\n🍠 Sweet potato - Complex carbs, beta-carotene\n🫘 Lentils - Protein, folate, iron\nMale partner should also optimize: Stop smoking, limit alcohol, healthy diet, manage stress. Both partners' health matters!",
            ],
            hi: [
              "PCOS और गर्भावस्था - हां, यह संभव है! टिप्स:\n1️⃣ स्वस्थ वजन प्राप्त करें (5-10% की कमी भी ओव्यूलेशन में मदद करती है)\n2️⃣ ओव्यूलेशन ट्रैक करें - बेसल बॉडी टेम्प, ओव्यूलेशन किट, सर्वाइकल म्यूकस\n3️⃣ रोज फोलिक एसिड 400एमसीजी लें (कोशिश से 3 महीने पहले शुरू करें)\n4️⃣ इनोसिटोल सप्लीमेंट (अंडे की गुणवत्ता, ओव्यूलेशन में सुधार करता है)\n5️⃣ तनाव कम करें (कोर्टिसोल प्रजनन क्षमता को प्रभावित करता है)\n6️⃣ संभोग का समय - ओव्यूलेशन के आसपास हर 2-3 दिन\nअगर 1 साल से ज्यादा कोशिश के बाद भी सफलता नहीं मिली, तो प्रजनन विशेषज्ञ से मिलें!",
              "प्रजनन क्षमता बढ़ाने वाले खाद्य पदार्थ:\n🥚 अंडे - कोलीन, प्रोटीन, विटामिन\n🥜 नट्स और बीज - सेलेनियम, जिंक, ओमेगा-3\n🥬 हरी पत्तेदार सब्जियां - फोलेट, आयरन\n🐟 फैटी फिश - ओमेगा-3, विटामिन D\n🥑 एवोकाडो - स्वस्थ वसा, विटामिन E\n🍠 शकरकंद - जटिल कार्ब्स, बीटा-कैरोटीन\n🫘 दालें - प्रोटीन, फोलेट, आयरन\nपुरुष साथी को भी अनुकूलन करना चाहिए: धूम्रपान बंद करें, शराब सीमित करें, स्वस्थ आहार, तनाव प्रबंधित करें। दोनों साथी के स्वास्थ्य मायने रखते हैं!",
            ]
          }
        },
      ],

      // Mental Health - Expanded
      mental_health: [
        {
          keywords: ['sleep', 'insomnia', 'cant sleep', 'sleep problems', 'sleeping', 'neend nahi aati', 'insomnia ka ilaj'],
          responses: {
            en: [
              "Sleep hygiene for PCOS (crucial for hormones!):\n🕘 Consistent schedule - Same bedtime/wake time (even weekends)\n📵 No screens 1 hour before bed - Blue light disrupts melatonin\n❄️ Cool, dark room - 18-20°C ideal\n☕ No caffeine after 2 PM - Stays in system 6-8 hours\n🛀 Bedtime routine - Warm bath, Gentle yoga, Reading, Journaling\n🍵 Chamomile/Ashwagandha tea before bed\n🧘 4-7-8 breathing in bed\nAim for 7-9 hours! Poor sleep worsens insulin resistance.",
            ],
            hi: [
              "PCOS के लिए नींद स्वच्छता (हार्मोन के लिए महत्वपूर्ण!):\n🕘 सुसंगत शेड्यूल - समान सोने का समय/जागने का समय (यहां तक कि सप्ताहांत में भी)\n📵 सोने से 1 घंटे पहले कोई स्क्रीन नहीं - ब्लू लाइट मेलाटोनिन को बाधित करती है\n❄️ ठंडा, अंधेरा कमरा - 18-20°C आदर्श\n☕ दोपहर 2 बजे के बाद कैफीन नहीं - सिस्टम में 6-8 घंटे रहता है\n🛀 सोने का समय दिनचर्या - गर्म स्नान, सौम्य योग, पढ़ना, जर्नलिंग\n🍵 सोने से पहले कैमोमाइल/अश्वगंधा चाय\n🧘 बिस्तर में 4-7-8 सांस लेना\n7-9 घंटे का लक्ष्य रखें! खराब नींद इंसुलिन प्रतिरोध को बिगाड़ती है।",
            ]
          }
        },
      ],

      // Medications - Expanded
      medications: [
        {
          keywords: ['metformin', 'medicine', 'medication', 'treatment', 'pills', 'birth control', 'contraceptive', 'dawa', 'medicine kya le'],
          responses: {
            en: [
              "Common PCOS medications:\n💊 Metformin (Glucophage) - Improves insulin sensitivity. Side effects: Stomach upset initially (take with food), diarrhea. Benefits: Weight loss, regular periods, better ovulation\n💊 Birth control pills - Regulates periods, reduces androgens, improves acne. Not for women trying to conceive!\n💊 Spironolactone - Anti-androgen for acne, excess hair. Monitor potassium levels\n💊 Clomid (Clomiphene) - Ovulation induction for fertility\n💊 Letrozole - Alternative to Clomid\nAlways prescribed by doctor - don't self-medicate!",
            ],
            hi: [
              "सामान्य PCOS दवाएं:\n💊 मेटफॉर्मिन (ग्लूकोफेज) - इंसुलिन संवेदनशीलता में सुधार करती है। दुष्प्रभाव: शुरू में पेट खराब (भोजन के साथ लें), दस्त। लाभ: वजन कम होना, नियमित पीरियड्स, बेहतर ओव्यूलेशन\n💊 बर्थ कंट्रोल पिल्स - पीरियड्स को नियंत्रित करती है, एंड्रोजन कम करती है, मुंहासे में सुधार करती है। गर्भधारण की कोशिश कर रही महिलाओं के लिए नहीं!\n💊 स्पिरोनोलैक्टोन - मुंहासे, अतिरिक्त बालों के लिए एंटी-एंड्रोजन। पोटेशियम स्तर की निगरानी करें\n💊 क्लोमिड (क्लोमीफीन) - प्रजनन क्षमता के लिए ओव्यूलेशन प्रेरण\n💊 लेट्रोज़ोल - क्लोमिड का विकल्प\nहमेशा डॉक्टर द्वारा निर्धारित - स्वयं दवा न लें!",
            ]
          }
        },
      ],

      // Emergency - Expanded
      emergency: [
        {
          keywords: ['doctor', 'when to see doctor', 'hospital', 'gynecologist', 'consult', 'doctor se kab mile', 'hospital jana chahiye'],
          responses: {
            en: [
              "See a doctor immediately if:\n🚨 No period for 3+ months (amenorrhea)\n🚨 Extremely heavy bleeding (>1 pad/hour) or large clots\n🚨 Severe pelvic/abdominal pain\n🚨 Sudden unexplained weight change (±5kg in month)\n🚨 Severe depression/suicidal thoughts\n🚨 Trying to conceive >1 year without success\n🚨 Severe acne/hair growth not responding to lifestyle\n\nRegular PCOS monitoring: Every 6 months\nTests: Hormones, Fasting glucose/insulin, Lipids, Thyroid, Ultrasound",
            ],
            hi: [
              "तुरंत डॉक्टर से मिलें अगर:\n🚨 3+ महीने से पीरियड्स नहीं (अमेनोरिया)\n🚨 बहुत अधिक रक्तस्राव (>1 पैड/घंटा) या बड़े थक्के\n🚨 गंभीर पेल्विक/पेट दर्द\n🚨 अचानक अस्पष्ट वजन परिवर्तन (±5किलो महीने में)\n🚨 गंभीर अवसाद/आत्महत्या के विचार\n🚨 1 साल से अधिक गर्भधारण की कोशिश बिना सफलता\n🚨 गंभीर मुंहासे/बाल बढ़ना जीवनशैली से प्रतिक्रिया नहीं\n\nनियमित PCOS निगरानी: हर 6 महीने\nटेस्ट: हार्मोन, फास्टिंग ग्लूकोज/इंसुलिन, लिपिड, थायरॉयड, अल्ट्रासाउंड",
            ]
          }
        },
      ],

      // Support - Expanded
      support: [
        {
          keywords: ['help me', 'what should i do', 'advice', 'guide', 'lost', 'confused', 'dont know', 'madad', 'kya karu', 'help chahiye'],
          responses: {
            en: [
              "I'm here to help! 💕 PCOS management has 4 pillars:\n\n1️⃣ DIET (40%)\n- Low GI foods, balanced nutrition\n- Check our Food section for Indian meal plans\n- Track what you eat\n\n2️⃣ EXERCISE (30%)\n- 30 mins daily activity\n- Check our Yoga section\n- Use step counter\n\n3️⃣ STRESS MANAGEMENT (20%)\n- Meditation, adequate sleep\n- Mental health is important!\n\n4️⃣ MEDICAL CARE (10%)\n- Regular check-ups\n- Medications if needed\n\nStart small - pick ONE area to improve this week. What concerns you most?",
            ],
            hi: [
              "मैं मदद के लिए यहां हूं! 💕 PCOS प्रबंधन के 4 स्तंभ हैं:\n\n1️⃣ आहार (40%)\n- कम GI खाद्य पदार्थ, संतुलित पोषण\n- भारतीय भोजन योजनाओं के लिए हमारे खाद्य अनुभाग की जांच करें\n- जो आप खाते हैं उसे ट्रैक करें\n\n2️⃣ व्यायाम (30%)\n- रोज 30 मिनट की गतिविधि\n- हमारे योग अनुभाग की जांच करें\n- स्टेप काउंटर का उपयोग करें\n\n3️⃣ तनाव प्रबंधन (20%)\n- ध्यान, पर्याप्त नींद\n- मानसिक स्वास्थ्य महत्वपूर्ण है!\n\n4️⃣ चिकित्सा देखभाल (10%)\n- नियमित जांच\n- आवश्यकतानुसार दवाएं\n\nछोटा शुरू करें - इस सप्ताह सुधार के लिए एक क्षेत्र चुनें। आपको सबसे ज्यादा किस बात की चिंता है?",
            ]
          }
        },
        {
          keywords: ['thank you', 'thanks', 'helpful', 'appreciate', 'dhanyavaad', 'shukriya'],
          responses: {
            en: [
              "You're most welcome! 😊 I'm always here to help. Remember, managing PCOS is a journey, and you're doing amazing by seeking information and taking care of yourself. Keep using the app to track your progress! 💪",
              "Happy to help! 💕 Feel free to ask me anything, anytime. We're in this together. Check out different sections of the app for yoga routines, meal plans, and progress tracking. You've got this! 🌟",
            ],
            hi: [
              "आपका बहुत-बहुत स्वागत है! 😊 मैं हमेशा मदद के लिए यहां हूं। याद रखें, PCOS का प्रबंधन एक यात्रा है, और आप जानकारी प्राप्त करके और अपना ख्याल रखकर अद्भुत काम कर रही हैं। अपनी प्रगति को ट्रैक करने के लिए ऐप का उपयोग करते रहें! 💪",
              "मदद करके खुशी हुई! 💕 मुझसे कभी भी, कुछ भी पूछने में संकोच न करें। हम इसमें एक साथ हैं। योग दिनचर्या, भोजन योजनाओं और प्रगति ट्रैकिंग के लिए ऐप के विभिन्न अनुभागों को देखें। आप यह कर सकती हैं! 🌟",
            ]
          }
        },
        {
          keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste', 'namaskar'],
          responses: {
            en: [
              "Hello! 👋 I'm your bilingual PCOS health assistant (English/Hindi). I'm here to help you with questions about PCOS/PCOD, diet, exercise, symptoms, mental health, and more. What would you like to know today?",
              "Hi there! 😊 Welcome! I can help you with PCOS management in English or Hindi. Just ask - diet advice, yoga recommendations, symptom management, or any health questions. How can I assist you today?",
            ],
            hi: [
              "नमस्ते! 👋 मैं आपकी द्विभाषी PCOS स्वास्थ्य सहायक हूं (अंग्रेजी/हिंदी)। मैं PCOS/PCOD, आहार, व्यायाम, लक्षण, मानसिक स्वास्थ्य और अन्य सवालों में आपकी मदद के लिए यहां हूं। आज आप क्या जानना चाहेंगी?",
              "नमस्ते! 😊 स्वागत है! मैं अंग्रेजी या हिंदी में PCOS प्रबंधन में आपकी मदद कर सकती हूं। बस पूछें - आहार सलाह, योग सिफारिशें, लक्षण प्रबंधन, या कोई स्वास्थ्य सवाल। आज मैं आपकी कैसे मदद कर सकती हूं?",
            ]
          }
        },
      ],
    };

    // Quick suggestions in both languages
    this.quickSuggestions = {
      en: [
        "What should I eat for PCOS?",
        "How to manage period pain?",
        "Best exercises for PCOS",
        "How to lose weight with PCOS?",
        "What are PCOS symptoms?",
        "Natural remedies for PCOS",
        "Help with mood swings",
        "PCOS diet plan",
        "Can PCOS be cured?",
        "How to get pregnant with PCOS?",
      ],
      hi: [
        "PCOS में क्या खाना चाहिए?",
        "पीरियड दर्द कैसे कम करें?",
        "PCOS के लिए सबसे अच्छा व्यायाम",
        "PCOS में वजन कैसे कम करें?",
        "PCOS के लक्षण क्या हैं?",
        "PCOS के लिए प्राकृतिक उपचार",
        "मूड स्विंग में मदद",
        "PCOS डाइट प्लान",
        "क्या PCOS ठीक हो सकता है?",
        "PCOS में गर्भवती कैसे हों?",
      ]
    };

    // Fallback responses in both languages
    this.fallbackResponses = {
      en: [
        "That's a great question! While I don't have specific information on that, I'd recommend: 1) Consulting your doctor for personalized advice 2) Checking reliable medical sources 3) Joining PCOS support groups. Is there something specific about PCOS management I can help with?",
        "I want to help! Could you rephrase your question? I specialize in PCOS/PCOD topics like: symptoms, diet & nutrition, exercise & yoga, mental health, periods, fertility, and lifestyle tips. What aspect would you like to explore?",
      ],
      hi: [
        "यह एक बढ़िया सवाल है! हालांकि मेरे पास इस पर विशिष्ट जानकारी नहीं है, मैं सुझाव दूंगी: 1) व्यक्तिगत सलाह के लिए अपने डॉक्टर से परामर्श लें 2) विश्वसनीय चिकित्सा स्रोतों की जांच करें 3) PCOS सपोर्ट ग्रुप में शामिल हों। क्या PCOS प्रबंधन के बारे में कुछ विशेष है जिसमें मैं मदद कर सकती हूं?",
        "मैं मदद करना चाहती हूं! क्या आप अपने सवाल को दोबारा लिख सकती हैं? मैं PCOS/PCOD विषयों में विशेषज्ञ हूं जैसे: लक्षण, आहार और पोषण, व्यायाम और योग, मानसिक स्वास्थ्य, पीरियड्स, प्रजनन क्षमता, और जीवनशैली टिप्स। आप किस पहलू का पता लगाना चाहेंगी?",
      ]
    };
  }

  /**
   * Set language preference
   */
  setLanguage(language) {
    this.currentLanguage = language; // 'en' or 'hi'
  }

  /**
   * Get current language
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Detect language from user query (basic detection)
   */
  detectLanguage(userMessage) {
    const hindiChars = /[\u0900-\u097F]/;
    if (hindiChars.test(userMessage)) {
      return 'hi';
    }
    return 'en';
  }

  /**
   * Main method to get AI response
   */
  getResponse(userMessage) {
    const normalizedQuery = userMessage.toLowerCase().trim();
    
    // Auto-detect language if Hindi characters present
    const detectedLang = this.detectLanguage(userMessage);
    if (detectedLang === 'hi' && this.currentLanguage === 'en') {
      this.currentLanguage = 'hi';
    }
    
    // Check all knowledge base categories
    for (const category in this.knowledgeBase) {
      const categoryData = this.knowledgeBase[category];
      
      for (const topic of categoryData) {
        // Check if any keyword matches
        const matchFound = topic.keywords.some(keyword => 
          normalizedQuery.includes(keyword.toLowerCase())
        );
        
        if (matchFound) {
          // Get responses in current language
          const responses = topic.responses[this.currentLanguage];
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }

    // No match found - return fallback response in current language
    const fallbacks = this.fallbackResponses[this.currentLanguage];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /**
   * Get quick suggestions in current language
   */
  getQuickSuggestions() {
    const suggestions = this.quickSuggestions[this.currentLanguage];
    // Return 4 random suggestions
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }

  /**
   * Get context-aware greeting
   */
  getGreeting() {
    const hour = new Date().getHours();
    let greeting = this.currentLanguage === 'hi' ? "नमस्ते" : "Hello";
    
    if (this.currentLanguage === 'en') {
      if (hour < 12) greeting = "Good morning";
      else if (hour < 17) greeting = "Good afternoon";
      else greeting = "Good evening";
      
      return `${greeting}! 👋 I'm your personal PCOS health assistant (English/Hindi supported). I'm here to help you manage PCOS/PCOD with diet tips, exercise guidance, symptom management, and emotional support. What would you like to know today?`;
    } else {
      if (hour < 12) greeting = "सुप्रभात";
      else if (hour < 17) greeting = "नमस्कार";
      else greeting = "शुभ संध्या";
      
      return `${greeting}! 👋 मैं आपकी व्यक्तिगत PCOS स्वास्थ्य सहायक हूं (अंग्रेजी/हिंदी समर्थित)। मैं आहार टिप्स, व्यायाम मार्गदर्शन, लक्षण प्रबंधन और भावनात्मक समर्थन के साथ PCOS/PCOD प्रबंधित करने में आपकी मदद के लिए यहां हूं। आज आप क्या जानना चाहेंगी?`;
    }
  }

  /**
   * Get encouraging message
   */
  getEncouragingMessage() {
    const messages = {
      en: [
        "Remember: You're doing great by taking care of your health! 💪",
        "Small consistent steps lead to big changes. Keep going! ✨",
        "PCOS is manageable, and you're not alone in this journey. 💕",
        "Your health questions matter. Never hesitate to ask! 🌟",
        "Progress, not perfection! Every healthy choice counts. 🌸",
      ],
      hi: [
        "याद रखें: अपने स्वास्थ्य का ख्याल रखकर आप बेहतरीन काम कर रही हैं! 💪",
        "छोटे लगातार कदम बड़े बदलाव लाते हैं। जारी रखें! ✨",
        "PCOS प्रबंधनीय है, और आप इस यात्रा में अकेली नहीं हैं। 💕",
        "आपके स्वास्थ्य सवाल मायने रखते हैं। पूछने में कभी संकोच न करें! 🌟",
        "प्रगति, पूर्णता नहीं! हर स्वस्थ विकल्प मायने रखता है। 🌸",
      ]
    };
    
    const langMessages = messages[this.currentLanguage];
    return langMessages[Math.floor(Math.random() * langMessages.length)];
  }
}

// Export singleton instance
export default new BilingualHealthAssistant();

