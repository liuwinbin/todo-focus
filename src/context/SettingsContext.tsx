// ============================================================
// SettingsContext — 用户偏好设置
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import type { AppSettings } from '../types';

// ---- 默认设置 ----
export const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  dailyFocusGoal: 4,
  soundEnabled: true,
  vibrationEnabled: true,
  themeId: 'default',
  reminderEnabled: false,
  reminderTime: '09:00',
};

// ---- Actions ----
type SettingsAction =
  | { type: 'LOAD_SETTINGS'; payload: AppSettings }
  | { type: 'UPDATE_SETTING'; payload: Partial<AppSettings> }
  | { type: 'RESET_ALL' };

// ---- Reducer ----
function settingsReducer(state: AppSettings, action: SettingsAction): AppSettings {
  switch (action.type) {
    case 'LOAD_SETTINGS':
      return { ...DEFAULT_SETTINGS, ...action.payload };
    case 'UPDATE_SETTING':
      return { ...state, ...action.payload };
    case 'RESET_ALL':
      return DEFAULT_SETTINGS;
    default:
      return state;
  }
}

// ---- Context ----
interface SettingsContextValue {
  settings: AppSettings;
  dispatch: React.Dispatch<SettingsAction>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, DEFAULT_SETTINGS);

  // 启动时加载持久化数据
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
        if (raw) {
          dispatch({ type: 'LOAD_SETTINGS', payload: JSON.parse(raw) });
        }
      } catch { /* 使用默认值 */ }
    })();
  }, []);

  // 每次变化自动持久化（500ms 防抖）
  useEffect(() => {
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings)).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettingsContext must be used within SettingsProvider');
  return ctx;
}
