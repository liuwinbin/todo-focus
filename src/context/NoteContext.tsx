// ============================================================
// NoteContext — 灵感笔记持久化
// ============================================================
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage';
import type { Note } from '../types';

// ---- Helpers ----
let _nextId = Date.now();
function uid(): string {
  return `note_${(_nextId++).toString(36)}`;
}

// ---- Actions ----
type NoteAction =
  | { type: 'LOAD'; payload: Note[] }
  | { type: 'ADD'; payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE'; payload: { id: string; data: Partial<Pick<Note, 'title' | 'content' | 'tags'>> } }
  | { type: 'DELETE'; payload: string };

// ---- Reducer ----
function noteReducer(state: Note[], action: NoteAction): Note[] {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD': {
      const now = new Date().toISOString();
      return [
        { id: uid(), createdAt: now, updatedAt: now, ...action.payload },
        ...state,
      ];
    }
    case 'UPDATE':
      return state.map((n) =>
        n.id === action.payload.id
          ? { ...n, ...action.payload.data, updatedAt: new Date().toISOString() }
          : n
      );
    case 'DELETE':
      return state.filter((n) => n.id !== action.payload);
    default:
      return state;
  }
}

// ---- Context ----
interface NoteContextValue {
  notes: Note[];
  dispatch: React.Dispatch<NoteAction>;
}

const NoteContext = createContext<NoteContextValue | null>(null);

export function NoteProvider({ children }: { children: ReactNode }) {
  const [notes, dispatch] = useReducer(noteReducer, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.notes);
        if (raw) dispatch({ type: 'LOAD', payload: JSON.parse(raw) });
      } catch { /* 使用默认空数组 */ }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes)).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [notes]);

  return (
    <NoteContext.Provider value={{ notes, dispatch }}>
      {children}
    </NoteContext.Provider>
  );
}

export function useNoteContext() {
  const ctx = useContext(NoteContext);
  if (!ctx) throw new Error('useNoteContext must be used within NoteProvider');
  return ctx;
}
