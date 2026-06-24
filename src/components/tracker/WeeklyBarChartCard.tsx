// ============================================================
// WeeklyBarChartCard — 本周每日时长柱状图
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart, type BarChartData } from '../charts/BarChart';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';

interface WeeklyBarChartCardProps {
  barData: BarChartData[];
  dailyAverage: number;
}

export function WeeklyBarChartCard({ barData, dailyAverage }: WeeklyBarChartCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>每日时长</Text>
        <Text style={styles.subtitle}>
          日均 {Math.round((dailyAverage / 60) * 10) / 10}h
        </Text>
      </View>
      <BarChart
        data={barData}
        width={320}
        height={140}
        barColor={colors.primary}
        showValues={false}
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
