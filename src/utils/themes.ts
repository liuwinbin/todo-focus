// ============================================================
// 主题颜色定义 — 4 套预设主题
// ============================================================
import type { ThemeId } from '../types';

// 复用基础色板以保持语义色一致
const BASE = {
  success: '#B2C9AB',
  successLight: '#D4E2CE',
  warning: '#E8D4A4',
  error: '#E8A4A4',
  info: '#A4C8E8',
  priorityHigh: '#E8A4A4',
  priorityMedium: '#E8D4A4',
  priorityLow: '#B2C9AB',
  heatmapEmpty: '#F0EBF5',
  heatmapL4: '#8B6FB3',
  streakFlame: '#FFB347',
  streakEmpty: '#E0D8E8',
  badgeGold: '#FFD700',
  badgeSilver: '#C0C0C0',
  badgeBronze: '#CD7F32',
  badgeLocked: '#E0D8E8',
  categoryWork: '#C3B1E1',
  categoryWorkBg: '#F3EFF9',
  categoryStudy: '#A4C8E8',
  categoryStudyBg: '#E8F0F7',
  categoryLife: '#B2C9AB',
  categoryLifeBg: '#EAF2E6',
  quadrantUrgentImportant: '#E8A4A4',
  quadrantUrgentNotImportant: '#E8D4A4',
  quadrantNotUrgentImportant: '#C3B1E1',
  quadrantNotUrgentNotImportant: '#B2C9AB',
  activityWork: '#C3B1E1',
  activityStudy: '#A4C8E8',
  activityExercise: '#F4A4A4',
  activityEntertainment: '#FFDAB9',
  activityRest: '#B2C9AB',
  activityOther: '#D0C8D8',
  countdownDefault: '#C3B1E1',
} as const;

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryBg: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  timerFocus: string;
  timerFocusTrack: string;
  timerBreak: string;
  timerBreakTrack: string;
  heatmapL1: string;
  heatmapL2: string;
  heatmapL3: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarBorder: string;
  // 基础语义色（跨主题不变）
  success: string;
  successLight: string;
  warning: string;
  error: string;
  info: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  heatmapEmpty: string;
  heatmapL4: string;
  streakFlame: string;
  streakEmpty: string;
  badgeGold: string;
  badgeSilver: string;
  badgeBronze: string;
  badgeLocked: string;
  categoryWork: string;
  categoryWorkBg: string;
  categoryStudy: string;
  categoryStudyBg: string;
  categoryLife: string;
  categoryLifeBg: string;
  quadrantUrgentImportant: string;
  quadrantUrgentNotImportant: string;
  quadrantNotUrgentImportant: string;
  quadrantNotUrgentNotImportant: string;
  activityWork: string;
  activityStudy: string;
  activityExercise: string;
  activityEntertainment: string;
  activityRest: string;
  activityOther: string;
  countdownDefault: string;
}

// ---- default（治愈紫）— 现有色板 ----
const defaultTheme: ThemeColors = {
  primary: '#C3B1E1',
  primaryLight: '#D9CCEB',
  primaryDark: '#A78FC7',
  primaryBg: '#F3EFF9',
  secondary: '#FFDAB9',
  secondaryLight: '#FFE8D6',
  secondaryDark: '#E8C49A',
  accent: '#F4A4A4',
  accentLight: '#F9CACA',
  accentDark: '#E08888',
  background: '#FFF8F0',
  surface: '#FFFFFF',
  surfaceAlt: '#FFFAF5',
  textPrimary: '#4A4458',
  textSecondary: '#8B8599',
  textTertiary: '#B5B0BF',
  textInverse: '#FFFFFF',
  timerFocus: '#C3B1E1',
  timerFocusTrack: '#EFEBF4',
  timerBreak: '#A4C8E8',
  timerBreakTrack: '#E8F0F7',
  heatmapL1: '#D9CCEB',
  heatmapL2: '#C3B1E1',
  heatmapL3: '#A78FC7',
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#C3B1E1',
  tabBarInactive: '#B5B0BF',
  tabBarBorder: '#F0EBF5',
  ...BASE,
};

// ---- warm（暖阳橙）— 温暖蜜桃/橙色系 ----
const warmTheme: ThemeColors = {
  primary: '#F0B27A',
  primaryLight: '#F5CFA8',
  primaryDark: '#D4955D',
  primaryBg: '#FDF2E7',
  secondary: '#F9C7A1',
  secondaryLight: '#FDE0CC',
  secondaryDark: '#E0A878',
  accent: '#F4A4A4',
  accentLight: '#F9CACA',
  accentDark: '#E08888',
  background: '#FFF9F2',
  surface: '#FFFFFF',
  surfaceAlt: '#FFFBF6',
  textPrimary: '#5C4332',
  textSecondary: '#9B8574',
  textTertiary: '#C4B5A8',
  textInverse: '#FFFFFF',
  timerFocus: '#F0B27A',
  timerFocusTrack: '#FDF2E7',
  timerBreak: '#A4C8E8',
  timerBreakTrack: '#E8F0F7',
  heatmapL1: '#F5CFA8',
  heatmapL2: '#F0B27A',
  heatmapL3: '#D4955D',
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#F0B27A',
  tabBarInactive: '#C4B5A8',
  tabBarBorder: '#F5E6D8',
  ...BASE,
};

// ---- cool（森林绿）— 清新绿色系 ----
const coolTheme: ThemeColors = {
  primary: '#8CB89F',
  primaryLight: '#B2D2BF',
  primaryDark: '#6A9A7F',
  primaryBg: '#EEF5F1',
  secondary: '#A4C8E8',
  secondaryLight: '#C8DCF2',
  secondaryDark: '#7AA8CC',
  accent: '#E8A4A4',
  accentLight: '#F0CACA',
  accentDark: '#D08888',
  background: '#F6FAF7',
  surface: '#FFFFFF',
  surfaceAlt: '#F9FCFA',
  textPrimary: '#3A4F42',
  textSecondary: '#7A9080',
  textTertiary: '#A8BFAD',
  textInverse: '#FFFFFF',
  timerFocus: '#8CB89F',
  timerFocusTrack: '#EEF5F1',
  timerBreak: '#A4C8E8',
  timerBreakTrack: '#E8F0F7',
  heatmapL1: '#B2D2BF',
  heatmapL2: '#8CB89F',
  heatmapL3: '#6A9A7F',
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#8CB89F',
  tabBarInactive: '#A8BFAD',
  tabBarBorder: '#DCE8E0',
  ...BASE,
};

// ---- dark（深空蓝）— 深色模式 ----
const darkTheme: ThemeColors = {
  primary: '#7B9EC7',
  primaryLight: '#A0BCDD',
  primaryDark: '#5A7EA8',
  primaryBg: '#1E2A38',
  secondary: '#8BA4C0',
  secondaryLight: '#A8BDD4',
  secondaryDark: '#6A85A0',
  accent: '#C78B8B',
  accentLight: '#D8AEAE',
  accentDark: '#A87070',
  background: '#151D28',
  surface: '#1E2A38',
  surfaceAlt: '#243244',
  textPrimary: '#E0E6EE',
  textSecondary: '#9BA8B8',
  textTertiary: '#6A7888',
  textInverse: '#151D28',
  timerFocus: '#7B9EC7',
  timerFocusTrack: '#1E2A38',
  timerBreak: '#6A9AB5',
  timerBreakTrack: '#1E2A38',
  heatmapL1: '#2A3A50',
  heatmapL2: '#4A6080',
  heatmapL3: '#7B9EC7',
  tabBarBackground: '#1E2A38',
  tabBarActive: '#A0BCDD',
  tabBarInactive: '#6A7888',
  tabBarBorder: '#2A3A50',
  ...BASE,
};

// ---- 主题映射 ----
export const THEME_COLORS: Record<ThemeId, ThemeColors> = {
  default: defaultTheme,
  warm: warmTheme,
  cool: coolTheme,
  dark: darkTheme,
};

/** 根据主题 ID 获取完整色板 */
export function getThemeColors(themeId: ThemeId): ThemeColors {
  return THEME_COLORS[themeId] ?? defaultTheme;
}
