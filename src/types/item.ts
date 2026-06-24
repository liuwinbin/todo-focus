// ============================================================
// Item — 统一实体类型（合并 Task + ScheduleEvent）
// ============================================================

// ---- 枚举 & 常量 ----

export type Priority = 'high' | 'medium' | 'low';

export type ItemCategory = 'work' | 'study' | 'life';

export const ITEM_CATEGORIES: Record<ItemCategory, { label: string; emoji: string; color: string }> = {
  work:  { label: '工作', emoji: '💼', color: '#C3B1E1' },
  study: { label: '学习', emoji: '📚', color: '#A4C8E8' },
  life:  { label: '生活', emoji: '🏠', color: '#B2C9AB' },
};

export type ItemView = 'list' | 'day' | 'week' | 'quadrant';

export type EventColor = 'lavender' | 'peach' | 'coral' | 'mint' | 'sky' | 'amber';

export const EVENT_COLORS: Record<EventColor, string> = {
  lavender: '#C3B1E1',
  peach:    '#FFDAB9',
  coral:    '#F4A4A4',
  mint:     '#B2C9AB',
  sky:      '#A4C8E8',
  amber:    '#E8D4A4',
};

export const EVENT_COLOR_LABELS: Record<EventColor, string> = {
  lavender: '薰衣草',
  peach:    '蜜桃',
  coral:    '珊瑚',
  mint:     '薄荷',
  sky:      '天空',
  amber:    '琥珀',
};

// ---- 核心类型 ----

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

/** 统一实体：合并 Task 所有字段 + ScheduleEvent 所有字段 */
export interface Item {
  // ---- 核心字段 ----
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  order: number;

  // ---- Task 字段 ----
  description?: string;
  priority: Priority;
  category?: ItemCategory;
  estimatedPomodoros: number;
  completedPomodoros: number;
  subtasks: Subtask[];
  completed: boolean;
  completedAt?: string;
  memo?: string;
  imageUri?: string;
  tags: string[];

  // ---- 过渡兼容字段（Phase 4 清理）----
  /** @deprecated 使用 date 代替 */
  dueDate?: string;
  /** @deprecated 统一模型中不再需要跨引用 */
  taskId?: string;

  // ---- Schedule 字段（全可选 — 有 date 才出现在日历上）----
  date?: string;           // YYYY-MM-DD（原 Task.dueDate 合并于此）
  startTime?: string;      // HH:mm
  endTime?: string;        // HH:mm
  allDay: boolean;
  color?: EventColor;
  notes?: string;          // 日程备注（区别于 memo 个人备忘）
}

// ---- 任务模板（保留）----

export interface TaskTemplateItem {
  title: string;
  priority: Priority;
  category: ItemCategory;
  estimatedPomodoros: number;
}

export interface TaskTemplate {
  id: string;
  name: string;
  tasks: TaskTemplateItem[];
  createdAt: string;
}

// ---- 向后兼容别名 ----
// 旧代码仍可 import { Task, ScheduleEvent, TaskCategory, TaskView } from '../types'
export type Task = Item;
export type ScheduleEvent = Item;
export type TaskCategory = ItemCategory;
export type TaskView = ItemView;
export const TASK_CATEGORIES = ITEM_CATEGORIES;
