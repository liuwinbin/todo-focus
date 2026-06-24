// ============================================================
// AppUsageCard — APP 内使用统计卡片
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import { useTimerContext } from '../../context/TimerContext';
import { useItemContext } from '../../context/ItemContext';
import { formatDate } from '../../utils/dates';

export function AppUsageCard() {
  const { state: timerCtx } = useTimerContext();
  const { state: itemCtx } = useItemContext();

  const stats = useMemo(() => {
    const today = formatDate();

    const todayFocusSessions = timerCtx.allSessions.filter(
      (s) => s.type === 'focus' && s.startedAt.startsWith(today),
    );
    const todayFocusMin = Math.round(
      todayFocusSessions.reduce((sum, s) => sum + s.actualDuration, 0) / 60,
    );

    const todayTasksDone = itemCtx.items.filter(
      (it) => it.completed,
    ).length;

    const totalTasks = itemCtx.items.length;
    const totalSessions = timerCtx.allSessions.filter((s) => s.type === 'focus').length;

    return {
      todayFocusMin,
      todayTasksDone,
      totalTasks,
      totalSessions,
    };
  }, [timerCtx.allSessions, itemCtx.items]);

  const usageItems = [
    { icon: 'timer-outline' as const, label: '今日专注', value: `${stats.todayFocusMin}m`, color: colors.primary },
    { icon: 'checkmark-circle-outline' as const, label: '完成任务', value: `${stats.todayTasksDone}`, color: colors.success },
    { icon: 'layers-outline' as const, label: '总任务', value: `${stats.totalTasks}`, color: colors.info },
    { icon: 'flame-outline' as const, label: '总专注', value: `${stats.totalSessions}次`, color: colors.accent },
  ];

  return (
    <Card style={styles.container} padding={0}>
      <View style={styles.header}>
        <Ionicons name="phone-portrait-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.headerTitle}>APP 使用统计</Text>
      </View>
      <View style={styles.grid}>
        {usageItems.map((item, i) => (
          <View key={i} style={styles.gridItem}>
            <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>
            <Text style={styles.gridValue}>{item.value}</Text>
            <Text style={styles.gridLabel}>{item.label}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  headerTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  gridItem: {
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
  gridValue: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  gridLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
