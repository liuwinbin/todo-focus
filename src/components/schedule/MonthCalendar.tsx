// ============================================================
// MonthCalendar — 月历网格 + 事件圆点
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { getDaysInMonth, getFirstDayOfMonth, formatDate, formatMonthYear, isToday } from '../../utils/dates';
import { EVENT_COLORS, type ScheduleEvent } from '../../types';

interface MonthCalendarProps {
  events: ScheduleEvent[];
  selectedDate: string;
  year: number;
  month: number;
  onSelectDate: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
}

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];
const MAX_DOTS = 3;

export function MonthCalendar({
  events,
  selectedDate,
  year,
  month,
  onSelectDate,
  onMonthChange,
}: MonthCalendarProps) {
  // 按日期分组事件圆点
  const dotsByDate = useMemo(() => {
    const map = new Map<string, { color: string; key: string }[]>();
    for (const event of events) {
      if (!event.date) continue;
      const dots = map.get(event.date) ?? [];
      // 去重（按 key）
      if (!dots.find((d) => d.key === event.id)) {
        dots.push({ color: event.color ? EVENT_COLORS[event.color] : '#A4C8E8', key: event.id });
      }
      map.set(event.date, dots);
    }
    return map;
  }, [events]);

  // 构建日历网格
  const cells = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // 0=Sun
    // 转为周一基准: Mon=0, Tue=1, ..., Sun=6
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const totalCells = 42; // 6 行 × 7 列
    const result: (string | null)[] = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startOffset + 1;
      if (dayNum < 1 || dayNum > daysInMonth) {
        result.push(null);
      } else {
        const m = String(month).padStart(2, '0');
        const d = String(dayNum).padStart(2, '0');
        result.push(`${year}-${m}-${d}`);
      }
    }

    return result;
  }, [year, month]);

  const todayStr = formatDate(new Date());

  const goToPrevMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  return (
    <Card style={styles.container} padding={spacing.lg} noShadow>
      {/* 月份标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.arrowBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{formatMonthYear(year, month)}</Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.arrowBtn} hitSlop={8}>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 星期标签 */}
      <View style={styles.weekdayRow}>
        {DAY_LABELS.map((label, i) => (
          <View key={i} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, (i === 5 || i === 6) && styles.weekendText]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* 日期网格 */}
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, rowIdx) => (
          <View key={rowIdx} style={styles.gridRow}>
            {cells.slice(rowIdx * 7, (rowIdx + 1) * 7).map((dateStr, colIdx) => {
              if (!dateStr) {
                return <View key={`empty-${rowIdx}-${colIdx}`} style={styles.cell} />;
              }

              const dots = dotsByDate.get(dateStr) || [];
              const isSel = dateStr === selectedDate;
              const isTdy = dateStr === todayStr;
              const dayNum = parseInt(dateStr.split('-')[2], 10);

              return (
                <TouchableOpacity
                  key={dateStr}
                  style={[
                    styles.cell,
                    isSel && styles.cellSelected,
                  ]}
                  onPress={() => onSelectDate(dateStr)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSel && styles.dayTextSelected,
                      isTdy && !isSel && styles.dayTextToday,
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {isTdy && !isSel && <View style={styles.todayDot} />}

                  {/* 事件圆点 */}
                  {dots.length > 0 && (
                    <View style={styles.dotsRow}>
                      {dots.slice(0, MAX_DOTS).map((dot, di) => (
                        <View
                          key={dot.key}
                          style={[styles.dot, { backgroundColor: dot.color }]}
                        />
                      ))}
                      {dots.length > MAX_DOTS && (
                        <Text style={styles.moreDots}>+{dots.length - MAX_DOTS}</Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  weekdayText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  weekendText: {
    color: colors.accent,
  },
  grid: {
    // container for 6 rows
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  cellSelected: {
    backgroundColor: colors.primaryBg,
  },
  dayText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '500',
    fontSize: 14,
  },
  dayTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '700',
  },
  todayDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  moreDots: {
    fontSize: 9,
    color: colors.textTertiary,
    lineHeight: 10,
  },
});
