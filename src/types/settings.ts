// ============================================================
// Settings & Theme 类型定义
// ============================================================

export type ThemeId = 'default' | 'warm' | 'cool' | 'dark';

export const THEME_OPTIONS: { id: ThemeId; label: string; emoji: string }[] = [
  { id: 'default', label: '治愈紫', emoji: '💜' },
  { id: 'warm',    label: '暖阳橙', emoji: '🧡' },
  { id: 'cool',    label: '森林绿', emoji: '💚' },
  { id: 'dark',    label: '深空蓝', emoji: '🌙' },
];

export interface AppSettings {
  focusDuration: number;           // 分钟（默认 25）
  shortBreakDuration: number;      // 分钟（默认 5）
  longBreakDuration: number;       // 分钟（默认 15）
  longBreakInterval: number;       // 几次后长休息（默认 4）
  dailyFocusGoal: number;          // 每日目标（默认 4）
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  themeId: ThemeId;                // 主题 ID（默认 'default'）
  reminderEnabled: boolean;        // 提醒开关（默认 false）
  reminderTime: string;            // 提醒时间 HH:mm（默认 '09:00'）
}
