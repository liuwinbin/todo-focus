// ============================================================
// TaskTemplatePicker — 模板选择弹窗
// ============================================================
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { useTemplates } from '../../hooks/useTemplates';
import { useItems } from '../../hooks/useItems';
import type { TaskTemplate } from '../../types';

interface TaskTemplatePickerProps {
  onClose: () => void;
}

export function TaskTemplatePicker({ onClose }: TaskTemplatePickerProps) {
  const { templates, deleteTemplate } = useTemplates();
  const { addItem } = useItems();

  const handleApply = (template: TaskTemplate) => {
    Alert.alert(
      '应用模板',
      `将「${template.name}」中的所有任务添加到列表？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            for (const t of template.tasks) {
              addItem({
                title: t.title,
                priority: t.priority,
                category: t.category,
                estimatedPomodoros: t.estimatedPomodoros,
                subtasks: [],
              });
            }
            onClose();
          },
        },
      ],
    );
  };

  const handleDelete = (template: TaskTemplate) => {
    Alert.alert('删除模板', `确定删除「${template.name}」？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => deleteTemplate(template.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: TaskTemplate }) => (
    <Card style={styles.card} padding={spacing.md}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="copy-outline" size={18} color={colors.primary} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleApply(item)}
            style={styles.applyBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.applyText}>应用</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={8} activeOpacity={0.6}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.taskList}>
        {item.tasks.map((t, idx) => (
          <View key={idx} style={styles.templateTask}>
            <Ionicons name="remove-outline" size={12} color={colors.textTertiary} />
            <Text style={styles.templateTaskTitle} numberOfLines={1}>{t.title}</Text>
            <Text style={styles.templateTaskMeta}>🍅{t.estimatedPomodoros}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.taskCount}>共 {item.tasks.length} 个任务</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>任务模板</Text>
        <TouchableOpacity onPress={onClose} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {templates.length === 0 ? (
        <EmptyState
          icon="copy-outline"
          title="还没有模板"
          subtitle="内置模板会在首次使用时自动创建"
        />
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.tabBarBorder,
  },
  topTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
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
