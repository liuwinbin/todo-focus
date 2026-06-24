// ============================================================
// TaskDetailSheet — 任务详情面板（编辑模式）
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { TaskMemoInput } from './TaskMemoInput';
import { TaskImageAttachment } from './TaskImageAttachment';
import { TagInput } from './TagInput';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { TASK_CATEGORIES, type Task, type Priority, type TaskCategory } from '../../types';

interface TaskDetailSheetProps {
  task: Task;
  onSave: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; emoji: string; color: string }[] = [
  { value: 'high', label: '高优先级', emoji: '🔴', color: colors.priorityHigh },
  { value: 'medium', label: '中优先级', emoji: '🟡', color: colors.priorityMedium },
  { value: 'low', label: '低优先级', emoji: '🟢', color: colors.priorityLow },
];

const CATEGORY_OPTIONS: { value: TaskCategory; label: string; emoji: string }[] = [
  { value: 'work', label: '工作', emoji: '💼' },
  { value: 'study', label: '学习', emoji: '📚' },
  { value: 'life', label: '生活', emoji: '🏠' },
];

export function TaskDetailSheet({ task, onSave, onDelete, onCancel }: TaskDetailSheetProps) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [category, setCategory] = useState<TaskCategory | undefined>(task.category);
  const [memo, setMemo] = useState(task.memo || '');
  const [imageUri, setImageUri] = useState<string | undefined>(task.imageUri);
  const [tags, setTags] = useState<string[]>(task.tags || []);

  useEffect(() => {
    setTitle(task.title);
    setPriority(task.priority);
    setCategory(task.category);
    setMemo(task.memo || '');
    setImageUri(task.imageUri);
    setTags(task.tags || []);
  }, [task.id]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      priority,
      category,
      memo: memo.trim() || undefined,
      imageUri,
      tags,
    });
    onCancel();
  };

  const handleDeleteTask = () => {
    Alert.alert('删除任务', `确定删除「${task.title}」？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 标题 */}
        <SectionHeader title="任务名称" />
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="任务名称"
          placeholderTextColor={colors.textTertiary}
        />

        {/* 优先级 */}
        <SectionHeader title="优先级" />
        <View style={styles.optionRow}>
          {PRIORITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setPriority(opt.value)}
              style={[
                styles.option,
                priority === opt.value && { backgroundColor: opt.color + '20', borderColor: opt.color },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={[styles.optionLabel, priority === opt.value && { color: opt.color, fontWeight: '600' }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 分类 */}
        <SectionHeader title="分类" />
        <View style={styles.optionRow}>
          <TouchableOpacity
            onPress={() => setCategory(undefined)}
            style={[
              styles.option,
              !category && { backgroundColor: colors.textTertiary + '20', borderColor: colors.textTertiary },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.optionEmoji}>📌</Text>
            <Text style={[styles.optionLabel, !category && { color: colors.textSecondary, fontWeight: '600' }]}>
              无分类
            </Text>
          </TouchableOpacity>
          {CATEGORY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setCategory(opt.value)}
              style={[
                styles.option,
                category === opt.value && {
                  backgroundColor: TASK_CATEGORIES[opt.value].color + '20',
                  borderColor: TASK_CATEGORIES[opt.value].color,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  category === opt.value && { color: TASK_CATEGORIES[opt.value].color, fontWeight: '600' },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 备忘录 */}
        <TaskMemoInput value={memo} onChange={setMemo} />

        {/* 标签 */}
        <TagInput tags={tags} onChange={setTags} />

        {/* 图片附件 */}
        <TaskImageAttachment imageUri={imageUri} onChange={setImageUri} />

        {/* 操作按钮 */}
        <View style={styles.actions}>
          <Button title="取消" onPress={onCancel} variant="outline" size="lg" style={styles.actionBtn} />
          <Button
            title="保存修改"
            onPress={handleSave}
            variant="primary"
            size="lg"
            style={styles.actionBtn}
            disabled={!title.trim()}
          />
        </View>

        {/* 删除按钮 */}
        <TouchableOpacity onPress={handleDeleteTask} style={styles.deleteBtn} activeOpacity={0.6}>
          <Ionicons name="trash-outline" size={18} color={colors.error} />
          <Text style={styles.deleteText}>删除任务</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  titleInput: {
    ...typography.heading3,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  optionEmoji: { fontSize: 20, marginBottom: 2 },
  optionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionBtn: { flex: 1 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error + '10',
  },
  deleteText: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
  },
});
