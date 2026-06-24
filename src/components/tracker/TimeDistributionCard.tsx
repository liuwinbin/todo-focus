// ============================================================
// TimeDistributionCard — 时间分类分布（环形图）
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from '../charts/PieChart';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import type { PieChartData } from '../charts/PieChart';

interface TimeDistributionCardProps {
  pieData: PieChartData[];
  weekTotalMinutes: number;
}

export function TimeDistributionCard({ pieData, weekTotalMinutes }: TimeDistributionCardProps) {
  const totalHours = Math.round((weekTotalMinutes / 60) * 10) / 10;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>本周时间分布</Text>
        <Text style={styles.subtitle}>共 {totalHours}h</Text>
      </View>
      {pieData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>本周还没有记录</Text>
        </View>
      ) : (
        <PieChart
          data={pieData}
          size={180}
          donut
          donutRadius={0.65}
          centerLabel={`${totalHours}h`}
          centerSubLabel="总时长"
          showLegend
        />
      )}
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
  empty: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
});
