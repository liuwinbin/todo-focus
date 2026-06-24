// ============================================================
// AchievementBadge — 单个成就徽章展示
// ============================================================
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import type { Achievement } from '../../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (achievement.isUnlocked) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [achievement.isUnlocked, pulseAnim]);

  const sizeConfig = {
    sm: { container: 64, icon: 28, font: 10 },
    md: { container: 80, icon: 36, font: 12 },
    lg: { container: 100, icon: 48, font: 14 },
  };

  const s = sizeConfig[size];
  const isUnlocked = achievement.isUnlocked;

  return (
    <Animated.View
      style={[
        styles.container,
        { width: s.container },
        { transform: [{ scale: isUnlocked ? pulseAnim : 1 }] },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            width: s.container - 16,
            height: s.container - 16,
            borderRadius: (s.container - 16) / 2,
          },
          isUnlocked ? styles.iconUnlocked : styles.iconLocked,
        ]}
      >
        <Ionicons
          name={achievement.icon as any}
          size={s.icon}
          color={isUnlocked ? colors.badgeGold : colors.badgeLocked}
        />
      </View>
      {!isUnlocked && (
        <View style={styles.lockOverlay}>
          <Ionicons name="lock-closed-outline" size={12} color={colors.badgeLocked} />
        </View>
      )}
      <Text
        style={[
          styles.title,
          { fontSize: s.font },
          isUnlocked ? styles.titleUnlocked : styles.titleLocked,
        ]}
        numberOfLines={1}
      >
        {achievement.title}
      </Text>
      {!isUnlocked && (
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.round((achievement.progress / achievement.target) * 100)}%` as unknown as number,
              },
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  iconUnlocked: {
    backgroundColor: colors.badgeGold + '25',
    borderWidth: 2,
    borderColor: colors.badgeGold,
  },
  iconLocked: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.badgeLocked,
  },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.badgeLocked,
  },
  title: {
    ...typography.caption,
    textAlign: 'center',
  },
  titleUnlocked: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  titleLocked: {
    color: colors.textTertiary,
  },
  progressBar: {
    width: '80%',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.tabBarBorder,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: colors.badgeLocked,
  },
});
