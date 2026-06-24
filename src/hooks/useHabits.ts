// ============================================================
// useHabits — 习惯追踪数据便捷 Hook
// ============================================================
import { useMemo } from 'react';
import { useHabitContext } from '../context/HabitContext';
import { formatDate, daysBetween } from '../utils/dates';
import type { CalendarDay } from '../types';

export function useHabits() {
  const { state } = useHabitContext();
  const { dailyRecords, streakInfo } = state;

  /** 生成热力图数据 */
  const calendarDays: CalendarDay[] = useMemo(() => {
    return dailyRecords.map((r) => ({
      date: r.date,
      sessionsCompleted: r.focusSessionsCompleted,
      level: getHeatLevel(r.focusSessionsCompleted),
    }));
  }, [dailyRecords]);

  /** 统计汇总 */
  const stats = useMemo(() => {
    const totalFocusMinutes = dailyRecords.reduce((s, r) => s + r.totalFocusMinutes, 0);
    const totalTasks = dailyRecords.reduce((s, r) => s + r.tasksCompleted, 0);
    return { totalFocusMinutes, totalTasks };
  }, [dailyRecords]);

  return {
    dailyRecords,
    streakInfo,
    calendarDays,
    ...stats,
  };
}

/** 根据完成数返回热力等级 */
function getHeatLevel(sessions: number): 0 | 1 | 2 | 3 | 4 {
  if (sessions === 0) return 0;
  if (sessions === 1) return 1;
  if (sessions <= 2) return 2;
  if (sessions <= 4) return 3;
  return 4;
}
