import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Plus, Mic, Paperclip } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Charter_400Regular } from '@expo-google-fonts/charter';
import { useBorosStore } from '@/store/borosStore';
import { ChatMessage } from '@/components/ChatMessage';
import { TypingIndicator } from '@/components/TypingIndicator';
import { TimeGreeting } from '@/components/TimeGreeting';
import { MessageLimitModal } from '@/components/MessageLimitModal';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Charter-Regular': Charter_400Regular,
  });

  const {
    messages,
    isTyping,
    messageCount,
    isProUser,
    userName,
    sendMessage,
    checkMessageLimit,
  } = useBorosStore();

  const [inputText, setInputText] = useState('');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const canSend = checkMessageLimit();
    if (!canSend) {
      setShowLimitModal(true);
      return;
    }

    const message = inputText.trim();
    setInputText('');
    
    // Animate input
    Animated.sequence([
      Animated.timing(inputAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    await sendMessage(message);
  };

  const inputScale = inputAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F4F3EE', '#FAF9F5']}
        style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Boros</Text>
          <View style={styles.headerSubtitle}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>AI Assistant</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
          
          {messages.length === 0 && (
            <TimeGreeting userName={userName} />
          )}

          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}

          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}>
          
          <Animated.View
            style={[
              styles.inputWrapper,
              { transform: [{ scale: inputScale }] }
            ]}>
            
            <TouchableOpacity style={styles.attachButton}>
              <Paperclip size={20} color="#B1ADA1" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Message Boros...`}
              placeholderTextColor="#B1ADA1"
              multiline
              maxLength={4000}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : null
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}>
              <Send
                size={18}
                color={inputText.trim() ? '#FFFFFF' : '#B1ADA1'}
              />
            </TouchableOpacity>
          </Animated.View>

          {!isProUser && (
            <Text style={styles.limitText}>
              {messageCount}/5 messages • {5 - messageCount} remaining
            </Text>
          )}
        </KeyboardAvoidingView>

        <MessageLimitModal
          visible={showLimitModal}
          onClose={() => setShowLimitModal(false)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3EE',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E3DD',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#2D2A26',
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E3DD',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  attachButton: {
    marginRight: 12,
    padding: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2D2A26',
    maxHeight: 120,
    lineHeight: 22,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  sendButtonActive: {
    backgroundColor: '#C15F3C',
  },
  limitText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
    textAlign: 'center',
    marginTop: 8,
  },
});