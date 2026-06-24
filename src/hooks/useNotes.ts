// ============================================================
// useNotes — 灵感笔记操作 Hook
// ============================================================
import { useCallback, useMemo } from 'react';
import { useNoteContext } from '../context/NoteContext';
import type { Note } from '../types';

export function useNotes() {
  const { notes, dispatch } = useNoteContext();

  const addNote = useCallback(
    (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch({ type: 'ADD', payload: data });
    },
    [dispatch],
  );

  const updateNote = useCallback(
    (id: string, data: Partial<Pick<Note, 'title' | 'content' | 'tags'>>) => {
      dispatch({ type: 'UPDATE', payload: { id, data } });
    },
    [dispatch],
  );

  const deleteNote = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE', payload: id });
    },
    [dispatch],
  );

  /** 按更新时间倒序排列 */
  const sortedNotes = useMemo(() => {
    return [...notes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [notes]);

  /** 提取所有标签（去重） */
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [notes]);

  return {
    notes,
    sortedNotes,
    allTags,
    addNote,
    updateNote,
    deleteNote,
  };
}
