// ============================================================
// TimeTrackerDashboard — 时间追踪仪表盘（组合所有组件）
// ============================================================
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { QuickTimeLogger } from './QuickTimeLogger';
import { TimeDistributionCard } from './TimeDistributionCard';
import { WeeklyBarChartCard } from './WeeklyBarChartCard';
import { TimeReportSummary } from './TimeReportSummary';
import { TimeLogList } from './TimeLogList';
import { AppUsageCard } from './AppUsageCard';
import { useTimeLog } from '../../hooks/useTimeLog';
import { useTimeStats } from '../../hooks/useTimeStats';
import { spacing } from '../../constants/theme';
import type { TimeLogEntry } from '../../types';

interface TimeTrackerDashboardProps {
  onQuickLog: (data: Omit<TimeLogEntry, 'id' | 'createdAt'>) => void;
  onCustomLog: () => void;
  onEntryPress: (entry: TimeLogEntry) => void;
  onEntryDelete: (id: string) => void;
}

export function TimeTrackerDashboard({
  onQuickLog,
  onCustomLog,
  onEntryPress,
  onEntryDelete,
}: TimeTrackerDashboardProps) {
  const { entries, todayEntries } = useTimeLog();
  const { pieData, barData, topCategory, dailyAverage, categoryPercentages, weekTotalMinutes } =
    useTimeStats();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 快捷记录 */}
      <QuickTimeLogger onQuickLog={onQuickLog} onCustomLog={onCustomLog} />

      {/* APP 使用统计 */}
      <AppUsageCard />

      {/* 时间分布图 */}
      <TimeDistributionCard pieData={pieData} weekTotalMinutes={weekTotalMinutes} />

      {/* 每日柱状图 */}
      <WeeklyBarChartCard barData={barData} dailyAverage={dailyAverage} />

      {/* 分类占比 */}
      <TimeReportSummary
        categoryPercentages={categoryPercentages}
        topCategory={topCategory}
        dailyAverage={dailyAverage}
      />

      {/* 最近记录 */}
      <TimeLogList
        entries={todayEntries.length > 0 ? todayEntries : entries}
        onEntryPress={onEntryPress}
        onEntryDelete={onEntryDelete}
        limit={10}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
