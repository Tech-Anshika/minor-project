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
  const [foodItems, setFoodItems] = useState([]);

  const phases = ['All', 'Menstrual', 'Follicular', 'Ovulation', 'Luteal'];
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages'];

  const foodData = [
    {
      id: 1,
      name: 'Iron-Rich Smoothie',
      phase: 'Menstrual',
      category: 'Breakfast',
      calories: 250,
      prepTime: '5 mins',
      ingredients: ['Spinach', 'Banana', 'Berries', 'Almond milk', 'Chia seeds'],
      benefits: ['High in iron', 'Reduces inflammation', 'Boosts energy'],
      description: 'A nutrient-dense smoothie perfect for replenishing iron during menstruation.',
      image: '🥤',
    },
    {
      id: 2,
      name: 'Quinoa Buddha Bowl',
      phase: 'Menstrual',
      category: 'Lunch',
      calories: 400,
      prepTime: '15 mins',
      ingredients: ['Quinoa', 'Roasted vegetables', 'Avocado', 'Tahini dressing', 'Pumpkin seeds'],
      benefits: ['Complete protein', 'High fiber', 'Anti-inflammatory'],
      description: 'A balanced meal with complex carbs and healthy fats.',
      image: '🥗',
    },
    {
      id: 3,
      name: 'Green Goddess Salad',
      phase: 'Follicular',
      category: 'Lunch',
      calories: 300,
      prepTime: '10 mins',
      ingredients: ['Mixed greens', 'Cucumber', 'Broccoli', 'Green apple', 'Walnuts'],
      benefits: ['Rich in folate', 'Supports egg development', 'High in antioxidants'],
      description: 'Fresh and energizing salad perfect for the follicular phase.',
      image: '🥬',
    },
    {
      id: 4,
      name: 'Salmon with Sweet Potato',
      phase: 'Follicular',
      category: 'Dinner',
      calories: 450,
      prepTime: '25 mins',
      ingredients: ['Salmon fillet', 'Sweet potato', 'Asparagus', 'Lemon', 'Herbs'],
      benefits: ['Omega-3 fatty acids', 'High protein', 'Supports hormone production'],
      description: 'Nutrient-rich dinner that supports hormonal balance.',
      image: '🐟',
    },
    {
      id: 5,
      name: 'Energy Boosting Oatmeal',
      phase: 'Ovulation',
      category: 'Breakfast',
      calories: 350,
      prepTime: '8 mins',
      ingredients: ['Oats', 'Greek yogurt', 'Honey', 'Nuts', 'Fresh berries'],
      benefits: ['Sustained energy', 'High fiber', 'Supports ovulation'],
      description: 'Energizing breakfast perfect for peak fertility days.',
      image: '🥣',
    },
    {
      id: 6,
      name: 'Mediterranean Wrap',
      phase: 'Ovulation',
      category: 'Lunch',
      calories: 380,
      prepTime: '12 mins',
      ingredients: ['Whole wheat tortilla', 'Hummus', 'Cucumber', 'Tomato', 'Feta cheese'],
      benefits: ['Balanced macros', 'Anti-inflammatory', 'Supports fertility'],
      description: 'Light and nutritious wrap for peak energy days.',
      image: '🌯',
    },
    {
      id: 7,
      name: 'Warm Turmeric Latte',
      phase: 'Luteal',
      category: 'Beverages',
      calories: 120,
      prepTime: '5 mins',
      ingredients: ['Turmeric', 'Coconut milk', 'Ginger', 'Cinnamon', 'Black pepper'],
      benefits: ['Anti-inflammatory', 'Supports progesterone', 'Calming'],
      description: 'Soothing drink perfect for the luteal phase.',
      image: '☕',
    },
    {
      id: 8,
      name: 'Dark Chocolate Bark',
      phase: 'Luteal',
      category: 'Snacks',
      calories: 180,
      prepTime: '10 mins',
      ingredients: ['Dark chocolate', 'Almonds', 'Pumpkin seeds', 'Coconut flakes'],
      benefits: ['Magnesium rich', 'Mood boosting', 'Antioxidants'],
      description: 'Healthy treat that helps with PMS symptoms.',
      image: '🍫',
    },
  ];

  useEffect(() => {
    filterFoodItems();
  }, [selectedPhase, selectedCategory]);

  const filterFoodItems = () => {
    let filtered = foodData;

    if (selectedPhase !== 'All') {
      filtered = filtered.filter(item => item.phase === selectedPhase);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
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
          <Text style={styles.tipsTitle}>Nutrition Tips</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="leaf" size={16} color="#666" />
          <Text style={styles.tipText}>Focus on whole, unprocessed foods</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="water" size={16} color="#666" />
          <Text style={styles.tipText}>Stay hydrated with 8-10 glasses of water daily</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.tipText}>Eat regular meals to maintain stable blood sugar</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="heart" size={16} color="#666" />
          <Text style={styles.tipText}>Include anti-inflammatory foods like turmeric and ginger</Text>
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
  },
  categoryTagText: {
    fontSize: 12,
    color: '#666',
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

