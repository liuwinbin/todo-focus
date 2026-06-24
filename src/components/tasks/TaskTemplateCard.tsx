// ============================================================
// TaskTemplateCard — 模板卡片
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import type { TaskTemplate } from '../../types';

interface TaskTemplateCardProps {
  template: TaskTemplate;
  onApply: () => void;
  onDelete: () => void;
}

export function TaskTemplateCard({ template, onApply, onDelete }: TaskTemplateCardProps) {
  return (
    <Card style={styles.card} padding={spacing.md}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="copy-outline" size={18} color={colors.primary} />
          <Text style={styles.name}>{template.name}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onApply} style={styles.applyBtn} activeOpacity={0.7}>
            <Text style={styles.applyText}>应用</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} hitSlop={8} activeOpacity={0.6}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.taskList}>
        {template.tasks.map((t, idx) => (
          <View key={idx} style={styles.templateTask}>
            <Ionicons name="remove-outline" size={12} color={colors.textTertiary} />
            <Text style={styles.templateTaskTitle} numberOfLines={1}>
              {t.title}
            </Text>
            <Text style={styles.templateTaskMeta}>
              🍅{t.estimatedPomodoros}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.taskCount}>
        共 {template.tasks.length} 个任务
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  applyBtn: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  applyText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  taskList: {
    marginBottom: spacing.sm,
    gap: 2,
  },
  templateTask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  templateTaskTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 13,
  },
  templateTaskMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  taskCount: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
