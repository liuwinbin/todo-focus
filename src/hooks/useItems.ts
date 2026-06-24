// ============================================================
// useItems — 统一实体操作 Hook（合并 useTasks + useSchedule）
// ============================================================
import { useCallback } from 'react';
import { useItemContext } from '../context/ItemContext';
import { useHabitContext } from '../context/HabitContext';
import { useAchievementContext } from '../context/AchievementContext';
import { scheduleTaskDueReminder } from '../utils/notifications';
import type { Item, Priority, ItemCategory, EventColor } from '../types';

export function useItems() {
  const { state, dispatch } = useItemContext();
  const { dispatch: habitDispatch } = useHabitContext();
  const { dispatch: achievementDispatch } = useAchievementContext();

  // ---- 创建 ----
  const addItem = useCallback(
    (data: {
      title: string;
      description?: string;
      priority?: Priority;
      category?: ItemCategory;
      estimatedPomodoros?: number;
      subtasks?: string[];
      memo?: string;
      imageUri?: string;
      date?: string;
      tags?: string[];
      startTime?: string;
      endTime?: string;
      allDay?: boolean;
      color?: EventColor;
      notes?: string;
    }) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          title: data.title,
          description: data.description,
          priority: data.priority ?? 'medium',
          category: data.category,
          estimatedPomodoros: data.estimatedPomodoros ?? 0,
          subtasks: data.subtasks ?? [],
          memo: data.memo,
          imageUri: data.imageUri,
          date: data.date,
          tags: data.tags,
          startTime: data.startTime,
          endTime: data.endTime,
          allDay: data.allDay,
          color: data.color,
          notes: data.notes,
        },
      });
      // 有日期时调度通知
      if (data.date) {
        scheduleTaskDueReminder('', data.title, data.date).catch(() => {});
      }
    },
    [dispatch],
  );

  // ---- 更新 ----
  const updateItem = useCallback(
    (id: string, updates: Partial<Item>) => {
      dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } });
      if (updates.date) {
        const existing = state.items.find((it) => it.id === id);
        if (updates.date !== existing?.date) {
          scheduleTaskDueReminder(id, existing?.title ?? '', updates.date).catch(() => {});
        }
      }
    },
    [dispatch, state.items],
  );

  // ---- 删除 ----
  const deleteItem = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_ITEM', payload: id });
    },
    [dispatch],
  );

  // ---- 切换完成 ----
  const toggleComplete = useCallback(
    (id: string) => {
      dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
      const item = state.items.find((it) => it.id === id);
      if (item && !item.completed) {
        habitDispatch({ type: 'RECORD_TASK_COMPLETION' });

        const completedCount = state.items.filter((it) => it.completed).length + 1;
        for (const key of ['first_task', 'tasks_10', 'tasks_50', 'tasks_100'] as const) {
          achievementDispatch({ type: 'UPDATE_PROGRESS', payload: { key, progress: completedCount } });
        }
      }
    },
    [dispatch, habitDispatch, achievementDispatch, state.items],
  );

  // ---- 子任务 ----
  const addSubtask = useCallback(
    (itemId: string, title: string) => {
      dispatch({ type: 'ADD_SUBTASK', payload: { itemId, title } });
    },
    [dispatch],
  );

  const toggleSubtask = useCallback(
    (itemId: string, subtaskId: string) => {
      dispatch({ type: 'TOGGLE_SUBTASK', payload: { itemId, subtaskId } });
    },
    [dispatch],
  );

  const deleteSubtask = useCallback(
    (itemId: string, subtaskId: string) => {
      dispatch({ type: 'DELETE_SUBTASK', payload: { itemId, subtaskId } });
    },
    [dispatch],
  );

  // ---- 查询（原 useSchedule 方法）----
  const getItemsForDate = useCallback(
    (dateStr: string): Item[] => {
      return state.items
        .filter((it) => it.date === dateStr)
        .sort((a, b) => {
          if (a.allDay && !b.allDay) return -1;
          if (!a.allDay && b.allDay) return 1;
          return (a.startTime ?? '').localeCompare(b.startTime ?? '');
        });
    },
    [state.items],
  );

  const getItemsForMonth = useCallback(
    (year: number, month: number): Item[] => {
      const prefix = `${year}-${String(month).padStart(2, '0')}`;
      return state.items.filter((it) => it.date?.startsWith(prefix));
    },
    [state.items],
  );

  const getEventDotsByDate = useCallback((): Map<string, Array<{ color: string; key: string }>> => {
    const map = new Map<string, Array<{ color: string; key: string }>>();
    for (const it of state.items) {
      if (!it.date) continue;
      const dots = map.get(it.date) ?? [];
      if (dots.length < 3) {
        dots.push({ color: it.color ?? '#A4C8E8', key: it.id });
        map.set(it.date, dots);
      }
    }
    return map;
  }, [state.items]);

  return {
    items: state.items,
    isLoading: state.isLoading,
    addItem,
    updateItem,
    deleteItem,
    toggleComplete,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    getItemsForDate,
    getItemsForMonth,
    getEventDotsByDate,
  };
}
