// ============================================================
// useAchievements — 成就徽章便捷 Hook
// ============================================================
import { useCallback, useMemo } from 'react';
import { useAchievementContext } from '../context/AchievementContext';
import type { Achievement, AchievementCategory } from '../types';

export function useAchievements() {
  const { state, dispatch } = useAchievementContext();
  const { achievements, latestUnlock } = state;

  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.isUnlocked),
    [achievements],
  );

  const lockedAchievements = useMemo(
    () => achievements.filter((a) => !a.isUnlocked),
    [achievements],
  );

  const achievementsByCategory = useMemo(() => {
    const map: Record<AchievementCategory, Achievement[]> = {
      milestone: [],
      streak: [],
      special: [],
    };
    for (const a of achievements) {
      map[a.category]?.push(a);
    }
    return map;
  }, [achievements]);

  const updateProgress = useCallback(
    (key: string, progress: number) =>
      dispatch({ type: 'UPDATE_PROGRESS', payload: { key, progress } }),
    [dispatch],
  );

  const unlock = useCallback(
    (key: string) => dispatch({ type: 'UNLOCK', payload: { key } }),
    [dispatch],
  );

  const clearLatest = useCallback(
    () => dispatch({ type: 'CLEAR_LATEST' }),
    [dispatch],
  );

  // 获取成就进度
  const getProgress = useCallback(
    (key: string): Achievement | undefined => achievements.find((a) => a.key === key),
    [achievements],
  );

  const totalUnlocked = unlockedAchievements.length;
  const totalCount = achievements.length;
  const unlockPercentage = totalCount > 0 ? Math.round((totalUnlocked / totalCount) * 100) : 0;

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    achievementsByCategory,
    latestUnlock,
    totalUnlocked,
    totalCount,
    unlockPercentage,
    updateProgress,
    unlock,
    clearLatest,
    getProgress,
  };
}
