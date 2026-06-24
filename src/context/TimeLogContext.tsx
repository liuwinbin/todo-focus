// ============================================================
// TimeLogContext — 时间日志记录持久化
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/dates';
import type { TimeLogEntry, TimeLogCategory } from '../types';

// ---- State ----
interface TimeLogState {
  entries: TimeLogEntry[];
  isLoading: boolean;
}

const initialState: TimeLogState = {
  entries: [],
  isLoading: true,
};

// ---- Actions ----
type TimeLogAction =
  | { type: 'LOAD'; payload: TimeLogEntry[] }
  | { type: 'ADD_ENTRY'; payload: Omit<TimeLogEntry, 'id' | 'createdAt'> }
  | { type: 'UPDATE_ENTRY'; payload: { id: string; updates: Partial<TimeLogEntry> } }
  | { type: 'DELETE_ENTRY'; payload: string };

// ---- Reducer ----
function timeLogReducer(state: TimeLogState, action: TimeLogAction): TimeLogState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, entries: action.payload, isLoading: false };

    case 'ADD_ENTRY': {
      const entry: TimeLogEntry = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      return { ...state, entries: [entry, ...state.entries] };
    }

    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.updates } : e,
        ),
      };

    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload),
      };

    default:
      return state;
  }
}

// ---- Context ----
interface TimeLogContextValue {
  state: TimeLogState;
  dispatch: React.Dispatch<TimeLogAction>;
}

const TimeLogContext = createContext<TimeLogContextValue | null>(null);

export function TimeLogProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timeLogReducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.timeLogEntries);
        dispatch({ type: 'LOAD', payload: raw ? JSON.parse(raw) : [] });
      } catch {
        dispatch({ type: 'LOAD', payload: [] });
      }
    })();
  }, []);

  useEffect(() => {
    if (state.isLoading) return;
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.timeLogEntries, JSON.stringify(state.entries)).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [state.entries, state.isLoading]);

  return (
    <TimeLogContext.Provider value={{ state, dispatch }}>
      {children}
    </TimeLogContext.Provider>
  );
}

export function useTimeLogContext() {
  const ctx = useContext(TimeLogContext);
  if (!ctx) throw new Error('useTimeLogContext must be used within TimeLogProvider');
  return ctx;
}
