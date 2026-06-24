// ============================================================
// HabitWeekGrid — 本周打卡网格视图
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface WeekDay {
  date: string;
  label: string;
  count: number;
}

interface HabitWeekGridProps {
  weekData: WeekDay[];
  targetCount: number;
  isToday: (date: string) => boolean;
}

export function HabitWeekGrid({ weekData, targetCount, isToday }: HabitWeekGridProps) {
  return (
    <View style={styles.container}>
      {weekData.map((day) => {
        const done = day.count >= targetCount;
        const today = isToday(day.date);
        return (
          <View
            key={day.date}
            style={[
              styles.dayCell,
              today && styles.todayCell,
              done && styles.doneCell,
            ]}
          >
            <Text style={[styles.dayLabel, today && styles.todayLabel]}>
              {day.label}
            </Text>
            <View
              style={[
                styles.dayCircle,
                done && styles.dayCircleDone,
                today && styles.dayCircleToday,
              ]}
            >
              {done ? (
                <Ionicons name="checkmark" size={16} color={colors.textInverse} />
              ) : day.count > 0 ? (
                <Text style={styles.dayCount}>{day.count}</Text>
              ) : (
                <Text style={styles.dayEmpty}>-</Text>
              )}
            </View>
            <Text style={styles.dateText}>{day.date.slice(5)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  todayCell: {
    // today gets special styling on circle
  },
  doneCell: {},
  dayLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  todayLabel: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleDone: {
    backgroundColor: colors.success,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  dayCount: {
    ...typography.badge,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  dayEmpty: {
    ...typography.badge,
    color: colors.textTertiary,
  },
  dateText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textTertiary,
  },
});
