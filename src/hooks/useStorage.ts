// ============================================================
// AsyncStorage 读写 Hook
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

export function useStorage() {
  const loadJSON = useCallback(async <T>(key: string, fallback: T): Promise<T> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }, []);

  const saveJSON = useCallback(async <T>(key: string, data: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch {
      // 静默失败 — 本地存储偶尔不可用不影响使用
    }
  }, []);

  const removeKey = useCallback(async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // 静默失败
    }
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch {
      // 静默失败
    }
  }, []);

  return { loadJSON, saveJSON, removeKey, clearAll };
}

import { STORAGE_KEYS } from '../utils/storage';
