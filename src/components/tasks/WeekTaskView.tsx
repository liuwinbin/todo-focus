// ============================================================
// WeekTaskView — 周视图（7 列布局）
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDate, addDays, getWeekStart, formatFriendlyDate } from '../../utils/dates';
import type { Task } from '../../types';

interface WeekTaskViewProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onAddItem?: (date: string) => void;
}

const DAY_LABELS_SHORT = ['一', '二', '三', '四', '五', '六', '日'];

export function WeekTaskView({ tasks, onTaskPress, onToggleComplete, onAddItem }: WeekTaskViewProps) {
  const weekDays = useMemo(() => {
    const monday = getWeekStart();
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  }, []);

  const today = formatDate(new Date());

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const day of weekDays) {
      map.set(day, []);
    }
    for (const task of tasks) {
      if (task.date && map.has(task.date)) {
        map.get(task.date)!.push(task);
      }
    }
    return map;
  }, [tasks, weekDays]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {weekDays.map((day, idx) => {
          const dayTasks = tasksByDay.get(day) || [];
          const isToday = day === today;
          const dayNum = parseInt(day.split('-')[2], 10);

          return (
            <View key={day} style={[styles.dayColumn, isToday && styles.todayColumn]}>
              {/* 星期头 */}
              <View style={[styles.dayHeader, isToday && styles.todayHeader]}>
                <Text style={[styles.dayLabel, (idx === 5 || idx === 6) && styles.weekendLabel]}>
                  {DAY_LABELS_SHORT[idx]}
                </Text>
                <View style={styles.dayHeaderBottom}>
                  <Text style={[styles.dayNum, isToday && styles.todayNum]}>
                    {dayNum}
                  </Text>
                  {onAddItem && (
                    <TouchableOpacity
                      onPress={() => onAddItem(day)}
                      hitSlop={4}
                      style={styles.addMiniBtn}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* 任务列表 */}
              <View style={styles.dayTasks}>
                {dayTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={[
                      styles.weekTaskItem,
                      task.completed && styles.weekTaskDone,
                    ]}
                    onPress={() => onTaskPress(task)}
                    activeOpacity={0.7}
                  >
                    <TouchableOpacity
                      onPress={() => onToggleComplete(task.id)}
                      hitSlop={4}
                    >
                      <Ionicons
                        name={task.completed ? 'checkbox' : 'square-outline'}
                        size={14}
                        color={task.completed ? colors.success : colors.primaryLight}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[styles.weekTaskTitle, task.completed && styles.weekTaskTitleDone]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </Text>
                  </TouchableOpacity>
                ))}
                {dayTasks.length === 0 && (
                  <Text style={styles.noTask}>—</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  dayColumn: {
    width: 108,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  todayColumn: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayHeader: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAlt,
  },
  todayHeader: {
    backgroundColor: colors.primaryBg,
  },
  dayLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 11,
  },
  weekendLabel: {
    color: colors.accent,
  },
  dayNum: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
  },
  todayNum: {
    color: colors.primary,
  },
  dayHeaderBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addMiniBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTasks: {
    padding: spacing.sm,
    minHeight: 80,
    gap: spacing.xs,
  },
  weekTaskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    paddingVertical: 2,
  },
  weekTaskDone: {
    opacity: 0.5,
  },
  weekTaskTitle: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    fontSize: 11,
    lineHeight: 14,
  },
  weekTaskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  noTask: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingTop: spacing.md,
  },
});
