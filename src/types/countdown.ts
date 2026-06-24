// ============================================================
// CountdownItem — 倒数日 / 纪念日数据类型
// ============================================================

export type CountdownType = 'anniversary' | 'birthday' | 'exam' | 'trip' | 'custom';

export const COUNTDOWN_TYPE_CONFIG: Record<CountdownType, { label: string; emoji: string }> = {
  anniversary: { label: '纪念日', emoji: '💝' },
  birthday:    { label: '生日', emoji: '🎂' },
  exam:        { label: '考试', emoji: '📝' },
  trip:        { label: '旅行', emoji: '✈️' },
  custom:      { label: '自定义', emoji: '⭐' },
};

export const COUNTDOWN_TYPES: CountdownType[] = ['anniversary', 'birthday', 'exam', 'trip', 'custom'];

export interface CountdownItem {
  id: string;
  title: string;
  targetDate: string;     // ISO 8601 date string
  type: CountdownType;
  icon: string;           // emoji
  color: string;          // hex color
  note?: string;
  isRepeatYearly: boolean;
  createdAt: string;      // ISO 8601
}
