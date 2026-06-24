// ============================================================
// useTimeLog — 时间日志操作 Hook
// ============================================================
import { useCallback, useMemo } from 'react';
import { useTimeLogContext } from '../context/TimeLogContext';
import { formatDate } from '../utils/dates';
import type { TimeLogEntry, TimeLogCategory } from '../types';

export function useTimeLog() {
  const { state, dispatch } = useTimeLogContext();
  const { entries } = state;

  const addEntry = useCallback(
    (data: Omit<TimeLogEntry, 'id' | 'createdAt'>) =>
      dispatch({ type: 'ADD_ENTRY', payload: data }),
    [dispatch],
  );

  const updateEntry = useCallback(
    (id: string, updates: Partial<TimeLogEntry>) =>
      dispatch({ type: 'UPDATE_ENTRY', payload: { id, updates } }),
    [dispatch],
  );

  const deleteEntry = useCallback(
    (id: string) => dispatch({ type: 'DELETE_ENTRY', payload: id }),
    [dispatch],
  );

  // 今日记录
  const todayEntries = useMemo(() => {
    const today = formatDate();
    return entries.filter((e) => e.startedAt.startsWith(today));
  }, [entries]);

  // 本周记录
  const weekEntries = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    weekStart.setHours(0, 0, 0, 0);
    return entries.filter((e) => new Date(e.startedAt) >= weekStart);
  }, [entries]);

  // 按分类统计（本周）
  const categoryStats = useMemo(() => {
    const map: Record<TimeLogCategory, number> = {
      work: 0, study: 0, exercise: 0, entertainment: 0, rest: 0, other: 0,
    };
    for (const e of weekEntries) {
      map[e.category] = (map[e.category] ?? 0) + e.durationMinutes;
    }
    return map;
  }, [weekEntries]);

  // 每日统计（本周，用于柱状图）
  const dailyStats = useMemo(() => {
    const days: { label: string; date: string; totalMinutes: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];
      const dayEntries = entries.filter((e) => e.startedAt.startsWith(dateStr));
      const totalMinutes = dayEntries.reduce((s, e) => s + e.durationMinutes, 0);
      days.push({ label: dayLabels[d.getDay()], date: dateStr, totalMinutes });
    }
    return days;
  }, [entries]);

  // 总计时长
  const totalMinutes = useMemo(
    () => entries.reduce((s, e) => s + e.durationMinutes, 0),
    [entries],
  );

  const todayTotalMinutes = useMemo(
    () => todayEntries.reduce((s, e) => s + e.durationMinutes, 0),
    [todayEntries],
  );

  const weekTotalMinutes = useMemo(
    () => weekEntries.reduce((s, e) => s + e.durationMinutes, 0),
    [weekEntries],
  );

  return {
    entries,
    todayEntries,
    weekEntries,
    categoryStats,
    dailyStats,
    totalMinutes,
    todayTotalMinutes,
    weekTotalMinutes,
    isLoading: state.isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
