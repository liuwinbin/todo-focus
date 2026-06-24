// ============================================================
// HabitTrendChart — 单个打卡目标的 7 天趋势折线图
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from '../charts/LineChart';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import type { HabitGoal, HabitCheckIn } from '../../types';
import { formatDate } from '../../utils/dates';

interface HabitTrendChartProps {
  goal: HabitGoal;
  checkIns: HabitCheckIn[];
}

export function HabitTrendChart({ goal, checkIns }: HabitTrendChartProps) {
  const data = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];
      const dayCheckIns = checkIns.filter((c) => c.goalId === goal.id && c.date === dateStr);
      const total = dayCheckIns.reduce((s, c) => s + c.count, 0);
      days.push({ label: dayLabels[d.getDay()], value: total });
    }
    return days;
  }, [goal.id, checkIns]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>打卡趋势</Text>
        <Text style={styles.subtitle}>近 7 天 · {total} 次</Text>
      </View>
      <LineChart
        data={data}
        width={300}
        height={140}
        lineColor={goal.color ?? colors.primary}
        showDots
        showFill
        maxValue={Math.max(goal.targetCount, ...data.map((d) => d.value))}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    width: '100%',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
