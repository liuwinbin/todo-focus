// ============================================================
// FocusStatsDashboard — 专注统计仪表盘（组合所有统计组件）
// ============================================================
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { FocusStatsCard } from './FocusStatsCard';
import { FocusTrendChart } from './FocusTrendChart';
import { FocusDistributionChart } from './FocusDistributionChart';
import { PeakHoursChart } from './PeakHoursChart';
import { DailyFocusGoalBar } from './DailyFocusGoalBar';
import { SessionHistoryList } from './SessionHistoryList';
import { spacing } from '../../constants/theme';
import { useTimerContext } from '../../context/TimerContext';
import { useSettingsContext } from '../../context/SettingsContext';

export function FocusStatsDashboard() {
  const { state: timerCtx } = useTimerContext();
  const { settings } = useSettingsContext();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FocusStatsCard sessions={timerCtx.allSessions} />
      <DailyFocusGoalBar
        sessions={timerCtx.allSessions}
        dailyGoal={settings.dailyFocusGoal}
      />
      <FocusTrendChart sessions={timerCtx.allSessions} />
      <FocusDistributionChart sessions={timerCtx.allSessions} />
      <PeakHoursChart sessions={timerCtx.allSessions} />
      <SessionHistoryList sessions={timerCtx.allSessions} limit={10} />
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
  },
});
