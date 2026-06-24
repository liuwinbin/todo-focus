// ============================================================
// HabitGoalContext — 习惯打卡目标 + 打卡记录持久化
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import { generateId, formatDate } from '../utils/dates';
import type { HabitGoal, HabitCheckIn } from '../types';

// ---- State ----
interface HabitGoalState {
  goals: HabitGoal[];
  checkIns: HabitCheckIn[];
  isLoading: boolean;
}

const initialState: HabitGoalState = {
  goals: [],
  checkIns: [],
  isLoading: true,
};

// ---- Actions ----
type HabitGoalAction =
  | { type: 'LOAD'; payload: { goals: HabitGoal[]; checkIns: HabitCheckIn[] } }
  | { type: 'ADD_GOAL'; payload: Omit<HabitGoal, 'id' | 'createdAt'> }
  | { type: 'UPDATE_GOAL'; payload: { id: string; updates: Partial<HabitGoal> } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ARCHIVE_GOAL'; payload: string }
  | { type: 'CHECK_IN'; payload: { goalId: string; note?: string } }
  | { type: 'MAKEUP_CHECK_IN'; payload: { goalId: string; date: string; note?: string } }
  | { type: 'REMOVE_CHECK_IN'; payload: string };

// ---- Reducer ----
function habitGoalReducer(state: HabitGoalState, action: HabitGoalAction): HabitGoalState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, goals: action.payload.goals, checkIns: action.payload.checkIns, isLoading: false };

    case 'ADD_GOAL': {
      const goal: HabitGoal = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      return { ...state, goals: [...state.goals, goal] };
    }

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.updates } : g,
        ),
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
        checkIns: state.checkIns.filter((c) => c.goalId !== action.payload),
      };

    case 'ARCHIVE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload ? { ...g, isArchived: !g.isArchived } : g,
        ),
      };

    case 'CHECK_IN': {
      const today = formatDate();
      const existing = state.checkIns.find(
        (c) => c.goalId === action.payload.goalId && c.date === today,
      );
      if (existing) {
        return {
          ...state,
          checkIns: state.checkIns.map((c) =>
            c.id === existing.id ? { ...c, count: c.count + 1 } : c,
          ),
        };
      }
      const checkIn: HabitCheckIn = {
        id: generateId(),
        goalId: action.payload.goalId,
        date: today,
        count: 1,
        isMakeup: false,
        note: action.payload.note,
        createdAt: new Date().toISOString(),
      };
      return { ...state, checkIns: [...state.checkIns, checkIn] };
    }

    case 'MAKEUP_CHECK_IN': {
      const existing = state.checkIns.find(
        (c) => c.goalId === action.payload.goalId && c.date === action.payload.date,
      );
      if (existing) {
        return {
          ...state,
          checkIns: state.checkIns.map((c) =>
            c.id === existing.id ? { ...c, count: c.count + 1, isMakeup: true } : c,
          ),
        };
      }
      const checkIn: HabitCheckIn = {
        id: generateId(),
        goalId: action.payload.goalId,
        date: action.payload.date,
        count: 1,
        isMakeup: true,
        note: action.payload.note,
        createdAt: new Date().toISOString(),
      };
      return { ...state, checkIns: [...state.checkIns, checkIn] };
    }

    case 'REMOVE_CHECK_IN': {
      const target = state.checkIns.find((c) => c.id === action.payload);
      if (!target) return state;
      if (target.count > 1) {
        return {
          ...state,
          checkIns: state.checkIns.map((c) =>
            c.id === action.payload ? { ...c, count: c.count - 1 } : c,
          ),
        };
      }
      return {
        ...state,
        checkIns: state.checkIns.filter((c) => c.id !== action.payload),
      };
    }

    default:
      return state;
  }
}

// ---- Context ----
interface HabitGoalContextValue {
  state: HabitGoalState;
  dispatch: React.Dispatch<HabitGoalAction>;
}

const HabitGoalContext = createContext<HabitGoalContextValue | null>(null);

export function HabitGoalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(habitGoalReducer, initialState);

  // 加载
  useEffect(() => {
    (async () => {
      try {
        const [goalsRaw, checkInsRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.habitGoals),
          AsyncStorage.getItem(STORAGE_KEYS.habitCheckIns),
        ]);
        dispatch({
          type: 'LOAD',
          payload: {
            goals: goalsRaw ? JSON.parse(goalsRaw) : [],
            checkIns: checkInsRaw ? JSON.parse(checkInsRaw) : [],
          },
        });
      } catch {
        dispatch({ type: 'LOAD', payload: { goals: [], checkIns: [] } });
      }
    })();
  }, []);

  // 持久化（500ms 防抖）
  useEffect(() => {
    if (state.isLoading) return;
    const timer = setTimeout(() => {
      Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.habitGoals, JSON.stringify(state.goals)),
        AsyncStorage.setItem(STORAGE_KEYS.habitCheckIns, JSON.stringify(state.checkIns)),
      ]).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [state.goals, state.checkIns, state.isLoading]);

  return (
    <HabitGoalContext.Provider value={{ state, dispatch }}>
      {children}
    </HabitGoalContext.Provider>
  );
}

export function useHabitGoalContext() {
  const ctx = useContext(HabitGoalContext);
  if (!ctx) throw new Error('useHabitGoalContext must be used within HabitGoalProvider');
  return ctx;
}
