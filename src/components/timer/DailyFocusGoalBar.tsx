// ============================================================
// DailyFocusGoalBar — 每日专注目标进度条
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import type { FocusSession } from '../../types';

interface DailyFocusGoalBarProps {
  sessions: FocusSession[];
  dailyGoal: number; // 每日专注目标（分钟）
}

export function DailyFocusGoalBar({ sessions, dailyGoal }: DailyFocusGoalBarProps) {
  const todayFocusMin = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return Math.round(
      sessions
        .filter((s) => s.type === 'focus' && s.startedAt.startsWith(today))
        .reduce((sum, s) => sum + s.actualDuration, 0) / 60,
    );
  }, [sessions]);

  const progress = Math.min(1, todayFocusMin / dailyGoal);
  const percentage = Math.round(progress * 100);
  const isComplete = todayFocusMin >= dailyGoal;
  const remaining = Math.max(0, dailyGoal - todayFocusMin);

  return (
    <Card style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Ionicons
            name={isComplete ? 'trophy' : 'flag-outline'}
            size={22}
            color={isComplete ? colors.badgeGold : colors.primary}
          />
        </View>
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.title}>今日专注目标</Text>
            <Text style={[styles.percentage, isComplete && styles.percentageDone]}>
              {percentage}%
            </Text>
          </View>
          {/* 进度条 */}
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${percentage}%` as unknown as number,
                  backgroundColor: isComplete ? colors.success : colors.primary,
                },
              ]}
            />
          </View>
          <Text style={styles.summary}>
            {todayFocusMin} / {dailyGoal} 分钟
            {isComplete ? ' 🎉 目标达成！' : ` · 还差 ${remaining} 分钟`}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  percentage: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  percentageDone: {
    color: colors.success,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  summary: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
