// ============================================================
// AchievementUnlockOverlay — 成就解锁庆祝弹窗
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import type { Achievement } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AchievementUnlockOverlayProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export function AchievementUnlockOverlay({ achievement, onDismiss }: AchievementUnlockOverlayProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (achievement) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rotateAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [achievement, scaleAnim, opacityAnim, rotateAnim]);

  if (!achievement) return null;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '-10deg', '10deg', '-5deg', '0deg'],
  });

  return (
    <Modal visible={!!achievement} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }, { rotate }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* 庆祝图标 */}
          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <Ionicons name={achievement.icon as any} size={52} color={colors.badgeGold} />
            </View>
            <View style={styles.sparkleContainer}>
              <Text style={styles.sparkleTL}>✨</Text>
              <Text style={styles.sparkleTR}>🎉</Text>
              <Text style={styles.sparkleBL}>🌟</Text>
              <Text style={styles.sparkleBR}>🏆</Text>
            </View>
          </View>

          <Text style={styles.congratsText}>🎊 成就解锁！</Text>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.description}>{achievement.description}</Text>

          <Button
            title="太棒了！"
            onPress={onDismiss}
            variant="primary"
            size="md"
            style={styles.dismissBtn}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    width: Math.min(300, SCREEN_WIDTH - spacing.xl * 2),
    ...{
      shadowColor: colors.badgeGold,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
  },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.badgeGold + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.badgeGold + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  sparkleTL: { position: 'absolute' as const, top: -10, left: '50%', fontSize: 24 },
  sparkleTR: { position: 'absolute' as const, top: '30%', right: -15, fontSize: 22 },
  sparkleBL: { position: 'absolute' as const, bottom: -5, left: '50%', fontSize: 20 },
  sparkleBR: { position: 'absolute' as const, top: '30%', left: -15, fontSize: 22 },
  congratsText: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dismissBtn: {
    marginTop: spacing.md,
    minWidth: 140,
  },
});
