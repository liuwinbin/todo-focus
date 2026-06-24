// ============================================================
// ItemContext — 统一实体状态管理（合并 Task + Schedule）
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, SCHEMA_VERSION } from '../utils/storage';
import { generateId } from '../utils/dates';
import { migrateToUnifiedItems } from '../utils/migration';
import type { Item, Priority, ItemCategory, EventColor } from '../types';

// ---- State ----
interface ItemState {
  items: Item[];
  isLoading: boolean;
}

const initialState: ItemState = { items: [], isLoading: true };

// ---- Actions ----
type ItemAction =
  | { type: 'LOAD_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEM'; payload: AddItemPayload }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<Item> } }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string }
  | { type: 'ADD_SUBTASK'; payload: { itemId: string; title: string } }
  | { type: 'TOGGLE_SUBTASK'; payload: { itemId: string; subtaskId: string } }
  | { type: 'DELETE_SUBTASK'; payload: { itemId: string; subtaskId: string } }
  | { type: 'INCREMENT_POMODORO'; payload: string };

interface AddItemPayload {
  title: string;
  description?: string;
  priority: Priority;
  category?: ItemCategory;
  estimatedPomodoros: number;
  subtasks: string[];
  memo?: string;
  imageUri?: string;
  date?: string;
  tags?: string[];
  // Schedule fields
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  color?: EventColor;
  notes?: string;
}

// ---- Reducer ----
function itemReducer(state: ItemState, action: ItemAction): ItemState {
  switch (action.type) {
    case 'LOAD_ITEMS':
      return { items: action.payload, isLoading: false };

    case 'ADD_ITEM': {
      const now = new Date().toISOString();
      const p = action.payload;
      const newItem: Item = {
        id: generateId(),
        title: p.title,
        createdAt: now,
        order: state.items.length,
        description: p.description,
        priority: p.priority,
        category: p.category,
        estimatedPomodoros: p.estimatedPomodoros,
        completedPomodoros: 0,
        subtasks: p.subtasks.map((title) => ({ id: generateId(), title, completed: false })),
        completed: false,
        memo: p.memo,
        imageUri: p.imageUri,
        date: p.date,
        tags: p.tags ?? [],
        startTime: p.startTime,
        endTime: p.endTime,
        allDay: p.allDay ?? false,
        color: p.color,
        notes: p.notes,
      };
      return { ...state, items: [newItem, ...state.items] };
    }

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.id ? { ...it, ...action.payload.updates, updatedAt: new Date().toISOString() } : it,
        ),
      };

    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter((it) => it.id !== action.payload) };

    case 'TOGGLE_COMPLETE': {
      const now = new Date().toISOString();
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload
            ? { ...it, completed: !it.completed, completedAt: it.completed ? undefined : now, updatedAt: now }
            : it,
        ),
      };
    }

    case 'ADD_SUBTASK':
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.itemId
            ? { ...it, subtasks: [...it.subtasks, { id: generateId(), title: action.payload.title, completed: false }], updatedAt: new Date().toISOString() }
            : it,
        ),
      };

    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.itemId
            ? { ...it, subtasks: it.subtasks.map((s) => (s.id === action.payload.subtaskId ? { ...s, completed: !s.completed } : s)), updatedAt: new Date().toISOString() }
            : it,
        ),
      };

    case 'DELETE_SUBTASK':
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload.itemId
            ? { ...it, subtasks: it.subtasks.filter((s) => s.id !== action.payload.subtaskId), updatedAt: new Date().toISOString() }
            : it,
        ),
      };

    case 'INCREMENT_POMODORO':
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.payload ? { ...it, completedPomodoros: it.completedPomodoros + 1 } : it,
        ),
      };

    default:
      return state;
  }
}

// ---- Context ----
interface ItemContextValue {
  state: ItemState;
  dispatch: React.Dispatch<ItemAction>;
}

const ItemContext = createContext<ItemContextValue | null>(null);

export function ItemProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(itemReducer, initialState);

  // 加载数据（含迁移）
  useEffect(() => {
    (async () => {
      try {
        // 检查是否需要迁移
        const version = await AsyncStorage.getItem(STORAGE_KEYS.schemaVersion);
        if (version !== String(SCHEMA_VERSION)) {
          const migrated = await migrateToUnifiedItems();
          dispatch({ type: 'LOAD_ITEMS', payload: migrated });
          await AsyncStorage.setItem(STORAGE_KEYS.schemaVersion, String(SCHEMA_VERSION));
        } else {
          const raw = await AsyncStorage.getItem(STORAGE_KEYS.items);
          dispatch({ type: 'LOAD_ITEMS', payload: raw ? JSON.parse(raw) : [] });
        }
      } catch {
        dispatch({ type: 'LOAD_ITEMS', payload: [] });
      }
    })();
  }, []);

  // 持久化（跳过初始加载）
  useEffect(() => {
    if (!state.isLoading) {
      const timer = setTimeout(() => {
        AsyncStorage.setItem(STORAGE_KEYS.items, JSON.stringify(state.items)).catch(() => {});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.items, state.isLoading]);

  return (
    <ItemContext.Provider value={{ state, dispatch }}>
      {children}
    </ItemContext.Provider>
  );
}

export function useItemContext() {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error('useItemContext must be used within ItemProvider');
  return ctx;
}
