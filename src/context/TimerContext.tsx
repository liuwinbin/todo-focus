// ============================================================
// TimerContext — 已完成的专注会话记录
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import { generateId, formatDate } from '../utils/dates';
import type { FocusSession, SessionType } from '../types';

// ---- State ----
interface TimerContextState {
  todaySessions: FocusSession[];
  allSessions: FocusSession[];
  isLoading: boolean;
}

const initialState: TimerContextState = {
  todaySessions: [],
  allSessions: [],
  isLoading: true,
};

// ---- Actions ----
type TimerAction =
  | { type: 'LOAD_SESSIONS'; payload: FocusSession[] }
  | { type: 'ADD_SESSION'; payload: { type: SessionType; plannedDuration: number; actualDuration: number; completed: boolean; taskId?: string } };

// ---- Reducer ----
function timerReducer(state: TimerContextState, action: TimerAction): TimerContextState {
  switch (action.type) {
    case 'LOAD_SESSIONS': {
      const today = formatDate();
      return {
        allSessions: action.payload,
        todaySessions: action.payload.filter((s) => s.startedAt.startsWith(today)),
        isLoading: false,
      };
    }

    case 'ADD_SESSION': {
      const now = new Date().toISOString();
      const session: FocusSession = {
        id: generateId(),
        type: action.payload.type,
        plannedDuration: action.payload.plannedDuration,
        actualDuration: action.payload.actualDuration,
        completed: action.payload.completed,
        startedAt: now,
        completedAt: action.payload.completed ? now : undefined,
        taskId: action.payload.taskId,
      };
      const allSessions = [session, ...state.allSessions];
      const today = formatDate();
      const todaySessions = allSessions.filter((s) => s.startedAt.startsWith(today));
      return { ...state, allSessions, todaySessions };
    }

    default:
      return state;
  }
}

// ---- Context ----
interface TimerContextValue {
  state: TimerContextState;
  dispatch: React.Dispatch<TimerAction>;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.focusSessions);
        if (raw) {
          dispatch({ type: 'LOAD_SESSIONS', payload: JSON.parse(raw) });
        } else {
          dispatch({ type: 'LOAD_SESSIONS', payload: [] });
        }
      } catch {
        dispatch({ type: 'LOAD_SESSIONS', payload: [] });
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      const timer = setTimeout(() => {
        AsyncStorage.setItem(STORAGE_KEYS.focusSessions, JSON.stringify(state.allSessions)).catch(() => {});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.allSessions, state.isLoading]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimerContext must be used within TimerProvider');
  return ctx;
}
