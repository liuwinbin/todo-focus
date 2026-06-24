// ============================================================
// QuadrantCell — 四象限单元格
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { PriorityBadge } from './PriorityBadge';
import type { Task } from '../../types';

interface QuadrantCellProps {
  title: string;
  subtitle: string;
  color: string;
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onAddItem?: () => void;
}

export function QuadrantCell({
  title,
  subtitle,
  color,
  tasks,
  onTaskPress,
  onToggleComplete,
  onAddItem,
}: QuadrantCellProps) {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      {/* 象限标题 */}
      <View style={[styles.header, { backgroundColor: color + '18' }]}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.title, { color }]}>{title}</Text>
          {onAddItem && (
            <TouchableOpacity onPress={onAddItem} hitSlop={6} activeOpacity={0.7}>
              <Ionicons name="add-circle-outline" size={18} color={color} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* 任务列表 */}
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskItem, task.completed && styles.taskDone]}
            onPress={() => onTaskPress(task)}
            activeOpacity={0.7}
          >
            <TouchableOpacity
              onPress={() => onToggleComplete(task.id)}
              hitSlop={6}
            >
              <Ionicons
                name={task.completed ? 'checkbox' : 'square-outline'}
                size={16}
                color={task.completed ? colors.success : colors.primaryLight}
              />
            </TouchableOpacity>
            <View style={styles.taskInfo}>
              <Text
                style={[styles.taskTitle, task.completed && styles.taskTitleDone]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              <PriorityBadge priority={task.priority} />
            </View>
          </TouchableOpacity>
        ))}
        {tasks.length === 0 && (
          <Text style={styles.emptyText}>暂无任务</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    overflow: 'hidden',
    minHeight: 120,
  },
  header: {
    padding: spacing.sm,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: '700',
    fontSize: 13,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 10,
    marginTop: 1,
  },
  taskList: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  taskDone: {
    opacity: 0.5,
  },
  taskInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    fontSize: 11,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontStyle: 'italic',
    fontSize: 11,
  },
});
