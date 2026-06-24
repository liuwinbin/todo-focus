// ============================================================
// StatsSummary — 统计数据 2×2 卡片
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import { formatMinutes } from '../../utils/dates';

interface StatsSummaryProps {
  totalFocusMinutes: number;
  totalSessions: number;
  totalTasks: number;
  currentStreak: number;
}

interface StatCardData {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  color: string;
}

export function StatsSummary({ totalFocusMinutes, totalSessions, totalTasks, currentStreak }: StatsSummaryProps) {
  const stats: StatCardData[] = [
    {
      icon: 'time-outline',
      value: formatMinutes(totalFocusMinutes),
      label: '总专注时间',
      color: colors.primary,
    },
    {
      icon: 'checkmark-circle-outline',
      value: String(totalSessions),
      label: '专注次数',
      color: colors.success,
    },
    {
      icon: 'checkbox-outline',
      value: String(totalTasks),
      label: '完成任务',
      color: colors.accent,
    },
    {
      icon: 'trophy-outline',
      value: `${currentStreak} 天`,
      label: '最佳连续',
      color: colors.streakFlame,
    },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <Card key={index} style={styles.statCard}>
          <Ionicons name={stat.icon} size={24} color={stat.color} />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  statValue: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
