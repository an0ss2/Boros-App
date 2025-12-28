import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { X, Crown, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBorosStore } from '@/store/borosStore';

interface MessageLimitModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export function MessageLimitModal({ visible, onClose }: MessageLimitModalProps) {
  const { messageCount, lastResetTime } = useBorosStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getTimeUntilReset = () => {
    const now = new Date();
    const resetTime = new Date(lastResetTime.getTime() + 5 * 60 * 60 * 1000); // 5 hours
    const timeDiff = resetTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Now';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim },
        ]}>
        
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          
          <LinearGradient
            colors={['#FAF9F5', '#F4F3EE']}
            style={styles.modalContent}>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}>
              <X size={24} color="#B1ADA1" />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <View style={styles.limitIcon}>
                <Clock size={32} color="#C15F3C" />
              </View>
            </View>

            <Text style={styles.title}>
              Message Limit Reached
            </Text>

            <Text style={styles.description}>
              You've used all 5 free messages. Your messages will reset in{' '}
              <Text style={styles.highlight}>{getTimeUntilReset()}</Text>.
            </Text>

            <View style={styles.upgradeContainer}>
              <LinearGradient
                colors={['#C15F3C', '#A54A2F']}
                style={styles.upgradeButton}>
                
                <Crown size={20} color="#FFFFFF" />
                <Text style={styles.upgradeText}>
                  Upgrade to Pro
                </Text>
              </LinearGradient>

              <Text style={styles.upgradeDescription}>
                Get unlimited messages, priority support, and advanced features
              </Text>
            </View>

            <View style={styles.contactContainer}>
              <Text style={styles.contactText}>
                For license inquiries, contact:
              </Text>
              <Text style={styles.contactEmail}>
                anos.wille@proton.me
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 20,
  },
  limitIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#2D2A26',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  highlight: {
    fontFamily: 'Inter-Medium',
    color: '#C15F3C',
  },
  upgradeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  upgradeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  upgradeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
    textAlign: 'center',
    lineHeight: 20,
  },
  contactContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0EFE9',
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B1ADA1',
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#C15F3C',
  },
});