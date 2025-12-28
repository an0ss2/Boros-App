import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ExternalLink, Code, FileText, Globe } from 'lucide-react-native';
import { Artifact } from '@/store/borosStore';

interface ArtifactPreviewProps {
  artifact: Artifact;
  onPress?: () => void;
}

export function ArtifactPreview({ artifact, onPress }: ArtifactPreviewProps) {
  const getIcon = () => {
    switch (artifact.type) {
      case 'code':
        return <Code size={16} color="#C15F3C" />;
      case 'html':
        return <Globe size={16} color="#C15F3C" />;
      case 'markdown':
        return <FileText size={16} color="#C15F3C" />;
      default:
        return <FileText size={16} color="#C15F3C" />;
    }
  };

  const getPreviewText = () => {
    const maxLength = 100;
    if (artifact.content.length <= maxLength) {
      return artifact.content;
    }
    return artifact.content.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {getIcon()}
          <Text style={styles.title} numberOfLines={1}>
            {artifact.title}
          </Text>
        </View>
        
        <ExternalLink size={14} color="#B1ADA1" />
      </View>

      <Text style={styles.preview} numberOfLines={3}>
        {getPreviewText()}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.type}>
          {artifact.type.toUpperCase()}
          {artifact.language && ` • ${artifact.language.toUpperCase()}`}
        </Text>
        
        <Text style={styles.timestamp}>
          {artifact.createdAt.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2D2A26',
    marginLeft: 8,
    flex: 1,
  },
  preview: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    lineHeight: 16,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#C15F3C',
    textTransform: 'uppercase',
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
  },
});