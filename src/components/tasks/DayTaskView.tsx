// ============================================================
// DayTaskView — 日视图（时间轴布局）
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDate, formatFriendlyDate } from '../../utils/dates';
import type { Task } from '../../types';

interface DayTaskViewProps {
  tasks: Task[];
  selectedDate: string;
  onTaskPress: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onAddItem?: () => void;
}

export function DayTaskView({ tasks, selectedDate, onTaskPress, onToggleComplete, onAddItem }: DayTaskViewProps) {
  const dayTasks = useMemo(
    () => tasks.filter((t) => !t.date || t.date === selectedDate),
    [tasks, selectedDate],
  );

  const pendingTasks = dayTasks.filter((t) => !t.completed);
  const completedTasks = dayTasks.filter((t) => t.completed);

  // 时间槽（模拟全天时间轴）
  const timeSlots = ['上午', '下午', '晚上'];
  const tasksBySlot = useMemo(() => {
    const map: Record<string, Task[]> = { '上午': [], '下午': [], '晚上': [], '无时间': [] };
    for (const t of pendingTasks) {
      map['无时间'].push(t);
    }
    return map;
  }, [pendingTasks]);

  if (dayTasks.length === 0) {
    return (
      <Card style={styles.emptyCard} padding={spacing.xl} noShadow>
        <Ionicons name="today-outline" size={40} color={colors.textTertiary} />
        <Text style={styles.emptyText}>当天没有任务</Text>
        <Text style={styles.emptyHint}>为任务设置截止日期即可在此查看</Text>
        {onAddItem && (
          <TouchableOpacity style={styles.addButton} onPress={onAddItem} activeOpacity={0.7}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={styles.addButtonText}>添加当日事项</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.dateHeaderRow}>
        <Text style={styles.dateTitle}>{formatFriendlyDate(selectedDate)}</Text>
        {onAddItem && (
          <TouchableOpacity onPress={onAddItem} style={styles.addCircle} activeOpacity={0.7}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* 时间轴 */}
      {timeSlots.map((slot) => {
        const slotTasks = tasksBySlot[slot] || [];
        if (slotTasks.length === 0 && slot !== '上午') return null;
        return (
          <View key={slot} style={styles.slotRow}>
            <View style={styles.timeLabel}>
              <Text style={styles.timeText}>{slot}</Text>
              <View style={styles.timeLine} />
            </View>
            <View style={styles.slotContent}>
              {slotTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskItem}
                  onPress={() => onTaskPress(task)}
                  activeOpacity={0.7}
                >
                  <TouchableOpacity
                    onPress={() => onToggleComplete(task.id)}
                    hitSlop={8}
                    style={styles.checkCircle}
                  >
                    <Ionicons
                      name="ellipse-outline"
                      size={20}
                      color={colors.primaryLight}
                    />
                  </TouchableOpacity>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                    <View style={styles.taskMeta}>
                      {task.category && <CategoryBadge category={task.category} size="sm" />}
                      <PriorityBadge priority={task.priority} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {slotTasks.length === 0 && (
                <Text style={styles.noTaskText}>—</Text>
              )}
            </View>
          </View>
        );
      })}

      {/* 已完成 */}
      {completedTasks.length > 0 && (
        <View style={styles.completedSection}>
          <Text style={styles.completedLabel}>
            已完成 ({completedTasks.length})
          </Text>
          {completedTasks.map((task) => (
            <View key={task.id} style={styles.completedItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.completedTitle} numberOfLines={1}>{task.title}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  dateTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyCard: {
    marginHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyHint: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
  },
  addButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  slotRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timeLabel: {
    width: 48,
    alignItems: 'center',
  },
  timeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  timeLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.primaryLight,
    opacity: 0.5,
  },
  slotContent: {
    flex: 1,
    marginLeft: spacing.sm,
    gap: spacing.sm,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  checkCircle: {
    paddingTop: 1,
  },
  taskInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  taskTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  noTaskText: {
    ...typography.caption,
    color: colors.textTertiary,
    paddingLeft: spacing.sm,
  },
  completedSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
  },
  completedLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  completedTitle: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
    flex: 1,
  },
});
