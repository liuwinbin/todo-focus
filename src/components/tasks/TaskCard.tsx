// ============================================================
// TaskCard — 任务卡片（可展开子任务 + 滑动操作）
// ============================================================
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { TaskProgress } from './TaskProgress';
import { SubtaskItem } from './SubtaskItem';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onPress: () => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onToggleSubtask,
  onDeleteSubtask,
  onPress,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const pomodoroLabel =
    task.estimatedPomodoros > 0
      ? `🍅 ${task.completedPomodoros}/${task.estimatedPomodoros}`
      : null;

  const allSubtasksDone =
    task.subtasks.length > 0 && task.subtasks.every((s) => s.completed);

  return (
    <Card style={[styles.card, task.completed ? styles.completedCard : undefined]}>
      <TouchableOpacity
        onPress={() => {
          setExpanded(!expanded);
          onPress();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          {/* 完成勾选框 */}
          <TouchableOpacity
            onPress={onToggleComplete}
            style={styles.checkbox}
            hitSlop={8}
          >
            <Ionicons
              name={task.completed ? 'checkbox' : 'square-outline'}
              size={24}
              color={task.completed ? colors.success : colors.primaryLight}
            />
          </TouchableOpacity>

          {/* 标题和标签 */}
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.title, task.completed && styles.completedTitle]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              <PriorityBadge priority={task.priority} />
            </View>

            {/* 元信息行 */}
            <View style={styles.metaRow}>
              {task.category && <CategoryBadge category={task.category} size="sm" />}
              {task.date && (
                <Text style={styles.metaText}>
                  📅 {task.date.slice(5)}
                </Text>
              )}
              {pomodoroLabel && (
                <Text style={styles.metaText}>{pomodoroLabel}</Text>
              )}
              {task.subtasks.length > 0 && (
                <Text style={styles.metaText}>
                  📋 {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                </Text>
              )}
              {task.tags && task.tags.length > 0 && (
                <Text style={styles.metaText} numberOfLines={1}>
                  🏷️ {task.tags.slice(0, 2).join(', ')}
                  {task.tags.length > 2 ? ` +${task.tags.length - 2}` : ''}
                </Text>
              )}
              {task.memo && (
                <Text style={styles.metaText}>📝</Text>
              )}
            </View>

            {/* 子任务进度条 */}
            {task.subtasks.length > 0 && (
              <TaskProgress
                completed={task.subtasks.filter((s) => s.completed).length}
                total={task.subtasks.length}
              />
            )}
          </View>

          {/* 展开指示 */}
          {task.subtasks.length > 0 && (
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textTertiary}
            />
          )}
        </View>
      </TouchableOpacity>

      {/* 展开的子任务列表 */}
      {expanded && task.subtasks.length > 0 && (
        <View style={styles.subtaskList}>
          {task.subtasks.map((sub) => (
            <SubtaskItem
              key={sub.id}
              subtask={sub}
              onToggle={() => onToggleSubtask(sub.id)}
              onDelete={() => onDeleteSubtask(sub.id)}
            />
          ))}
        </View>
      )}

      {/* 删除按钮 */}
      {!task.completed && (
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteBtn}
          activeOpacity={0.6}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    position: 'relative',
  },
  completedCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkbox: {
    paddingTop: 2,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  subtaskList: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
    paddingLeft: spacing.xl,
  },
  deleteBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
