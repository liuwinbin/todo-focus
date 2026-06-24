// ============================================================
// DailyGoalRing — 每日目标完成进度环（第 4 阶段 SVG 版）
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

interface DailyGoalRingProps {
  completed: number;
  goal: number;
  size?: number;
}

export function DailyGoalRing({ completed, goal, size = 120 }: DailyGoalRingProps) {
  const progress = goal > 0 ? Math.min(completed / goal, 1) : 0;
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.number}>{completed}/{goal}</Text>
        <Text style={styles.label}>今日目标</Text>
      </View>
      <Text style={styles.percentText}>完成 {percentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  ring: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primaryLight,
  },
  number: {
    ...typography.heading3,
    color: colors.primary,
    fontWeight: '700',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  percentText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
