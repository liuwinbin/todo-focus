// ============================================================
// HabitContext — 每日习惯追踪和连续天数
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import { formatDate, daysBetween } from '../utils/dates';
import { DEFAULT_SETTINGS } from './SettingsContext';
import type { DailyRecord, StreakInfo } from '../types';

// ---- State ----
interface HabitState {
  dailyRecords: DailyRecord[];
  streakInfo: StreakInfo;
  isLoading: boolean;
}

const initialStreakInfo: StreakInfo = {
  currentStreak: 0,
  longestStreak: 0,
  totalFocusDays: 0,
  dailyGoal: DEFAULT_SETTINGS.dailyFocusGoal,
};

const initialState: HabitState = {
  dailyRecords: [],
  streakInfo: initialStreakInfo,
  isLoading: true,
};

// ---- Helpers ----
function calculateStreak(records: DailyRecord[], dailyGoal: number): StreakInfo {
  if (records.length === 0) return { currentStreak: 0, longestStreak: 0, totalFocusDays: 0, dailyGoal };

  // 按日期降序排列
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const metGoal = sorted.filter((r) => r.focusSessionsCompleted >= dailyGoal);

  let currentStreak = 0;
  const today = formatDate();

  // 从今天开始向前计算连续天数
  let checkDate = today;
  const recordMap = new Map(records.map((r) => [r.date, r]));

  // 检查今天是否达标
  const todayRecord = recordMap.get(today);
  if (todayRecord && todayRecord.focusSessionsCompleted >= dailyGoal) {
    currentStreak = 1;
    // 向前追溯
    let prev = today;
    while (true) {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      prev = formatDate(d);
      const r = recordMap.get(prev);
      if (r && r.focusSessionsCompleted >= dailyGoal) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    // 今天还没达标，检查昨天
    const yesterday = formatDate(new Date(Date.now() - 86400000));
    const yesterdayRecord = recordMap.get(yesterday);
    if (yesterdayRecord && yesterdayRecord.focusSessionsCompleted >= dailyGoal) {
      currentStreak = 1;
      let prev = yesterday;
      while (true) {
        const d = new Date(prev);
        d.setDate(d.getDate() - 1);
        prev = formatDate(d);
        const r = recordMap.get(prev);
        if (r && r.focusSessionsCompleted >= dailyGoal) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // 计算最长连续
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedAsc = [...records].sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 0; i < sortedAsc.length; i++) {
    if (sortedAsc[i].focusSessionsCompleted >= dailyGoal) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const gap = daysBetween(sortedAsc[i - 1].date, sortedAsc[i].date);
        if (gap === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  const totalFocusDays = records.filter((r) => r.focusSessionsCompleted > 0).length;

  return { currentStreak, longestStreak, totalFocusDays, dailyGoal };
}

// ---- Actions ----
type HabitAction =
  | { type: 'LOAD_RECORDS'; payload: DailyRecord[] }
  | { type: 'RECORD_SESSION'; payload: { focusMinutes: number } }
  | { type: 'RECORD_TASK_COMPLETION' }
  | { type: 'UPDATE_DAILY_GOAL'; payload: number };

// ---- Reducer ----
function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case 'LOAD_RECORDS': {
      const dailyGoal = state.streakInfo.dailyGoal;
      return {
        dailyRecords: action.payload,
        streakInfo: calculateStreak(action.payload, dailyGoal),
        isLoading: false,
      };
    }

    case 'RECORD_SESSION': {
      const today = formatDate();
      const existing = state.dailyRecords.find((r) => r.date === today);
      let newRecords: DailyRecord[];
      if (existing) {
        newRecords = state.dailyRecords.map((r) =>
          r.date === today
            ? {
                ...r,
                focusSessionsCompleted: r.focusSessionsCompleted + 1,
                totalFocusMinutes: r.totalFocusMinutes + action.payload.focusMinutes,
              }
            : r,
        );
      } else {
        newRecords = [
          ...state.dailyRecords,
          {
            date: today,
            focusSessionsCompleted: 1,
            tasksCompleted: 0,
            totalFocusMinutes: action.payload.focusMinutes,
          },
        ];
      }
      return {
        ...state,
        dailyRecords: newRecords,
        streakInfo: calculateStreak(newRecords, state.streakInfo.dailyGoal),
      };
    }

    case 'RECORD_TASK_COMPLETION': {
      const today = formatDate();
      const existing = state.dailyRecords.find((r) => r.date === today);
      let newRecords: DailyRecord[];
      if (existing) {
        newRecords = state.dailyRecords.map((r) =>
          r.date === today ? { ...r, tasksCompleted: r.tasksCompleted + 1 } : r,
        );
      } else {
        newRecords = [
          ...state.dailyRecords,
          { date: today, focusSessionsCompleted: 0, tasksCompleted: 1, totalFocusMinutes: 0 },
        ];
      }
      return { ...state, dailyRecords: newRecords };
    }

    case 'UPDATE_DAILY_GOAL': {
      const newInfo = calculateStreak(state.dailyRecords, action.payload);
      return { ...state, streakInfo: newInfo };
    }

    default:
      return state;
  }
}

// ---- Context ----
interface HabitContextValue {
  state: HabitState;
  dispatch: React.Dispatch<HabitAction>;
}

const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.dailyRecords);
        if (raw) {
          dispatch({ type: 'LOAD_RECORDS', payload: JSON.parse(raw) });
        } else {
          dispatch({ type: 'LOAD_RECORDS', payload: [] });
        }
      } catch {
        dispatch({ type: 'LOAD_RECORDS', payload: [] });
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      const timer = setTimeout(() => {
        AsyncStorage.setItem(STORAGE_KEYS.dailyRecords, JSON.stringify(state.dailyRecords)).catch(() => {});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.dailyRecords, state.isLoading]);

  return (
    <HabitContext.Provider value={{ state, dispatch }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabitContext() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabitContext must be used within HabitProvider');
  return ctx;
}
