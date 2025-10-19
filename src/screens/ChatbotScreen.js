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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import OfflineHealthAssistant from '../services/OfflineHealthAssistant';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const flatListRef = useRef(null);
  const messageCount = useRef(0);

  useEffect(() => {
    loadChatHistory();
    // Show welcome message and suggestions on first load
    if (messages.length === 0) {
      showWelcomeMessage();
    }
  }, []);

  const loadChatHistory = () => {
    if (auth.currentUser) {
      const q = query(
        collection(db, 'chats', auth.currentUser.uid, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(chatMessages);
      });

      return unsubscribe;
    }
  };

  const showWelcomeMessage = () => {
    const welcomeMessage = {
      text: OfflineHealthAssistant.getGreeting(),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setQuickSuggestions(OfflineHealthAssistant.getQuickSuggestions());
  };

  const getAIResponse = async (userMessage) => {
    // Use our offline AI assistant - completely free!
    const response = OfflineHealthAssistant.getResponse(userMessage);
    
    // Simulate natural typing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Every 5 messages, add an encouraging note
    messageCount.current += 1;
    if (messageCount.current % 5 === 0) {
      return `${response}\n\n${OfflineHealthAssistant.getEncouragingMessage()}`;
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
      setQuickSuggestions(OfflineHealthAssistant.getQuickSuggestions());
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
        <Text style={[
          styles.timestamp,
          item.isUser ? styles.userTimestamp : styles.botTimestamp
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="chatbubble" size={24} color="#E91E63" />
          <Text style={styles.headerTitle}>AI Health Assistant</Text>
        </View>
        <Text style={styles.headerSubtitle}>Free offline AI • PCOS/PCOD Expert</Text>
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
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 32,
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
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botTimestamp: {
    color: '#999',
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

