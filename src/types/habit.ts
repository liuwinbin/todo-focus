export interface DailyRecord {
  date: string;                     // YYYY-MM-DD
  focusSessionsCompleted: number;
  tasksCompleted: number;
  totalFocusMinutes: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalFocusDays: number;
  dailyGoal: number;
}

export interface CalendarDay {
  date: string;
  sessionsCompleted: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// ---- 习惯打卡目标 ----
export type HabitGoalType = 'daily' | 'weekly' | 'custom';
export type HabitGoalCategory = 'health' | 'learning' | 'work' | 'life';

export interface HabitGoal {
  id: string;
  title: string;
  description?: string;
  type: HabitGoalType;
  targetCount: number;       // 每周期目标次数
  periodDays: number;        // custom: 每 N 天重复一次
  category: HabitGoalCategory;
  motivationalMessage?: string;
  color?: string;
  icon: string;              // Ionicons name
  createdAt: string;
  isArchived: boolean;
}

export const HABIT_GOAL_CATEGORIES: Record<HabitGoalCategory, { emoji: string; label: string; color: string }> = {
  health:    { emoji: '💪', label: '健康',   color: '#F4A4A4' },
  learning:  { emoji: '📚', label: '学习',   color: '#A4C8E8' },
  work:      { emoji: '💼', label: '工作',   color: '#C3B1E1' },
  life:      { emoji: '🏠', label: '生活',   color: '#B2C9AB' },
};

// ---- 打卡记录 ----
export interface HabitCheckIn {
  id: string;
  goalId: string;
  date: string;              // YYYY-MM-DD
  count: number;
  isMakeup: boolean;
  note?: string;
  createdAt: string;
}

// ---- 成就徽章 ----
export type AchievementCategory = 'milestone' | 'streak' | 'special';

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  unlockedAt?: string;
  progress: number;          // 0-100
  target: number;
  isUnlocked: boolean;
}

export const ACHIEVEMENT_CATEGORY_CONFIG: Record<AchievementCategory, { emoji: string; label: string }> = {
  milestone: { emoji: '🏆', label: '里程碑' },
  streak:    { emoji: '🔥', label: '连续打卡' },
  special:   { emoji: '⭐', label: '特殊成就' },
};
