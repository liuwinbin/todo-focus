// ============================================================
// 数据迁移：Task[] + ScheduleEvent[] → Item[]
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storage';
import { generateId } from './dates';
import type { Item } from '../types';

/** 执行 v1 → v2 迁移，返回合并后的 Item[] */
export async function migrateToUnifiedItems(): Promise<Item[]> {
  const items: Item[] = [];
  const seenIds = new Set<string>();

  // 1) 读取旧 Tasks
  try {
    const raw = await AsyncStorage.getItem('@pomodoro/tasks');
    const tasks: Array<Record<string, unknown>> = raw ? JSON.parse(raw) : [];

    for (const t of tasks) {
      if (!t.id || typeof t.id !== 'string') continue;
      const item: Item = {
        id: t.id as string,
        title: (t.title as string) ?? '',
        createdAt: (t.createdAt as string) ?? new Date().toISOString(),
        updatedAt: undefined,
        order: (t.order as number) ?? 0,
        description: (t.description as string | undefined),
        priority: (t.priority as Item['priority']) ?? 'medium',
        category: t.category as Item['category'],
        estimatedPomodoros: (t.estimatedPomodoros as number) ?? 0,
        completedPomodoros: (t.completedPomodoros as number) ?? 0,
        subtasks: (t.subtasks as Item['subtasks']) ?? [],
        completed: (t.completed as boolean) ?? false,
        completedAt: (t.completedAt as string | undefined),
        memo: (t.memo as string | undefined),
        imageUri: (t.imageUri as string | undefined),
        tags: (t.tags as string[]) ?? [],
        date: (t.dueDate as string | undefined),        // dueDate → date
        startTime: undefined,
        endTime: undefined,
        allDay: false,
        color: undefined,
        notes: undefined,
      };
      items.push(item);
      seenIds.add(item.id);
    }
  } catch {
    // 旧 tasks 不存在或解析失败，跳过
  }

  // 2) 读取旧 ScheduleEvents
  try {
    const raw = await AsyncStorage.getItem('@pomodoro/schedule-events');
    const events: Array<Record<string, unknown>> = raw ? JSON.parse(raw) : [];

    for (const e of events) {
      if (!e.id || typeof e.id !== 'string') continue;

      // 如果 event 的 taskId 对应某个已转换的 task → 跳过（task 已覆盖）
      const taskId = e.taskId as string | undefined;
      if (taskId && seenIds.has(taskId)) continue;

      // 如果 event 的 id 已经存在于 items 中 → 跳过重复
      if (seenIds.has(e.id as string)) continue;

      const item: Item = {
        id: e.id as string,
        title: (e.title as string) ?? '',
        createdAt: (e.createdAt as string) ?? new Date().toISOString(),
        updatedAt: undefined,
        order: 0,
        priority: 'medium',
        category: undefined,
        estimatedPomodoros: 0,
        completedPomodoros: 0,
        subtasks: [],
        completed: false,
        tags: [],
        date: (e.date as string | undefined),
        startTime: (e.startTime as string | undefined),
        endTime: (e.endTime as string | undefined),
        allDay: (e.allDay as boolean) ?? false,
        color: e.color as Item['color'],
        notes: (e.notes as string | undefined),
      };
      // 如果 event 关联了 task 但 task 不在旧数据中，保留 taskId 作为引用
      if (taskId) {
        item.taskId = taskId;
      }
      items.push(item);
      seenIds.add(item.id);
    }
  } catch {
    // 旧 events 不存在或解析失败，跳过
  }

  return items;
}
