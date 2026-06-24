// ============================================================
// AsyncStorage 键名常量和序列化工具
// ============================================================

export const STORAGE_KEYS = {
  // ---- v2 unified ----
  items: '@pomodoro/items',

  // ---- kept (other contexts) ----
  taskTemplates: '@pomodoro/task-templates',
  dailyRecords: '@pomodoro/daily-records',
  focusSessions: '@pomodoro/focus-sessions',
  settings: '@pomodoro/settings',
  habitGoals: '@pomodoro/habit-goals',
  habitCheckIns: '@pomodoro/habit-checkins',
  achievements: '@pomodoro/achievements',
  timeLogEntries: '@pomodoro/time-log-entries',
  countdowns: '@pomodoro/countdowns',
  notes: '@pomodoro/notes',
  appUsage: '@pomodoro/app-usage',

  // ---- v1 legacy (kept for migration, not deleted) ----
  tasks: '@pomodoro/tasks',
  scheduleEvents: '@pomodoro/schedule-events',

  // ---- meta ----
  schemaVersion: '@pomodoro/schema-version',
} as const;

export const SCHEMA_VERSION = 2;
