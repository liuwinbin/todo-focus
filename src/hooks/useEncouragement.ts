// ============================================================
// useEncouragement — 鼓励系统 Hook
// ============================================================
import { useState, useCallback, useRef } from 'react';
import { pickQuote, type QuoteCategory } from '../data/quotes';
import { useHabitContext } from '../context/HabitContext';

export function useEncouragement() {
  const { state: habitState } = useHabitContext();
  const [currentQuote, setCurrentQuote] = useState('每一次专注，都是对自己的承诺 ✨');
  const recentRef = useRef<string[]>([]);

  const refreshQuote = useCallback(
    (category: QuoteCategory = 'general') => {
      const quote = pickQuote(category, recentRef.current, habitState.streakInfo.currentStreak);

      // 维护最近使用列表（最多 5 条）
      recentRef.current = [quote, ...recentRef.current].slice(0, 5);
      setCurrentQuote(quote);
      return quote;
    },
    [habitState.streakInfo.currentStreak],
  );

  /** 根据当前状态获取合适的鼓励 */
  const getContextQuote = useCallback(() => {
    const hour = new Date().getHours();
    const streak = habitState.streakInfo.currentStreak;

    if (hour >= 6 && hour < 10) {
      return pickQuote('morning', recentRef.current, streak);
    }
    if (streak >= 3) {
      return pickQuote('streak', recentRef.current, streak);
    }
    return pickQuote('general', recentRef.current, streak);
  }, [habitState.streakInfo.currentStreak]);

  return {
    currentQuote,
    refreshQuote,
    getContextQuote,
  };
}
