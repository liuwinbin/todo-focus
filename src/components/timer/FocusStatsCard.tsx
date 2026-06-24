// ============================================================
// FocusStatsCard — 专注统计摘要卡片
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import type { FocusSession } from '../../types';

interface FocusStatsCardProps {
  sessions: FocusSession[];
}

export function FocusStatsCard({ sessions }: FocusStatsCardProps) {
  const focusSessions = sessions.filter((s) => s.type === 'focus');
  const totalFocusMin = Math.round(
    focusSessions.reduce((sum, s) => sum + s.actualDuration, 0) / 60,
  );
  const completed = focusSessions.filter((s) => s.completed).length;
  const completionRate =
    focusSessions.length > 0 ? Math.round((completed / focusSessions.length) * 100) : 0;
  const totalSessions = sessions.length;

  const stats = [
    {
      icon: 'flame-outline' as const,
      value: `${totalFocusMin}`,
      unit: '分钟',
      label: '总专注时长',
      color: colors.accent,
    },
    {
      icon: 'checkmark-circle-outline' as const,
      value: `${completed}`,
      unit: '',
      label: '已完成',
      color: colors.success,
    },
    {
      icon: 'analytics-outline' as const,
      value: `${completionRate}`,
      unit: '%',
      label: '完成率',
      color: colors.primary,
    },
    {
      icon: 'timer-outline' as const,
      value: `${totalSessions}`,
      unit: '次',
      label: '总次数',
      color: colors.info,
    },
  ];

  return (
    <Card style={styles.container} padding={0}>
      <View style={styles.row}>
        {stats.map((stat, i) => (
          <View key={i} style={styles.statItem}>
            <View style={[styles.iconCircle, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon} size={18} color={stat.color} />
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.value}>{stat.value}</Text>
              {stat.unit ? <Text style={styles.unit}>{stat.unit}</Text> : null}
            </View>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
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
    paddingVertical: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  value: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  unit: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  label: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
