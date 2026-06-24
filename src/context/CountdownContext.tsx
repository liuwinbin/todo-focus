// ============================================================
// CountdownContext — 倒数日 / 纪念日持久化
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import type { CountdownItem, CountdownType } from '../types';

// ---- Helpers ----
let _nextId = Date.now();
function uid(): string {
  return `cd_${(_nextId++).toString(36)}`;
}

// ---- Actions ----
type CountdownAction =
  | { type: 'LOAD'; payload: CountdownItem[] }
  | { type: 'ADD'; payload: Omit<CountdownItem, 'id' | 'createdAt'> }
  | { type: 'UPDATE'; payload: { id: string; data: Partial<CountdownItem> } }
  | { type: 'DELETE'; payload: string };

// ---- Reducer ----
function countdownReducer(state: CountdownItem[], action: CountdownAction): CountdownItem[] {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD':
      return [
        ...state,
        {
          id: uid(),
          createdAt: new Date().toISOString(),
          ...action.payload,
        },
      ];
    case 'UPDATE':
      return state.map((c) =>
        c.id === action.payload.id ? { ...c, ...action.payload.data } : c
      );
    case 'DELETE':
      return state.filter((c) => c.id !== action.payload);
    default:
      return state;
  }
}

// ---- Context ----
interface CountdownContextValue {
  countdowns: CountdownItem[];
  dispatch: React.Dispatch<CountdownAction>;
}

const CountdownContext = createContext<CountdownContextValue | null>(null);

export function CountdownProvider({ children }: { children: ReactNode }) {
  const [countdowns, dispatch] = useReducer(countdownReducer, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.countdowns);
        if (raw) dispatch({ type: 'LOAD', payload: JSON.parse(raw) });
      } catch { /* 使用默认空数组 */ }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.countdowns, JSON.stringify(countdowns)).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [countdowns]);

  return (
    <CountdownContext.Provider value={{ countdowns, dispatch }}>
      {children}
    </CountdownContext.Provider>
  );
}

export function useCountdownContext() {
  const ctx = useContext(CountdownContext);
  if (!ctx) throw new Error('useCountdownContext must be used within CountdownProvider');
  return ctx;
}
