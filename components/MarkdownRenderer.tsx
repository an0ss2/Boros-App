import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    const elements: JSX.Element[] = [];
    const lines = text.split('\n');
    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        const language = line.slice(3).trim();
        const codeLines: string[] = [];
        i++; // Skip the opening ```

        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }

        elements.push(
          <CodeBlock
            key={currentIndex++}
            code={codeLines.join('\n')}
            language={language}
          />
        );
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <Text key={currentIndex++} style={styles.h1}>
            {line.slice(2)}
          </Text>
        );
        continue;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <Text key={currentIndex++} style={styles.h2}>
            {line.slice(3)}
          </Text>
        );
        continue;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <Text key={currentIndex++} style={styles.h3}>
            {line.slice(4)}
          </Text>
        );
        continue;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <Text key={currentIndex++} style={styles.listItem}>
            • {line.slice(2)}
          </Text>
        );
        continue;
      }

      // Regular paragraphs
      if (line.trim()) {
        elements.push(
          <Text key={currentIndex++} style={styles.paragraph}>
            {parseInlineMarkdown(line)}
          </Text>
        );
      } else {
        elements.push(
          <View key={currentIndex++} style={styles.spacing} />
        );
      }
    }

    return elements;
  };

  const parseInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let currentText = text;
    let keyIndex = 0;

    // Bold text
    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${keyIndex}__`;
      parts.push(
        <Text key={`bold-${keyIndex++}`} style={styles.bold}>
          {content}
        </Text>
      );
      return placeholder;
    });

    // Italic text
    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${keyIndex}__`;
      parts.push(
        <Text key={`italic-${keyIndex++}`} style={styles.italic}>
          {content}
        </Text>
      );
      return placeholder;
    });

    // Inline code
    currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
      const placeholder = `__CODE_${keyIndex}__`;
      parts.push(
        <Text key={`code-${keyIndex++}`} style={styles.inlineCode}>
          {content}
        </Text>
      );
      return placeholder;
    });

    // Split by placeholders and reconstruct
    const finalParts: (string | JSX.Element)[] = [];
    const textParts = currentText.split(/(__\w+_\d+__)/);

    textParts.forEach((part, index) => {
      if (part.startsWith('__') && part.endsWith('__')) {
        const matchingPart = parts.find((p) =>
          React.isValidElement(p) && p.key?.toString().includes(part.slice(2, -2))
        );
        if (matchingPart) {
          finalParts.push(matchingPart);
        }
      } else if (part) {
        finalParts.push(part);
      }
    });

    return finalParts;
  };

  return (
    <View style={styles.container}>
      {parseMarkdown(content)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  h1: {
    fontSize: 24,
    fontFamily: 'Charter-Regular',
    color: '#2D2A26',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  h2: {
    fontSize: 20,
    fontFamily: 'Charter-Regular',
    color: '#2D2A26',
    fontWeight: 'bold',
    marginVertical: 6,
  },
  h3: {
    fontSize: 18,
    fontFamily: 'Charter-Regular',
    color: '#2D2A26',
    fontWeight: 'bold',
    marginVertical: 4,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Charter-Regular',
    color: '#2D2A26',
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    fontFamily: 'Charter-Regular',
    color: '#2D2A26',
    lineHeight: 24,
    marginLeft: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: 'Inter-Regular',
    backgroundColor: '#F0EFE9',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    color: '#C15F3C',
  },
  spacing: {
    height: 8,
  },
});