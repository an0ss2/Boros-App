import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Crown,
  Key,
  Bell,
  Palette,
  Info,
  Mail,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import { useBorosStore } from '@/store/borosStore';

export default function SettingsScreen() {
  const {
    userName,
    isProUser,
    licenseKey,
    messageCount,
    setUserName,
    setLicenseKey,
    resetMessageCount,
  } = useBorosStore();

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempLicenseKey, setTempLicenseKey] = useState('');
  const [notifications, setNotifications] = useState(true);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setEditingName(false);
    }
  };

  const handleLicenseSubmit = async () => {
    if (!tempLicenseKey.trim()) {
      Alert.alert('Error', 'Please enter a license key');
      return;
    }

    const success = await setLicenseKey(tempLicenseKey.trim());
    if (success) {
      Alert.alert('Success', 'License key validated successfully!');
      setTempLicenseKey('');
    } else {
      Alert.alert('Error', 'Invalid license key. Please try again.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Data',
      'This will clear all your messages, projects, and artifacts. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetMessageCount();
            Alert.alert('Success', 'Data has been reset');
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingRow = ({
    icon,
    title,
    subtitle,
    rightElement,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F4F3EE', '#FAF9F5']}
        style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          {isProUser && (
            <View style={styles.proBadge}>
              <Crown size={16} color="#FFFFFF" />
              <Text style={styles.proText}>PRO</Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}>
          
          {/* Profile Section */}
          <SettingSection title="Profile">
            <SettingRow
              icon={<User size={20} color="#C15F3C" />}
              title="Name"
              subtitle={userName || 'Not set'}
              rightElement={
                editingName ? (
                  <View style={styles.nameEditContainer}>
                    <TextInput
                      style={styles.nameInput}
                      value={tempName}
                      onChangeText={setTempName}
                      placeholder="Enter your name"
                      autoFocus
                      onSubmitEditing={handleSaveName}
                      onBlur={handleSaveName}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditingName(true)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )
              }
            />
          </SettingSection>

          {/* Subscription Section */}
          <SettingSection title="Subscription">
            <SettingRow
              icon={<Crown size={20} color="#C15F3C" />}
              title="Boros Pro"
              subtitle={
                isProUser
                  ? 'Active • Unlimited messages'
                  : `Free • ${messageCount}/5 messages used`
              }
              rightElement={
                !isProUser && (
                  <View style={styles.upgradeButton}>
                    <Text style={styles.upgradeButtonText}>Upgrade</Text>
                  </View>
                )
              }
            />

            {!isProUser && (
              <View style={styles.licenseContainer}>
                <Text style={styles.licenseLabel}>Have a license key?</Text>
                <View style={styles.licenseInputContainer}>
                  <TextInput
                    style={styles.licenseInput}
                    value={tempLicenseKey}
                    onChangeText={setTempLicenseKey}
                    placeholder="Enter license key"
                    placeholderTextColor="#B1ADA1"
                  />
                  <TouchableOpacity
                    style={styles.licenseSubmitButton}
                    onPress={handleLicenseSubmit}>
                    <Text style={styles.licenseSubmitText}>Activate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </SettingSection>

          {/* Preferences Section */}
          <SettingSection title="Preferences">
            <SettingRow
              icon={<Bell size={20} color="#C15F3C" />}
              title="Notifications"
              subtitle="Get notified about updates"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#E5E3DD', true: '#C15F3C' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </SettingSection>

          {/* Support Section */}
          <SettingSection title="Support">
            <SettingRow
              icon={<Mail size={20} color="#C15F3C" />}
              title="Contact Support"
              subtitle="anos.wille@proton.me"
              onPress={() => {
                // TODO: Open email client
              }}
            />
            
            <SettingRow
              icon={<Info size={20} color="#C15F3C" />}
              title="About Boros"
              subtitle="Version 1.0.0"
              onPress={() => {
                Alert.alert(
                  'About Boros',
                  'Boros is a premium AI workspace application powered by advanced language models. Built with React Native and Expo.'
                );
              }}
            />
          </SettingSection>

          {/* Data Section */}
          <SettingSection title="Data">
            <SettingRow
              icon={<Trash2 size={20} color="#EF4444" />}
              title="Reset All Data"
              subtitle="Clear messages, projects, and artifacts"
              onPress={handleResetData}
            />
          </SettingSection>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with ❤️ for productivity enthusiasts
            </Text>
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E3DD',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#2D2A26',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C15F3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  proText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2D2A26',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E3DD',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2D2A26',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
  },
  nameEditContainer: {
    flex: 1,
    marginLeft: 12,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#E5E3DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2D2A26',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0EFE9',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#C15F3C',
  },
  upgradeButton: {
    backgroundColor: '#C15F3C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  licenseContainer: {
    backgroundColor: '#FAF9F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0EFE9',
  },
  licenseLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2D2A26',
    marginBottom: 12,
  },
  licenseInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  licenseInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E3DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2D2A26',
    backgroundColor: '#FFFFFF',
  },
  licenseSubmitButton: {
    backgroundColor: '#C15F3C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  licenseSubmitText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
  },
});