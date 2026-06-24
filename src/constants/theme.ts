// ============================================================
// 专注番茄钟 — 设计 Tokens（温暖治愈风）
// ============================================================

export const colors = {
  // 主色调 — 柔和薰衣草紫
  primary: '#C3B1E1',
  primaryLight: '#D9CCEB',
  primaryDark: '#A78FC7',
  primaryBg: '#F3EFF9',

  // 辅助色 — 温暖蜜桃
  secondary: '#FFDAB9',
  secondaryLight: '#FFE8D6',
  secondaryDark: '#E8C49A',

  // 强调色 — 柔和珊瑚
  accent: '#F4A4A4',
  accentLight: '#F9CACA',
  accentDark: '#E08888',

  // 语义色
  success: '#B2C9AB',
  successLight: '#D4E2CE',
  warning: '#E8D4A4',
  error: '#E8A4A4',
  info: '#A4C8E8',

  // 优先级色
  priorityHigh: '#E8A4A4',
  priorityMedium: '#E8D4A4',
  priorityLow: '#B2C9AB',

  // 背景
  background: '#FFF8F0',
  surface: '#FFFFFF',
  surfaceAlt: '#FFFAF5',

  // 文字
  textPrimary: '#4A4458',
  textSecondary: '#8B8599',
  textTertiary: '#B5B0BF',
  textInverse: '#FFFFFF',

  // 计时器进度环
  timerFocus: '#C3B1E1',
  timerFocusTrack: '#EFEBF4',
  timerBreak: '#A4C8E8',
  timerBreakTrack: '#E8F0F7',

  // 热力图
  heatmapEmpty: '#F0EBF5',
  heatmapL1: '#D9CCEB',
  heatmapL2: '#C3B1E1',
  heatmapL3: '#A78FC7',
  heatmapL4: '#8B6FB3',

  // 连续打卡
  streakFlame: '#FFB347',
  streakEmpty: '#E0D8E8',

  // 底部导航
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#C3B1E1',
  tabBarInactive: '#B5B0BF',
  tabBarBorder: '#F0EBF5',

  // 任务分类色
  categoryWork: '#C3B1E1',
  categoryWorkBg: '#F3EFF9',
  categoryStudy: '#A4C8E8',
  categoryStudyBg: '#E8F0F7',
  categoryLife: '#B2C9AB',
  categoryLifeBg: '#EAF2E6',

  // 四象限
  quadrantUrgentImportant: '#E8A4A4',
  quadrantUrgentNotImportant: '#E8D4A4',
  quadrantNotUrgentImportant: '#C3B1E1',
  quadrantNotUrgentNotImportant: '#B2C9AB',

  // 活动分类
  activityWork: '#C3B1E1',
  activityStudy: '#A4C8E8',
  activityExercise: '#F4A4A4',
  activityEntertainment: '#FFDAB9',
  activityRest: '#B2C9AB',
  activityOther: '#D0C8D8',

  // 成就徽章
  badgeGold: '#FFD700',
  badgeSilver: '#C0C0C0',
  badgeBronze: '#CD7F32',
  badgeLocked: '#E0D8E8',

  // 倒数日
  countdownDefault: '#C3B1E1',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const typography = {
  heading1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  heading2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  heading3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  timer: {
    fontSize: 64,
    fontWeight: '600' as const,
    lineHeight: 80,
  } as const,
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  badge: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  quote: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    fontStyle: 'italic' as const,
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: '#4A4458',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#4A4458',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#4A4458',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;
