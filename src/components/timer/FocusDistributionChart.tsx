// ============================================================
// FocusDistributionChart — 专注 vs 休息时长分布（环形图）
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from '../charts/PieChart';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import type { FocusSession } from '../../types';

interface FocusDistributionChartProps {
  sessions: FocusSession[];
}

export function FocusDistributionChart({ sessions }: FocusDistributionChartProps) {
  const data = useMemo(() => {
    const focusMin = Math.round(
      sessions
        .filter((s) => s.type === 'focus')
        .reduce((sum, s) => sum + s.actualDuration, 0) / 60,
    );
    const breakMin = Math.round(
      sessions
        .filter((s) => s.type === 'shortBreak' || s.type === 'longBreak')
        .reduce((sum, s) => sum + s.actualDuration, 0) / 60,
    );

    const total = focusMin + breakMin;

    return [
      { label: '专注', value: focusMin, color: colors.primary },
      { label: '休息', value: breakMin, color: colors.info },
    ];
  }, [sessions]);

  const totalMin = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>时长分布</Text>
      <PieChart
        data={data}
        size={180}
        donut
        donutRadius={0.65}
        centerLabel={`${totalMin}`}
        centerSubLabel="分钟"
        showLegend
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
});
