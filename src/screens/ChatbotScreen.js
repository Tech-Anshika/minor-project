import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import BilingualHealthAssistant from '../services/BilingualHealthAssistant';
import * as Speech from 'expo-speech';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en'); // 'en' or 'hi'
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);
  const messageCount = useRef(0);

  useEffect(() => {
    loadChatHistory();
    // Initialize language in assistant
    BilingualHealthAssistant.setLanguage(currentLanguage);
    // Show welcome message and suggestions on first load
    if (messages.length === 0) {
      showWelcomeMessage();
    }
  }, []);

  useEffect(() => {
    // Pulse animation for recording
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const loadChatHistory = () => {
    if (auth.currentUser) {
      const q = query(
        collection(db, 'chats', auth.currentUser.uid, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to JavaScript Date
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
          };
        });
        setMessages(chatMessages);
      });

      return unsubscribe;
    }
  };

  const showWelcomeMessage = () => {
    const welcomeMessage = {
      text: BilingualHealthAssistant.getGreeting(),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setQuickSuggestions(BilingualHealthAssistant.getQuickSuggestions());
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'hi' : 'en';
    setCurrentLanguage(newLang);
    BilingualHealthAssistant.setLanguage(newLang);
    setQuickSuggestions(BilingualHealthAssistant.getQuickSuggestions());
    
    // Show language change message
    const langChangeMessage = {
      text: newLang === 'hi' 
        ? '✅ भाषा हिंदी में बदल गई। अब आप हिंदी में सवाल पूछ सकती हैं!'
        : '✅ Language changed to English. You can now ask questions in English!',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, langChangeMessage]);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    
    Alert.prompt(
      currentLanguage === 'hi' ? '🎤 वॉइस इनपुट' : '🎤 Voice Input',
      currentLanguage === 'hi' 
        ? 'अपना सवाल बोलें या टाइप करें:\n(स्पीच-टू-टेक्स्ट API की जरूरत होती है जो paid है, इसलिए अभी टाइप करें)'
        : 'Speak or type your question:\n(Speech-to-text requires paid API, so please type for now)',
      [
        {
          text: currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel',
          style: 'cancel',
          onPress: () => setIsRecording(false)
        },
        {
          text: currentLanguage === 'hi' ? 'भेजें' : 'Send',
          onPress: (text) => {
            setIsRecording(false);
            if (text && text.trim()) {
              sendMessage(text.trim());
            }
          }
        }
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const speakResponse = (text) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const language = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    
    Speech.speak(text, {
      language: language,
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert(
          currentLanguage === 'hi' ? 'त्रुटि' : 'Error',
          currentLanguage === 'hi' 
            ? 'टेक्स्ट-टू-स्पीच काम नहीं कर रहा। कृपया दोबारा कोशिश करें।'
            : 'Text-to-speech failed. Please try again.'
        );
      }
    });
  };

  const getAIResponse = async (userMessage) => {
    // Use our bilingual offline AI assistant - completely free!
    const response = BilingualHealthAssistant.getResponse(userMessage);
    
    // Simulate natural typing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Every 5 messages, add an encouraging note
    messageCount.current += 1;
    if (messageCount.current % 5 === 0) {
      return `${response}\n\n${BilingualHealthAssistant.getEncouragingMessage()}`;
    }
    
    return response;
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    // Hide suggestions after first user message
    setShowSuggestions(false);

    const userMessage = {
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Save user message to Firestore
      if (auth.currentUser) {
        await addDoc(collection(db, 'chats', auth.currentUser.uid, 'messages'), userMessage);
      }

      // Get AI response from offline assistant
      const aiResponse = await getAIResponse(textToSend);
      
      const botMessage = {
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Save bot message to Firestore
      if (auth.currentUser) {
        await addDoc(collection(db, 'chats', auth.currentUser.uid, 'messages'), botMessage);
      }

      // Refresh quick suggestions
      setQuickSuggestions(BilingualHealthAssistant.getQuickSuggestions());
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    sendMessage(suggestion);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.botText
        ]}>
          {item.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : styles.botTimestamp
          ]}>
            {item.timestamp && item.timestamp.toLocaleTimeString 
              ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Now'}
          </Text>
          {!item.isUser && (
            <TouchableOpacity 
              onPress={() => speakResponse(item.text)}
              style={styles.speakerButton}
            >
              <Ionicons 
                name={isSpeaking ? "volume-high" : "volume-medium-outline"} 
                size={16} 
                color="#666" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerContent}>
            <Ionicons name="chatbubble" size={24} color="#E91E63" />
            <View>
              <Text style={styles.headerTitle}>AI Health Assistant</Text>
              <Text style={styles.headerSubtitle}>
                {currentLanguage === 'en' ? '🇮🇳 Free offline AI • PCOS Expert' : '🇮🇳 मुफ्त ऑफलाइन AI • PCOS विशेषज्ञ'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Ionicons name="language" size={20} color="#E91E63" />
            <Text style={styles.languageButtonText}>{currentLanguage === 'en' ? 'हिं' : 'EN'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id || item.timestamp.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Quick Suggestions */}
      {quickSuggestions.length > 0 && !loading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>💡 Quick Questions:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {quickSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => handleQuickSuggestion(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Animated.View style={{ transform: [{ scale: isRecording ? pulseAnim : 1 }] }}>
          <TouchableOpacity 
            style={[styles.voiceButton, isRecording && styles.voiceButtonActive]} 
            onPress={startVoiceRecording}
          >
            <Ionicons 
              name={isRecording ? "mic" : "mic-outline"} 
              size={24} 
              color={isRecording ? "#E91E63" : "#666"} 
            />
          </TouchableOpacity>
        </Animated.View>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={currentLanguage === 'en' ? "Type your message..." : "अपना संदेश लिखें..."}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!inputText.trim() || loading) && styles.disabledButton]} 
          onPress={sendMessage}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons 
            name={loading ? "hourglass-outline" : "send"} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    marginTop: 2,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFB6D9',
  },
  languageButtonText: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#E91E63',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botTimestamp: {
    color: '#999',
  },
  speakerButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#FFE0EC',
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#E91E63',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  suggestionsScroll: {
    paddingRight: 16,
  },
  suggestionButton: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FFB6D9',
  },
  suggestionText: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: '500',
  },
});

