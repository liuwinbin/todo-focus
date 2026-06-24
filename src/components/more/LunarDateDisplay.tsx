// ============================================================
// LunarDateDisplay — 农历日期展示
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { getTodayLunar, formatDateCN, getDayOfWeekCN } from '../../utils/lunar';

export function LunarDateDisplay() {
  const lunar = useMemo(() => getTodayLunar(), []);
  const today = useMemo(() => new Date(), []);

  return (
    <Card style={styles.card} padding={0}>
      {/* 公历日期行 */}
      <View style={styles.solarRow}>
        <Text style={styles.solarDate}>
          {formatDateCN(today)}
        </Text>
        <Text style={styles.weekDay}>
          {getDayOfWeekCN(today)}
        </Text>
      </View>

      {/* 分隔 */}
      <View style={styles.divider} />

      {/* 农历日期行 */}
      <View style={styles.lunarRow}>
        <View style={styles.lunarLeft}>
          <Text style={styles.lunarDate}>
            {lunar.yearName}年{lunar.isLeap ? '闰' : ''}{lunar.monthName}{lunar.dayName}
          </Text>
          <Text style={styles.zodiac}>
            🐾 {lunar.zodiac}年
          </Text>
        </View>

        {/* 节日 */}
        {(lunar.festival || lunar.solarFestival) && (
          <View style={styles.festivalBadge}>
            <Text style={styles.festivalText}>
              🏮 {lunar.festival || lunar.solarFestival}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  solarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  solarDate: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  weekDay: {
    ...typography.body,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.tabBarBorder,
    marginHorizontal: spacing.md,
  },
  lunarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  lunarLeft: {
    gap: 2,
  },
  lunarDate: {
    ...typography.body,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  zodiac: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  festivalBadge: {
    backgroundColor: colors.accentLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  festivalText: {
    ...typography.caption,
    color: colors.accentDark,
    fontWeight: '600',
  },
});
