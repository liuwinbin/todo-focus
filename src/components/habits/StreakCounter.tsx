// ============================================================
// StreakCounter — 连续天数展示
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
}

export function StreakCounter({ currentStreak, longestStreak, dailyGoal }: StreakCounterProps) {
  const hasStreak = currentStreak > 0;
  const flameColor = hasStreak ? colors.streakFlame : colors.streakEmpty;

  return (
    <Card style={styles.container}>
      <View style={styles.mainRow}>
        <Ionicons
          name={hasStreak ? 'flame' : 'flame-outline'}
          size={48}
          color={flameColor}
        />
        <View style={styles.streakInfo}>
          <View style={styles.streakRow}>
            <Text style={[styles.streakNumber, { color: flameColor }]}>
              {currentStreak}
            </Text>
            <Text style={styles.streakUnit}>天</Text>
          </View>
          <Text style={styles.streakLabel}>当前连续</Text>
        </View>
        <View style={styles.bestInfo}>
          <Text style={styles.bestNumber}>{longestStreak}</Text>
          <Text style={styles.bestLabel}>最佳记录</Text>
        </View>
      </View>
      {hasStreak && currentStreak < dailyGoal && (
        <Text style={styles.hint}>再坚持 {dailyGoal - currentStreak} 天就达标啦 💪</Text>
      )}
      {currentStreak >= dailyGoal && (
        <Text style={styles.hint}>太棒了！今日目标已达成 🎉</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    padding: spacing.lg,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakNumber: {
    fontSize: 40,
    fontWeight: '700',
  },
  streakUnit: {
    ...typography.heading3,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  streakLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -2,
  },
  bestInfo: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  bestNumber: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  bestLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.primaryBg,
    padding: spacing.sm,
    borderRadius: 8,
  },
});
