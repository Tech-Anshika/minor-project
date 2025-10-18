import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FoodScreen() {
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietType, setSelectedDietType] = useState('All');
  const [foodItems, setFoodItems] = useState([]);

  const phases = ['All', 'Menstrual', 'Follicular', 'Ovulation', 'Luteal'];
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages'];
  const dietTypes = ['All', 'Vegetarian', 'Non-Vegetarian'];

  const foodData = [
    // VEGETARIAN FOODS
    {
      id: 1,
      name: 'Palak (Spinach) Poha',
      phase: 'Menstrual',
      category: 'Breakfast',
      dietType: 'Vegetarian',
      calories: 280,
      prepTime: '15 mins',
      ingredients: ['Poha (flattened rice)', 'Palak (Spinach)', 'Onion', 'Peanuts', 'Lemon', 'Haldi (Turmeric)'],
      benefits: ['High in iron for blood loss recovery', 'Easy to digest during cramps', 'Boosts energy naturally', 'Rich in vitamin C for iron absorption'],
      description: 'Iron-rich breakfast perfect for replenishing nutrients during menstruation.',
      image: '🍚',
    },
    {
      id: 2,
      name: 'Moong Dal Khichdi with Dahi',
      phase: 'Menstrual',
      category: 'Lunch',
      dietType: 'Vegetarian',
      calories: 350,
      prepTime: '20 mins',
      ingredients: ['Moong dal', 'Rice', 'Ghee', 'Jeera (Cumin)', 'Dahi (Curd)', 'Ginger'],
      benefits: ['Easy to digest during cramps', 'Complete protein source', 'Reduces menstrual discomfort', 'Probiotic-rich from curd'],
      description: 'Comforting and nutritious khichdi that soothes menstrual discomfort.',
      image: '🥘',
    },
    {
      id: 3,
      name: 'Methi Thepla with Curd',
      phase: 'Follicular',
      category: 'Breakfast',
      dietType: 'Vegetarian',
      calories: 320,
      prepTime: '20 mins',
      ingredients: ['Whole wheat flour', 'Methi (Fenugreek) leaves', 'Dahi', 'Spices', 'Oil'],
      benefits: ['Regulates blood sugar levels', 'High fiber for gut health', 'Supports hormone balance', 'Fenugreek aids insulin sensitivity'],
      description: 'Healthy flatbread loaded with fenugreek for hormonal support.',
      image: '🫓',
    },
    {
      id: 4,
      name: 'Chana Masala with Brown Rice',
      phase: 'Follicular',
      category: 'Dinner',
      dietType: 'Vegetarian',
      calories: 400,
      prepTime: '30 mins',
      ingredients: ['Kabuli chana (Chickpeas)', 'Tomato', 'Onion', 'Brown rice', 'Spices', 'Coriander'],
      benefits: ['High protein for tissue repair', 'Rich in folate for egg development', 'Supports follicular growth', 'Low glycemic index'],
      description: 'Protein-packed meal that supports the follicular phase.',
      image: '🍛',
    },
    {
      id: 5,
      name: 'Ragi (Finger Millet) Dosa',
      phase: 'Ovulation',
      category: 'Breakfast',
      dietType: 'Vegetarian',
      calories: 300,
      prepTime: '15 mins',
      ingredients: ['Ragi flour', 'Rice flour', 'Curd', 'Coconut chutney', 'Sambar'],
      benefits: ['High calcium for bone health', 'Sustained energy release', 'Regulates metabolism', 'Rich in amino acids'],
      description: 'Nutritious South Indian breakfast for peak energy days.',
      image: '🥞',
    },
    {
      id: 6,
      name: 'Rajma (Kidney Beans) Chawal',
      phase: 'Ovulation',
      category: 'Lunch',
      dietType: 'Vegetarian',
      calories: 420,
      prepTime: '35 mins',
      ingredients: ['Rajma (Kidney beans)', 'Basmati rice', 'Tomato', 'Onion', 'Ginger-garlic', 'Spices'],
      benefits: ['High protein for energy', 'Rich in fiber for digestion', 'Supports fertility naturally', 'Contains zinc and folate'],
      description: 'Classic North Indian meal perfect for high energy needs.',
      image: '🍲',
    },
    {
      id: 7,
      name: 'Haldi Doodh (Turmeric Milk)',
      phase: 'Luteal',
      category: 'Beverages',
      dietType: 'Vegetarian',
      calories: 150,
      prepTime: '5 mins',
      ingredients: ['Milk', 'Haldi (Turmeric)', 'Ginger', 'Black pepper', 'Honey', 'Elaichi (Cardamom)'],
      benefits: ['Anti-inflammatory properties', 'Improves sleep quality', 'Reduces PMS symptoms', 'Boosts immunity'],
      description: 'Traditional Indian drink that calms the mind and body.',
      image: '🥛',
    },
    {
      id: 8,
      name: 'Til (Sesame) Ladoo',
      phase: 'Luteal',
      category: 'Snacks',
      dietType: 'Vegetarian',
      calories: 200,
      prepTime: '15 mins',
      ingredients: ['Til (Sesame seeds)', 'Gur (Jaggery)', 'Ghee', 'Elaichi'],
      benefits: ['High in calcium and iron', 'Boosts energy levels', 'Reduces menstrual pain', 'Warming effect on body'],
      description: 'Traditional sweet that helps manage PMS and provides warmth.',
      image: '🍬',
    },
    {
      id: 9,
      name: 'Besan Chilla with Vegetables',
      phase: 'Menstrual',
      category: 'Snacks',
      dietType: 'Vegetarian',
      calories: 250,
      prepTime: '15 mins',
      ingredients: ['Besan (Gram flour)', 'Onion', 'Tomato', 'Green chili', 'Coriander', 'Spices'],
      benefits: ['High protein for muscle repair', 'Low glycemic index', 'Rich in iron and folate', 'Easy to prepare and digest'],
      description: 'Savory pancake loaded with vegetables and protein.',
      image: '🥘',
    },
    {
      id: 10,
      name: 'Masala Oats Upma',
      phase: 'Follicular',
      category: 'Breakfast',
      dietType: 'Vegetarian',
      calories: 280,
      prepTime: '12 mins',
      ingredients: ['Oats', 'Mixed vegetables', 'Curry leaves', 'Mustard seeds', 'Peanuts', 'Lemon'],
      benefits: ['High fiber for gut health', 'Low GI for stable blood sugar', 'Helps weight management', 'Rich in antioxidants'],
      description: 'Healthy Indian-style oats perfect for hormonal balance.',
      image: '🥣',
    },
    {
      id: 11,
      name: 'Lauki (Bottle Gourd) Sabzi with Roti',
      phase: 'Luteal',
      category: 'Dinner',
      dietType: 'Vegetarian',
      calories: 320,
      prepTime: '25 mins',
      ingredients: ['Lauki (Bottle gourd)', 'Whole wheat roti', 'Tomato', 'Onion', 'Jeera', 'Haldi'],
      benefits: ['Low calorie for weight control', 'Cooling effect on body', 'Aids digestion', 'Reduces water retention'],
      description: 'Light and soothing dinner for the luteal phase.',
      image: '🫕',
    },
    {
      id: 12,
      name: 'Dahi (Curd) with Roasted Jeera',
      phase: 'Ovulation',
      category: 'Snacks',
      dietType: 'Vegetarian',
      calories: 120,
      prepTime: '5 mins',
      ingredients: ['Fresh dahi (Curd)', 'Roasted jeera powder', 'Salt', 'Coriander'],
      benefits: ['Probiotic-rich for gut health', 'Cooling and soothing', 'Improves digestion', 'Supports fertility'],
      description: 'Simple probiotic snack for better digestion and fertility.',
      image: '🥛',
    },
    {
      id: 13,
      name: 'Bajra Roti with Ghee',
      phase: 'Menstrual',
      category: 'Dinner',
      dietType: 'Vegetarian',
      calories: 380,
      prepTime: '20 mins',
      ingredients: ['Bajra (Pearl millet) flour', 'Ghee', 'Gur (Jaggery)', 'Lasun (Garlic)'],
      benefits: ['Warming food for cold weather', 'High in iron and magnesium', 'Provides strength', 'Good for anemia'],
      description: 'Traditional winter food that provides warmth and energy during periods.',
      image: '🫓',
    },
    {
      id: 14,
      name: 'Coconut Chutney with Idli',
      phase: 'Follicular',
      category: 'Snacks',
      dietType: 'Vegetarian',
      calories: 220,
      prepTime: '20 mins',
      ingredients: ['Idli rice', 'Urad dal', 'Coconut', 'Green chili', 'Curry leaves', 'Mustard seeds'],
      benefits: ['Fermented food for gut health', 'Easy to digest', 'Probiotic-rich', 'Low in calories'],
      description: 'South Indian fermented food great for gut health.',
      image: '⚪',
    },

    // NON-VEGETARIAN FOODS
    {
      id: 17,
      name: 'Anda Bhurji (Scrambled Eggs)',
      phase: 'Menstrual',
      category: 'Breakfast',
      dietType: 'Non-Vegetarian',
      calories: 320,
      prepTime: '10 mins',
      ingredients: ['Eggs', 'Onion', 'Tomato', 'Green chili', 'Coriander', 'Spices'],
      benefits: ['High quality protein for tissue repair', 'Rich in iron and B12', 'Replenishes blood loss', 'Easy to digest'],
      description: 'Protein-packed Indian-style scrambled eggs for menstrual phase.',
      image: '🍳',
    },
    {
      id: 18,
      name: 'Chicken Soup with Vegetables',
      phase: 'Menstrual',
      category: 'Dinner',
      dietType: 'Non-Vegetarian',
      calories: 280,
      prepTime: '30 mins',
      ingredients: ['Chicken pieces', 'Carrots', 'Beans', 'Ginger-garlic', 'Black pepper', 'Coriander'],
      benefits: ['Easy to digest during cramps', 'High protein for recovery', 'Warming and comforting', 'Reduces inflammation'],
      description: 'Nourishing chicken soup that provides comfort during menstruation.',
      image: '🍜',
    },
    {
      id: 19,
      name: 'Boiled Egg Salad',
      phase: 'Follicular',
      category: 'Breakfast',
      dietType: 'Non-Vegetarian',
      calories: 250,
      prepTime: '15 mins',
      ingredients: ['Boiled eggs', 'Cucumber', 'Tomato', 'Lettuce', 'Lemon', 'Black pepper'],
      benefits: ['Complete protein source', 'Rich in choline for hormone production', 'Supports egg development', 'Low calorie high nutrition'],
      description: 'Fresh and protein-rich salad perfect for follicular phase.',
      image: '🥗',
    },
    {
      id: 20,
      name: 'Tandoori Chicken with Mint Chutney',
      phase: 'Follicular',
      category: 'Lunch',
      dietType: 'Non-Vegetarian',
      calories: 380,
      prepTime: '40 mins',
      ingredients: ['Chicken', 'Dahi', 'Tandoori masala', 'Mint', 'Coriander', 'Lemon'],
      benefits: ['Lean protein for muscle building', 'Low fat high protein', 'Supports hormone synthesis', 'Rich in B-complex vitamins'],
      description: 'Flavorful grilled chicken that supports follicular growth.',
      image: '🍗',
    },
    {
      id: 21,
      name: 'Fish Curry (Machli) with Rice',
      phase: 'Ovulation',
      category: 'Lunch',
      dietType: 'Non-Vegetarian',
      calories: 450,
      prepTime: '35 mins',
      ingredients: ['Fish (Rohu/Katla)', 'Coconut', 'Tomato', 'Curry leaves', 'Spices', 'Rice'],
      benefits: ['Rich in Omega-3 fatty acids', 'Supports fertility and ovulation', 'Reduces inflammation', 'Good for brain health'],
      description: 'Omega-3 rich fish curry perfect for peak fertility days.',
      image: '🐟',
    },
    {
      id: 22,
      name: 'Grilled Chicken Breast with Vegetables',
      phase: 'Ovulation',
      category: 'Dinner',
      dietType: 'Non-Vegetarian',
      calories: 420,
      prepTime: '30 mins',
      ingredients: ['Chicken breast', 'Bell peppers', 'Broccoli', 'Lemon', 'Herbs', 'Olive oil'],
      benefits: ['High protein for peak energy', 'Low fat for weight management', 'Rich in zinc for fertility', 'Supports reproductive health'],
      description: 'Lean protein meal that boosts energy during ovulation.',
      image: '🍗',
    },
    {
      id: 23,
      name: 'Egg Curry with Whole Wheat Roti',
      phase: 'Luteal',
      category: 'Dinner',
      dietType: 'Non-Vegetarian',
      calories: 400,
      prepTime: '25 mins',
      ingredients: ['Boiled eggs', 'Onion-tomato gravy', 'Spices', 'Coriander', 'Whole wheat roti'],
      benefits: ['High protein for PMS management', 'Rich in vitamin D', 'Reduces mood swings', 'Satisfying and filling'],
      description: 'Protein-rich curry that helps manage PMS symptoms.',
      image: '🥘',
    },
    {
      id: 24,
      name: 'Fish Tikka (Grilled)',
      phase: 'Luteal',
      category: 'Snacks',
      dietType: 'Non-Vegetarian',
      calories: 280,
      prepTime: '30 mins',
      ingredients: ['Fish pieces', 'Dahi', 'Tikka masala', 'Lemon', 'Ginger-garlic', 'Chaat masala'],
      benefits: ['Omega-3 reduces PMS symptoms', 'Anti-inflammatory properties', 'Low calorie high protein', 'Mood boosting'],
      description: 'Healthy grilled fish snack that helps reduce PMS discomfort.',
      image: '🐠',
    },
    {
      id: 25,
      name: 'Chicken Biryani (Light version)',
      phase: 'Ovulation',
      category: 'Lunch',
      dietType: 'Non-Vegetarian',
      calories: 480,
      prepTime: '45 mins',
      ingredients: ['Chicken', 'Basmati rice', 'Yogurt', 'Saffron', 'Whole spices', 'Fried onions'],
      benefits: ['Complete meal with protein and carbs', 'Rich in B vitamins', 'Provides sustained energy', 'Supports high energy needs'],
      description: 'Aromatic biryani perfect for high energy ovulation phase.',
      image: '🍛',
    },
    {
      id: 26,
      name: 'Masala Chai (Spiced Tea)',
      phase: 'Ovulation',
      category: 'Beverages',
      dietType: 'Vegetarian',
      calories: 80,
      prepTime: '8 mins',
      ingredients: ['Tea leaves', 'Milk', 'Ginger', 'Elaichi', 'Cloves', 'Black pepper'],
      benefits: ['Boosts metabolism', 'Warming effect', 'Improves digestion', 'Antioxidant-rich'],
      description: 'Traditional Indian tea that energizes and warms the body.',
      image: '☕',
    },
    {
      id: 27,
      name: 'Akhrot Badam (Walnut-Almond) Mix',
      phase: 'Luteal',
      category: 'Snacks',
      dietType: 'Vegetarian',
      calories: 220,
      prepTime: '2 mins',
      ingredients: ['Akhrot (Walnuts)', 'Badam (Almonds)', 'Kismis (Raisins)', 'Kaju (Cashews)'],
      benefits: ['Omega-3 rich for brain health', 'Reduces inflammation', 'Mood boosting properties', 'Rich in magnesium for PMS'],
      description: 'Dry fruit mix perfect for managing PMS and mood swings.',
      image: '🌰',
    },
    {
      id: 28,
      name: 'Mutton Keema (Minced Goat Meat)',
      phase: 'Menstrual',
      category: 'Lunch',
      dietType: 'Non-Vegetarian',
      calories: 420,
      prepTime: '40 mins',
      ingredients: ['Mutton keema', 'Peas', 'Onion', 'Tomato', 'Ginger-garlic', 'Spices'],
      benefits: ['Very high in iron and zinc', 'Replenishes blood loss quickly', 'Rich in B12 vitamin', 'Provides strength during periods'],
      description: 'Iron-rich minced meat perfect for menstrual phase nutrition.',
      image: '🍖',
    },
  ];

  useEffect(() => {
    filterFoodItems();
  }, [selectedPhase, selectedCategory, selectedDietType]);

  const filterFoodItems = () => {
    let filtered = foodData;

    if (selectedPhase !== 'All') {
      filtered = filtered.filter(item => item.phase === selectedPhase);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedDietType !== 'All') {
      filtered = filtered.filter(item => item.dietType === selectedDietType);
    }

    setFoodItems(filtered);
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Breakfast': return 'sunny';
      case 'Lunch': return 'restaurant';
      case 'Dinner': return 'moon';
      case 'Snacks': return 'cafe';
      case 'Beverages': return 'water';
      default: return 'restaurant';
    }
  };

  const addToMealPlan = (item) => {
    // TODO: Implement meal planning functionality
    alert(`Added ${item.name} to your meal plan!`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍎 Food & Diet</Text>
        <Text style={styles.subtitle}>Phase-based nutrition for PCOD management</Text>
      </View>

      {/* Phase Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {phases.map((phase) => (
          <TouchableOpacity
            key={phase}
            style={[
              styles.filterButton,
              selectedPhase === phase && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedPhase(phase)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedPhase === phase && styles.selectedFilterButtonText,
            ]}>
              {phase}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Ionicons 
              name={getCategoryIcon(category)} 
              size={16} 
              color={selectedCategory === category ? 'white' : '#666'} 
              style={styles.filterIcon}
            />
            <Text style={[
              styles.filterButtonText,
              selectedCategory === category && styles.selectedFilterButtonText,
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Diet Type Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {dietTypes.map((dietType) => (
          <TouchableOpacity
            key={dietType}
            style={[
              styles.filterButton,
              selectedDietType === dietType && styles.selectedFilterButton,
              selectedDietType === dietType && dietType === 'Vegetarian' && { backgroundColor: '#4CAF50' },
              selectedDietType === dietType && dietType === 'Non-Vegetarian' && { backgroundColor: '#FF5722' },
            ]}
            onPress={() => setSelectedDietType(dietType)}
          >
            <Ionicons 
              name={dietType === 'Vegetarian' ? 'leaf' : dietType === 'Non-Vegetarian' ? 'restaurant' : 'fast-food'} 
              size={16} 
              color={selectedDietType === dietType ? 'white' : '#666'} 
              style={styles.filterIcon}
            />
            <Text style={[
              styles.filterButtonText,
              selectedDietType === dietType && styles.selectedFilterButtonText,
            ]}>
              {dietType}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Food Items List */}
      <View style={styles.foodContainer}>
        {foodItems.map((item) => (
          <View key={item.id} style={styles.foodCard}>
            <View style={styles.foodHeader}>
              <View style={styles.foodImageContainer}>
                <Text style={styles.foodEmoji}>{item.image}</Text>
              </View>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <View style={styles.foodMeta}>
                  <View style={[styles.phaseTag, { backgroundColor: getPhaseColor(item.phase) }]}>
                    <Text style={styles.phaseTagText}>{item.phase}</Text>
                  </View>
                  <View style={styles.categoryTag}>
                    <Ionicons name={getCategoryIcon(item.category)} size={12} color="#666" />
                    <Text style={styles.categoryTagText}>{item.category}</Text>
                  </View>
                  <View style={[
                    styles.dietTypeTag, 
                    { backgroundColor: item.dietType === 'Vegetarian' ? '#E8F5E9' : '#FFEBEE' }
                  ]}>
                    <Ionicons 
                      name={item.dietType === 'Vegetarian' ? 'leaf' : 'restaurant'} 
                      size={12} 
                      color={item.dietType === 'Vegetarian' ? '#4CAF50' : '#FF5722'} 
                    />
                    <Text style={[
                      styles.dietTypeTagText,
                      { color: item.dietType === 'Vegetarian' ? '#4CAF50' : '#FF5722' }
                    ]}>
                      {item.dietType === 'Vegetarian' ? 'Veg' : 'Non-Veg'}
                    </Text>
                  </View>
                </View>
                <View style={styles.foodStats}>
                  <Text style={styles.calories}>{item.calories} cal</Text>
                  <Text style={styles.prepTime}>{item.prepTime}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.foodDescription}>{item.description}</Text>

            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredientsTitle}>Ingredients:</Text>
              <View style={styles.ingredientsList}>
                {item.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits:</Text>
              <View style={styles.benefitsList}>
                {item.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="star" size={14} color="#FF9800" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => addToMealPlan(item)}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.addButtonText}>Add to Meal Plan</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Nutrition Tips */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons name="nutrition" size={24} color="#4CAF50" />
          <Text style={styles.tipsTitle}>Indian PCOS Diet Tips</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="leaf" size={16} color="#666" />
          <Text style={styles.tipText}>Include methi (fenugreek) in your diet - helps regulate blood sugar</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="water" size={16} color="#666" />
          <Text style={styles.tipText}>Drink jeera water or methi water on empty stomach</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.tipText}>Replace white rice with brown rice, ragi, or bajra</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="heart" size={16} color="#666" />
          <Text style={styles.tipText}>Add haldi (turmeric) and ginger to daily meals for anti-inflammatory benefits</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="restaurant" size={16} color="#666" />
          <Text style={styles.tipText}>Choose ghee over refined oils - provides healthy fats</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="nutrition" size={16} color="#666" />
          <Text style={styles.tipText}>Eat local seasonal vegetables from Delhi sabzi mandi</Text>
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
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedFilterButton: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedFilterButtonText: {
    color: 'white',
  },
  foodContainer: {
    paddingHorizontal: 20,
  },
  foodCard: {
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
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  foodEmoji: {
    fontSize: 32,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  foodMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  phaseTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginRight: 8,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dietTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  dietTypeTagText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  foodStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calories: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
    marginRight: 16,
  },
  prepTime: {
    fontSize: 14,
    color: '#666',
  },
  foodDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  ingredientText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
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
  benefitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
});

