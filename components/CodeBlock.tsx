import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      javascript: '#F7DF1E',
      typescript: '#3178C6',
      python: '#3776AB',
      java: '#ED8B00',
      cpp: '#00599C',
      html: '#E34F26',
      css: '#1572B6',
      json: '#000000',
      xml: '#FF6600',
      sql: '#336791',
      shell: '#89E051',
      bash: '#89E051',
    };
    return colors[lang.toLowerCase()] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.languageContainer}>
          <View
            style={[
              styles.languageDot,
              { backgroundColor: getLanguageColor(language) },
            ]}
          />
          <Text style={styles.languageText}>
            {language || 'code'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopy}>
          {copied ? (
            <Check size={16} color="#10B981" />
          ) : (
            <Copy size={16} color="#B1ADA1" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.codeContainer}>
        <Text style={styles.codeText}>
          {code}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2D2D2D',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  languageText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#D1D5DB',
    textTransform: 'uppercase',
  },
  copyButton: {
    padding: 4,
  },
  codeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  codeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#F8F8F2',
    lineHeight: 20,
  },
});