// ============================================================
// PeakHoursChart — 专注高峰时段（柱状图）
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from '../charts/BarChart';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import type { FocusSession } from '../../types';

interface PeakHoursChartProps {
  sessions: FocusSession[];
}

const HOUR_LABELS = ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'];

export function PeakHoursChart({ sessions }: PeakHoursChartProps) {
  const data = useMemo(() => {
    const hours = new Array(12).fill(0);

    for (const session of sessions) {
      if (session.type !== 'focus') continue;
      const h = new Date(session.startedAt).getHours();
      const slot = Math.floor(h / 2);
      hours[slot] += Math.round(session.actualDuration / 60);
    }

    return hours.map((value, i) => ({
      label: HOUR_LABELS[i],
      value,
      color: value > 0 ? colors.primary : colors.tabBarBorder,
    }));
  }, [sessions]);

  const peakHour = data.reduce(
    (max, d) => (d.value > max.value ? d : max),
    { label: '-', value: 0, color: '' },
  );

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>高峰时段</Text>
        {peakHour.value > 0 && (
          <Text style={styles.subtitle}>
            最活跃: {peakHour.label} 时 ({peakHour.value} 分钟)
          </Text>
        )}
      </View>
      <BarChart
        data={data}
        width={320}
        height={140}
        showValues={false}
        maxValue={Math.max(...data.map((d) => d.value), 1)}
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
    color: colors.accent,
  },
});
