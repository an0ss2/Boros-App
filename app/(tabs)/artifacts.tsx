import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, ListFilter as Filter, Code, FileText, Globe } from 'lucide-react-native';
import { useBorosStore } from '@/store/borosStore';
import { ArtifactPreview } from '@/components/ArtifactPreview';

export default function ArtifactsScreen() {
  const { artifacts } = useBorosStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesSearch = artifact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artifact.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || artifact.type === selectedType;
    return matchesSearch && matchesType;
  });

  const typeFilters = [
    { type: 'code', icon: Code, label: 'Code' },
    { type: 'html', icon: Globe, label: 'HTML' },
    { type: 'markdown', icon: FileText, label: 'Markdown' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F4F3EE', '#FAF9F5']}
        style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Artifacts</Text>
          <Text style={styles.headerSubtitle}>
            {artifacts.length} saved artifacts
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Search size={20} color="#B1ADA1" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search artifacts..."
              placeholderTextColor="#B1ADA1"
            />
          </View>
        </View>

        {/* Type Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !selectedType && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType(null)}>
            <Text style={[
              styles.filterText,
              !selectedType && styles.filterTextActive,
            ]}>
              All
            </Text>
          </TouchableOpacity>

          {typeFilters.map(({ type, icon: Icon, label }) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                selectedType === type && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType(selectedType === type ? null : type)}>
              <Icon
                size={16}
                color={selectedType === type ? '#FFFFFF' : '#B1ADA1'}
              />
              <Text style={[
                styles.filterText,
                selectedType === type && styles.filterTextActive,
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Artifacts List */}
        <FlatList
          data={filteredArtifacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArtifactPreview
              artifact={item}
              onPress={() => {
                // TODO: Open artifact viewer
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Code size={48} color="#B1ADA1" />
              <Text style={styles.emptyTitle}>No artifacts found</Text>
              <Text style={styles.emptyDescription}>
                {searchQuery || selectedType
                  ? 'Try adjusting your search or filters'
                  : 'Start a conversation to create your first artifact'}
              </Text>
            </View>
          }
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E3DD',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2D2A26',
    marginLeft: 12,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DD',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#C15F3C',
    borderColor: '#C15F3C',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#B1ADA1',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2D2A26',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
    textAlign: 'center',
    lineHeight: 20,
  },
});