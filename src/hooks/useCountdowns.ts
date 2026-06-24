// ============================================================
// useCountdowns — 倒数日操作 Hook
// ============================================================
import { useCallback, useMemo } from 'react';
import { useCountdownContext } from '../context/CountdownContext';
import { daysBetween } from '../utils/lunar';
import type { CountdownItem, CountdownType } from '../types';

export function useCountdowns() {
  const { countdowns, dispatch } = useCountdownContext();

  const addCountdown = useCallback(
    (data: Omit<CountdownItem, 'id' | 'createdAt'>) => {
      dispatch({ type: 'ADD', payload: data });
    },
    [dispatch],
  );

  const updateCountdown = useCallback(
    (id: string, data: Partial<CountdownItem>) => {
      dispatch({ type: 'UPDATE', payload: { id, data } });
    },
    [dispatch],
  );

  const deleteCountdown = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE', payload: id });
    },
    [dispatch],
  );

  /** 获取剩余天数（正数=未到，0=今天，负数=已过） */
  const getDaysRemaining = useCallback((targetDate: string, isRepeatYearly: boolean): number => {
    const now = new Date();
    const target = new Date(targetDate);

    if (isRepeatYearly) {
      // 对于每年重复的，使用今年的日期
      const thisYear = new Date(
        now.getFullYear(),
        target.getMonth(),
        target.getDate(),
      );
      if (thisYear.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
        // 今年的已过，使用明年的
        thisYear.setFullYear(thisYear.getFullYear() + 1);
      }
      return daysBetween(now, thisYear);
    }

    return daysBetween(now, target);
  }, []);

  /** 带剩余天数的倒数日列表（按剩余天数升序排列） */
  const sortedCountdowns = useMemo(() => {
    return countdowns
      .map((c) => ({
        ...c,
        daysRemaining: getDaysRemaining(c.targetDate, c.isRepeatYearly),
      }))
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [countdowns, getDaysRemaining]);

  return {
    countdowns,
    sortedCountdowns,
    addCountdown,
    updateCountdown,
    deleteCountdown,
    getDaysRemaining,
  };
}
