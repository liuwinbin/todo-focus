// ============================================================
// useTimeStats — 时间统计衍生数据 Hook
// ============================================================
import { useMemo } from 'react';
import { useTimeLog } from './useTimeLog';
import { TIME_LOG_CATEGORIES } from '../types';
import type { TimeLogCategory } from '../types';

export function useTimeStats() {
  const { weekEntries, categoryStats, dailyStats, weekTotalMinutes } = useTimeLog();

  // 饼图数据（分类分布）
  const pieData = useMemo(() => {
    return (Object.entries(categoryStats) as [TimeLogCategory, number][])
      .filter(([, minutes]) => minutes > 0)
      .map(([category, minutes]) => ({
        label: TIME_LOG_CATEGORIES[category].label,
        value: minutes,
        color: TIME_LOG_CATEGORIES[category].color,
      }));
  }, [categoryStats]);

  // 柱状图数据（每日统计）
  const barData = useMemo(() => {
    return dailyStats.map((d) => ({
      label: d.label,
      value: Math.round(d.totalMinutes / 60 * 10) / 10, // 转为小时
    }));
  }, [dailyStats]);

  // 占比最高的分类
  const topCategory = useMemo(() => {
    let maxCat: TimeLogCategory = 'work';
    let maxMin = 0;
    for (const [cat, min] of Object.entries(categoryStats) as [TimeLogCategory, number][]) {
      if (min > maxMin) { maxMin = min; maxCat = cat; }
    }
    return { category: maxCat, minutes: maxMin, ...TIME_LOG_CATEGORIES[maxCat] };
  }, [categoryStats]);

  // 日均时长
  const dailyAverage = useMemo(() => {
    if (dailyStats.length === 0) return 0;
    const total = dailyStats.reduce((s, d) => s + d.totalMinutes, 0);
    return Math.round(total / dailyStats.length);
  }, [dailyStats]);

  // 分类占比百分比
  const categoryPercentages = useMemo(() => {
    const total = weekTotalMinutes || 1;
    return (Object.entries(categoryStats) as [TimeLogCategory, number][]).map(([cat, min]) => ({
      category: cat,
      ...TIME_LOG_CATEGORIES[cat],
      minutes: min,
      percentage: Math.round((min / total) * 100),
    }));
  }, [categoryStats, weekTotalMinutes]);

  return {
    pieData,
    barData,
    topCategory,
    dailyAverage,
    categoryPercentages,
    weekTotalMinutes,
  };
}
