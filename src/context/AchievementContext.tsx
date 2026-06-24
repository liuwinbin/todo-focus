// ============================================================
// AchievementContext — 成就徽章系统持久化
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/dates';
import type { Achievement, AchievementCategory } from '../types';

// ---- 内置成就定义 ----
const BUILT_IN_ACHIEVEMENTS: Omit<Achievement, 'id' | 'unlockedAt' | 'isUnlocked'>[] = [
  // 里程碑
  { key: 'first_task', title: '初次启程', description: '完成第一个任务', icon: 'flag-outline', category: 'milestone', progress: 0, target: 1 },
  { key: 'tasks_10', title: '小有成就', description: '累计完成 10 个任务', icon: 'checkmark-done-outline', category: 'milestone', progress: 0, target: 10 },
  { key: 'tasks_50', title: '任务达人', description: '累计完成 50 个任务', icon: 'ribbon-outline', category: 'milestone', progress: 0, target: 50 },
  { key: 'tasks_100', title: '效率大师', description: '累计完成 100 个任务', icon: 'trophy-outline', category: 'milestone', progress: 0, target: 100 },
  { key: 'focus_10h', title: '专注新手', description: '累计专注 10 小时', icon: 'hourglass-outline', category: 'milestone', progress: 0, target: 600 },
  { key: 'focus_50h', title: '深度专注者', description: '累计专注 50 小时', icon: 'time-outline', category: 'milestone', progress: 0, target: 3000 },
  // 连续打卡
  { key: 'streak_3', title: '三日之约', description: '连续 3 天完成打卡', icon: 'flame-outline', category: 'streak', progress: 0, target: 3 },
  { key: 'streak_7', title: '一周坚持', description: '连续 7 天完成打卡', icon: 'calendar-outline', category: 'streak', progress: 0, target: 7 },
  { key: 'streak_30', title: '月度之星', description: '连续 30 天完成打卡', icon: 'star-outline', category: 'streak', progress: 0, target: 30 },
  // 特殊
  { key: 'early_bird', title: '早起鸟儿', description: '早上 6 点前完成一次专注', icon: 'sunny-outline', category: 'special', progress: 0, target: 1 },
  { key: 'night_owl', title: '夜猫子', description: '晚上 10 点后完成一次专注', icon: 'moon-outline', category: 'special', progress: 0, target: 1 },
  { key: 'all_category', title: '全面发展', description: '在 4 个分类中都创建了打卡目标', icon: 'apps-outline', category: 'special', progress: 0, target: 4 },
];

// ---- State ----
interface AchievementState {
  achievements: Achievement[];
  latestUnlock: Achievement | null;
  isLoading: boolean;
}

const initialState: AchievementState = {
  achievements: [],
  latestUnlock: null,
  isLoading: true,
};

// ---- Actions ----
type AchievementAction =
  | { type: 'LOAD'; payload: Achievement[] }
  | { type: 'UPDATE_PROGRESS'; payload: { key: string; progress: number } }
  | { type: 'UNLOCK'; payload: { key: string } }
  | { type: 'CLEAR_LATEST' };

// ---- Reducer ----
function achievementReducer(state: AchievementState, action: AchievementAction): AchievementState {
  switch (action.type) {
    case 'LOAD': {
      // 合并内置成就与已持久化数据
      const savedMap = new Map(action.payload.map((a) => [a.key, a]));
      const merged: Achievement[] = BUILT_IN_ACHIEVEMENTS.map((def) => {
        const saved = savedMap.get(def.key);
        return {
          ...def,
          id: saved?.id ?? generateId(),
          unlockedAt: saved?.unlockedAt,
          progress: saved?.progress ?? def.progress,
          isUnlocked: saved?.isUnlocked ?? false,
        };
      });
      return { ...state, achievements: merged, isLoading: false };
    }

    case 'UPDATE_PROGRESS': {
      const updated = state.achievements.map((a) => {
        if (a.key === action.payload.key && !a.isUnlocked) {
          const progress = Math.min(action.payload.progress, a.target);
          const isUnlocked = progress >= a.target;
          return {
            ...a,
            progress,
            isUnlocked,
            unlockedAt: isUnlocked ? new Date().toISOString() : a.unlockedAt,
          };
        }
        return a;
      });
      const newlyUnlocked = updated.find(
        (a) => a.key === action.payload.key && a.isUnlocked && !state.achievements.find((s) => s.key === a.key)?.isUnlocked,
      );
      return {
        ...state,
        achievements: updated,
        latestUnlock: newlyUnlocked ?? state.latestUnlock,
      };
    }

    case 'UNLOCK': {
      const unlocked = state.achievements.map((a) =>
        a.key === action.payload.key && !a.isUnlocked
          ? { ...a, progress: a.target, isUnlocked: true, unlockedAt: new Date().toISOString() }
          : a,
      );
      const badge = unlocked.find((a) => a.key === action.payload.key);
      return { ...state, achievements: unlocked, latestUnlock: badge ?? null };
    }

    case 'CLEAR_LATEST':
      return { ...state, latestUnlock: null };

    default:
      return state;
  }
}

// ---- Context ----
interface AchievementContextValue {
  state: AchievementState;
  dispatch: React.Dispatch<AchievementAction>;
}

const AchievementContext = createContext<AchievementContextValue | null>(null);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(achievementReducer, initialState);

  // 加载已持久化数据
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.achievements);
        dispatch({ type: 'LOAD', payload: raw ? JSON.parse(raw) : [] });
      } catch {
        dispatch({ type: 'LOAD', payload: [] });
      }
    })();
  }, []);

  // 持久化（500ms 防抖）
  useEffect(() => {
    if (state.isLoading) return;
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(state.achievements)).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [state.achievements, state.isLoading]);

  return (
    <AchievementContext.Provider value={{ state, dispatch }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievementContext() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievementContext must be used within AchievementProvider');
  return ctx;
}
