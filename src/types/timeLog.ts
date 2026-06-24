// ============================================================
// 时间日志记录 — 类型定义
// ============================================================

export type TimeLogCategory = 'work' | 'study' | 'exercise' | 'entertainment' | 'rest' | 'other';

export interface TimeLogEntry {
  id: string;
  category: TimeLogCategory;
  title: string;
  note?: string;
  durationMinutes: number;   // 记录时长（分钟）
  startedAt: string;         // ISO 8601
  endedAt?: string;
  createdAt: string;
}

export const TIME_LOG_CATEGORIES: Record<TimeLogCategory, { emoji: string; label: string; color: string }> = {
  work:          { emoji: '💼', label: '工作',     color: '#C3B1E1' },
  study:         { emoji: '📚', label: '学习',     color: '#A4C8E8' },
  exercise:      { emoji: '🏃', label: '运动',     color: '#F4A4A4' },
  entertainment: { emoji: '🎮', label: '娱乐',     color: '#FFDAB9' },
  rest:          { emoji: '😴', label: '休息',     color: '#B2C9AB' },
  other:         { emoji: '📌', label: '其他',     color: '#D0C8D8' },
};

// 预设活动快捷模板
export const QUICK_TIME_TEMPLATES: { category: TimeLogCategory; title: string; durationMinutes: number }[] = [
  { category: 'work',          title: '开会',        durationMinutes: 60 },
  { category: 'work',          title: '写代码',      durationMinutes: 90 },
  { category: 'work',          title: '邮件处理',    durationMinutes: 30 },
  { category: 'study',         title: '阅读',        durationMinutes: 45 },
  { category: 'study',         title: '上课',        durationMinutes: 90 },
  { category: 'study',         title: '复习',        durationMinutes: 60 },
  { category: 'exercise',      title: '跑步',        durationMinutes: 30 },
  { category: 'exercise',      title: '健身',        durationMinutes: 60 },
  { category: 'exercise',      title: '散步',        durationMinutes: 30 },
  { category: 'entertainment', title: '看剧',        durationMinutes: 60 },
  { category: 'entertainment', title: '游戏',        durationMinutes: 60 },
  { category: 'rest',          title: '午休',        durationMinutes: 30 },
  { category: 'rest',          title: '小憩',        durationMinutes: 15 },
  { category: 'other',         title: '通勤',        durationMinutes: 45 },
  { category: 'other',         title: '家务',        durationMinutes: 45 },
];
