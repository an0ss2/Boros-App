import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

interface TimeGreetingProps {
  userName: string;
}

export function TimeGreeting({ userName }: TimeGreetingProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    const displayName = userName || 'there';

    if (hour >= 5 && hour < 12) {
      return `Good morning, ${displayName}. Ready to start fresh?`;
    } else if (hour >= 12 && hour < 18) {
      return `Good afternoon, ${displayName}. Let's keep things moving.`;
    } else if (hour >= 18 && hour < 22) {
      return `Good evening, ${displayName}. How can I help you tonight?`;
    } else {
      return `It's late, ${displayName}. Let's focus and get this done.`;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}>
      
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <View style={styles.iconInner} />
        </View>
      </View>

      <Text style={styles.greeting}>
        {getTimeBasedGreeting()}
      </Text>

      <Text style={styles.subtitle}>
        I'm Boros, your AI workspace assistant. I can help you with coding, writing, analysis, and creative projects.
      </Text>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Try asking me to:</Text>
        <View style={styles.suggestions}>
          <Text style={styles.suggestion}>• Write and debug code</Text>
          <Text style={styles.suggestion}>• Create documents and presentations</Text>
          <Text style={styles.suggestion}>• Analyze data and solve problems</Text>
          <Text style={styles.suggestion}>• Generate creative content</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C15F3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C15F3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Charter-Regular',
    color: '#2D2A26',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  suggestionsContainer: {
    width: '100%',
    backgroundColor: '#FAF9F5',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0EFE9',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2D2A26',
    marginBottom: 12,
  },
  suggestions: {
    gap: 8,
  },
  suggestion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    lineHeight: 20,
  },
});