// ============================================================
// useHabitGoals — 习惯打卡目标便捷 Hook
// ============================================================
import { useCallback, useMemo } from 'react';
import { useHabitGoalContext } from '../context/HabitGoalContext';
import { formatDate, daysBetween } from '../utils/dates';
import type { HabitGoal, HabitCheckIn, HabitGoalCategory } from '../types';

export function useHabitGoals() {
  const { state, dispatch } = useHabitGoalContext();
  const { goals, checkIns } = state;

  const activeGoals = useMemo(
    () => goals.filter((g) => !g.isArchived),
    [goals],
  );

  const archivedGoals = useMemo(
    () => goals.filter((g) => g.isArchived),
    [goals],
  );

  const addGoal = useCallback(
    (data: Omit<HabitGoal, 'id' | 'createdAt'>) => dispatch({ type: 'ADD_GOAL', payload: data }),
    [dispatch],
  );

  const updateGoal = useCallback(
    (id: string, updates: Partial<HabitGoal>) => dispatch({ type: 'UPDATE_GOAL', payload: { id, updates } }),
    [dispatch],
  );

  const deleteGoal = useCallback(
    (id: string) => dispatch({ type: 'DELETE_GOAL', payload: id }),
    [dispatch],
  );

  const toggleArchive = useCallback(
    (id: string) => dispatch({ type: 'ARCHIVE_GOAL', payload: id }),
    [dispatch],
  );

  const checkIn = useCallback(
    (goalId: string, note?: string) => dispatch({ type: 'CHECK_IN', payload: { goalId, note } }),
    [dispatch],
  );

  const makeupCheckIn = useCallback(
    (goalId: string, date: string, note?: string) =>
      dispatch({ type: 'MAKEUP_CHECK_IN', payload: { goalId, date, note } }),
    [dispatch],
  );

  const removeCheckIn = useCallback(
    (id: string) => dispatch({ type: 'REMOVE_CHECK_IN', payload: id }),
    [dispatch],
  );

  // 获取某目标今日的打卡记录
  const getTodayCheckIn = useCallback(
    (goalId: string): HabitCheckIn | undefined => {
      const today = formatDate();
      return checkIns.find((c) => c.goalId === goalId && c.date === today);
    },
    [checkIns],
  );

  // 获取某目标指定日期的打卡记录
  const getCheckInByDate = useCallback(
    (goalId: string, date: string): HabitCheckIn | undefined => {
      return checkIns.find((c) => c.goalId === goalId && c.date === date);
    },
    [checkIns],
  );

  // 计算目标的连续打卡天数
  const getStreak = useCallback(
    (goalId: string): number => {
      const goalCheckIns = checkIns
        .filter((c) => c.goalId === goalId)
        .sort((a, b) => b.date.localeCompare(a.date));

      if (goalCheckIns.length === 0) return 0;

      const today = formatDate();
      let streak = 0;
      let checkDate = today;

      // 从今天开始向前追溯
      while (true) {
        const found = goalCheckIns.find((c) => c.date === checkDate);
        if (found && found.count > 0) {
          streak++;
          const d = new Date(checkDate);
          d.setDate(d.getDate() - 1);
          checkDate = formatDate(d);
        } else {
          break;
        }
      }

      // 如果今天没有，检查昨天
      if (streak === 0) {
        const yesterday = formatDate(new Date(Date.now() - 86400000));
        checkDate = yesterday;
        while (true) {
          const found = goalCheckIns.find((c) => c.date === checkDate);
          if (found && found.count > 0) {
            streak++;
            const d = new Date(checkDate);
            d.setDate(d.getDate() - 1);
            checkDate = formatDate(d);
          } else {
            break;
          }
        }
      }

      return streak;
    },
    [checkIns],
  );

  // 获取目标的总打卡次数
  const getTotalCheckIns = useCallback(
    (goalId: string): number => {
      return checkIns
        .filter((c) => c.goalId === goalId)
        .reduce((sum, c) => sum + c.count, 0);
    },
    [checkIns],
  );

  // 本周打卡数据（用于 HabitWeekGrid）
  const getWeekCheckIns = useCallback(
    (goalId: string): { date: string; label: string; count: number }[] => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekDays: { date: string; label: string; count: number }[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + mondayOffset + i);
        const dateStr = formatDate(d);
        const dayLabels = ['一', '二', '三', '四', '五', '六', '日'];
        const checkIn = checkIns.find((c) => c.goalId === goalId && c.date === dateStr);
        weekDays.push({
          date: dateStr,
          label: dayLabels[i],
          count: checkIn?.count ?? 0,
        });
      }
      return weekDays;
    },
    [checkIns],
  );

  // 近 7 天打卡趋势数据
  const getTrendData = useCallback(
    (goalId: string): { label: string; value: number }[] => {
      const days: { label: string; value: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = formatDate(d);
        const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];
        const checkIn = checkIns.find((c) => c.goalId === goalId && c.date === dateStr);
        days.push({
          label: dayLabels[d.getDay()],
          value: checkIn?.count ?? 0,
        });
      }
      return days;
    },
    [checkIns],
  );

  // 今日所有打卡
  const todayCheckIns = useMemo(() => {
    const today = formatDate();
    return checkIns.filter((c) => c.date === today);
  }, [checkIns]);

  // 可补卡的日期（最近 7 天未打卡日期）
  const getMakeupDates = useCallback(
    (goalId: string): string[] => {
      const result: string[] = [];
      const today = formatDate();
      for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = formatDate(d);
        const hasCheckIn = checkIns.some((c) => c.goalId === goalId && c.date === dateStr && c.count > 0);
        if (!hasCheckIn) {
          result.push(dateStr);
        }
      }
      return result;
    },
    [checkIns],
  );

  return {
    goals,
    activeGoals,
    archivedGoals,
    checkIns,
    todayCheckIns,
    isLoading: state.isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleArchive,
    checkIn,
    makeupCheckIn,
    removeCheckIn,
    getTodayCheckIn,
    getCheckInByDate,
    getStreak,
    getTotalCheckIns,
    getWeekCheckIns,
    getTrendData,
    getMakeupDates,
  };
}
