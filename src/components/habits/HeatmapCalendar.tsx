// ============================================================
// HeatmapCalendar — 专注历史热力图
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDate, parseDate } from '../../utils/dates';
import type { CalendarDay } from '../../types';

interface HeatmapCalendarProps {
  data: CalendarDay[];
  weeks?: number;         // 显示多少周
  onDayPress?: (date: string) => void;
}

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

const heatmapColors = [
  colors.heatmapEmpty,
  colors.heatmapL1,
  colors.heatmapL2,
  colors.heatmapL3,
  colors.heatmapL4,
];

export function HeatmapCalendar({ data, weeks = 12, onDayPress }: HeatmapCalendarProps) {
  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    // 找到本周一
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    // 构建数据映射
    const dataMap = new Map(data.map((d) => [d.date, d]));

    // 构建网格（N 周 × 7 天）
    const cells: (CalendarDay | null)[][] = [];
    const months: { label: string; col: number }[] = [];
    let lastMonth = '';

    for (let w = weeks - 1; w >= 0; w--) {
      const week: (CalendarDay | null)[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() - w * 7 + d);

        if (date > today) {
          week.push(null); // 未来日期
        } else {
          const dateStr = formatDate(date);
          const existing = dataMap.get(dateStr);
          week.push(
            existing ?? {
              date: dateStr,
              sessionsCompleted: 0,
              level: 0,
            },
          );

          // 记录月份标签
          const monthLabel = `${date.getMonth() + 1}月`;
          if (monthLabel !== lastMonth) {
            lastMonth = monthLabel;
            months.push({ label: monthLabel, col: 7 - w }); // 反转列
          }
        }
      }
      cells.push(week);
    }

    // 转置：行=周，列=天 → 行=天，列=周
    const transposed: (CalendarDay | null)[][] = [];
    for (let d = 0; d < 7; d++) {
      transposed.push(cells.map((week) => week[d]));
    }

    return { grid: transposed, monthLabels: months };
  }, [data, weeks]);

  const cellSize = 14;
  const cellGap = 3;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>专注热力图</Text>
      <Text style={styles.subtitle}>过去 {weeks} 周</Text>

      {/* 月份标签 */}
      <View style={styles.monthRow}>
        <View style={{ width: 22 }} />
        <View style={styles.monthContainer}>
          {monthLabels.map((m, i) => (
            <Text
              key={i}
              style={[
                styles.monthLabel,
                { left: (m.col - 2) * (cellSize + cellGap) - 8 },
              ]}
            >
              {m.label}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.calendarRow}>
        {/* 星期标签 */}
        <View style={styles.dayLabels}>
          {DAY_LABELS.map((label, i) => (
            <Text key={i} style={styles.dayLabel}>{label}</Text>
          ))}
        </View>

        {/* 热力图网格 */}
        <View style={styles.grid}>
          {grid.map((row, rowIdx) => (
            <View key={rowIdx} style={[styles.gridRow, { gap: cellGap }]}>
              {row.map((cell, colIdx) =>
                cell ? (
                  <TouchableOpacity
                    key={`${rowIdx}-${colIdx}`}
                    style={[
                      styles.cell,
                      {
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: heatmapColors[cell.level],
                        borderRadius: 3,
                      },
                    ]}
                    onPress={() => onDayPress?.(cell.date)}
                    activeOpacity={0.7}
                  />
                ) : (
                  <View
                    key={`${rowIdx}-${colIdx}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                    }}
                  />
                ),
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 图例 */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>少</Text>
        {heatmapColors.map((color, i) => (
          <View
            key={i}
            style={[
              styles.legendCell,
              { backgroundColor: color, width: 10, height: 10, borderRadius: 2 },
            ]}
          />
        ))}
        <Text style={styles.legendLabel}>多</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  monthRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
    height: 16,
  },
  monthContainer: {
    flex: 1,
    position: 'relative',
  },
  monthLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    position: 'absolute',
    fontSize: 10,
  },
  calendarRow: {
    flexDirection: 'row',
  },
  dayLabels: {
    width: 22,
    gap: 3,
    alignItems: 'center',
  },
  dayLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 10,
    height: 14,
    lineHeight: 14,
  },
  grid: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  cell: {
    // size set inline
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    marginTop: spacing.sm,
  },
  legendCell: {
    // size set inline
  },
  legendLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 10,
    marginHorizontal: 2,
  },
});
