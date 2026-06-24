// ============================================================
// useThemeColors — 根据用户设置返回当前主题色板
// ============================================================
import { useMemo } from 'react';
import { useSettingsContext } from '../context/SettingsContext';
import { getThemeColors } from '../utils/themes';
import type { ThemeColors } from '../utils/themes';

export function useThemeColors(): ThemeColors {
  const { settings } = useSettingsContext();
  return useMemo(() => getThemeColors(settings.themeId), [settings.themeId]);
}
