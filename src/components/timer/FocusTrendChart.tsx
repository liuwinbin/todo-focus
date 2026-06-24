// ============================================================
// FocusTrendChart — 专注时长趋势（7 天折线图）
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from '../charts/LineChart';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import type { FocusSession } from '../../types';

interface FocusTrendChartProps {
  sessions: FocusSession[];
}

export function FocusTrendChart({ sessions }: FocusTrendChartProps) {
  const chartData = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      const dayLabel = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
      days.push({ label: dayLabel, value: 0 });
    }

    // 填充数据
    for (const session of sessions) {
      if (session.type !== 'focus') continue;
      const sDate = new Date(session.startedAt);
      const diffDays = Math.floor((now.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        const idx = 6 - diffDays;
        days[idx].value += Math.round(session.actualDuration / 60);
      }
    }

    return days;
  }, [sessions]);

  const totalMin = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>专注趋势</Text>
        <Text style={styles.subtitle}>近 7 天 · {totalMin} 分钟</Text>
      </View>
      <LineChart
        data={chartData}
        width={300}
        height={160}
        lineColor={colors.primary}
        showDots
        showFill
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
