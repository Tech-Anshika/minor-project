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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
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

  const getAIResponse = async (userMessage) => {
    // TODO: Replace with actual Gemini API integration
    // For now, return mock responses
    const mockResponses = [
      "I understand you're dealing with PCOD symptoms. Have you tried incorporating more fiber-rich foods into your diet?",
      "Regular exercise, especially yoga and cardio, can help manage PCOD symptoms. Would you like some specific exercise recommendations?",
      "Stress management is crucial for hormonal balance. Try meditation or deep breathing exercises for 10-15 minutes daily.",
      "It's important to maintain a consistent sleep schedule. Aim for 7-9 hours of quality sleep each night.",
      "Consider tracking your symptoms and cycle patterns to identify triggers. This can help you and your healthcare provider make better decisions.",
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return randomResponse;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      text: inputText.trim(),
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

      // Get AI response
      const aiResponse = await getAIResponse(inputText.trim());
      
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
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerSubtitle}>Ask me anything about PCOD/PCOS</Text>
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

      {messages.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>Start a conversation</Text>
          <Text style={styles.emptySubtitle}>
            Ask me about PCOD symptoms, diet tips, exercise routines, or any health concerns you have.
          </Text>
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
});

