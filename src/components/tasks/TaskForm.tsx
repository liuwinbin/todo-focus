// ============================================================
// TaskForm — 添加/编辑任务表单
// ============================================================
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { TaskMemoInput } from './TaskMemoInput';
import { TaskImageAttachment } from './TaskImageAttachment';
import { TagInput } from './TagInput';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { TASK_CATEGORIES, type Priority, type TaskCategory } from '../../types';

interface TaskFormProps {
  onSave: (data: {
    title: string;
    description?: string;
    priority: Priority;
    category?: TaskCategory;
    estimatedPomodoros: number;
    subtasks: string[];
    memo?: string;
    imageUri?: string;
    dueDate?: string;
    tags?: string[];
  }) => void;
  onCancel: () => void;
  initialData?: {
    title?: string;
    priority?: Priority;
    category?: TaskCategory;
    estimatedPomodoros?: number;
    subtasks?: string[];
    memo?: string;
    imageUri?: string;
    tags?: string[];
  };
}

const PRIORITY_OPTIONS: { value: Priority; label: string; emoji: string; color: string }[] = [
  { value: 'high', label: '高优先级', emoji: '🔴', color: colors.priorityHigh },
  { value: 'medium', label: '中优先级', emoji: '🟡', color: colors.priorityMedium },
  { value: 'low', label: '低优先级', emoji: '🟢', color: colors.priorityLow },
];

export function TaskForm({ onSave, onCancel, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [category, setCategory] = useState<TaskCategory | undefined>(initialData?.category);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(initialData?.estimatedPomodoros ?? 1);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(initialData?.subtasks || []);
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [imageUri, setImageUri] = useState<string | undefined>(initialData?.imageUri);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const handleAddSubtask = () => {
    const trimmed = subtaskInput.trim();
    if (trimmed && !subtasks.includes(trimmed)) {
      setSubtasks([...subtasks, trimmed]);
      setSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      priority,
      category,
      estimatedPomodoros: Math.max(0, estimatedPomodoros),
      subtasks,
      memo: memo.trim() || undefined,
      imageUri,
      tags: tags.length > 0 ? tags : undefined,
    });
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
        {/* 任务标题 */}
        <SectionHeader title="任务名称" />
        <TextInput
          style={styles.titleInput}
          placeholder="我要做什么？"
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* 优先级选择 */}
        <SectionHeader title="优先级" />
        <View style={styles.priorityRow}>
          {PRIORITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setPriority(opt.value)}
              style={[
                styles.priorityOption,
                priority === opt.value && {
                  backgroundColor: opt.color + '20',
                  borderColor: opt.color,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.priorityEmoji}>{opt.emoji}</Text>
              <Text
                style={[
                  styles.priorityLabel,
                  priority === opt.value && { color: opt.color, fontWeight: '600' },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 分类选择 */}
        <SectionHeader title="分类" />
        <View style={styles.priorityRow}>
          <TouchableOpacity
            onPress={() => setCategory(undefined)}
            style={[
              styles.priorityOption,
              !category && { backgroundColor: colors.textTertiary + '20', borderColor: colors.textTertiary },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.priorityEmoji}>📌</Text>
            <Text style={[styles.priorityLabel, !category && { color: colors.textSecondary, fontWeight: '600' }]}>
              无分类
            </Text>
          </TouchableOpacity>
          {(['work', 'study', 'life'] as TaskCategory[]).map((cat) => {
            const cfg = TASK_CATEGORIES[cat];
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.priorityOption,
                  category === cat && { backgroundColor: cfg.color + '20', borderColor: cfg.color },
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.priorityEmoji}>{cfg.emoji}</Text>
                <Text
                  style={[
                    styles.priorityLabel,
                    category === cat && { color: cfg.color, fontWeight: '600' },
                  ]}
                >
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 预估番茄数 */}
        <SectionHeader title="预估番茄钟数量" />
        <View style={styles.pomodoroStepper}>
          <TouchableOpacity
            onPress={() => setEstimatedPomodoros(Math.max(0, estimatedPomodoros - 1))}
            style={styles.stepperBtn}
          >
            <Text style={styles.stepperBtnText}>−</Text>
          </TouchableOpacity>
          <View style={styles.pomodoroDisplay}>
            <Text style={styles.pomodoroNumber}>{estimatedPomodoros}</Text>
            <Text style={styles.pomodoroUnit}>个 🍅</Text>
          </View>
          <TouchableOpacity
            onPress={() => setEstimatedPomodoros(Math.min(10, estimatedPomodoros + 1))}
            style={styles.stepperBtn}
          >
            <Text style={styles.stepperBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* 子任务 */}
        <SectionHeader title="子任务（可选）" />
        <View style={styles.subtaskInputRow}>
          <TextInput
            style={styles.subtaskInput}
            placeholder="添加小步骤..."
            placeholderTextColor={colors.textTertiary}
            value={subtaskInput}
            onChangeText={setSubtaskInput}
            onSubmitEditing={handleAddSubtask}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={handleAddSubtask} style={styles.addSubtaskBtn}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {subtasks.map((st, index) => (
          <View key={index} style={styles.subtaskRow}>
            <Ionicons name="remove-outline" size={16} color={colors.textTertiary} />
            <Text style={styles.subtaskText}>{st}</Text>
            <TouchableOpacity onPress={() => handleRemoveSubtask(index)} hitSlop={8}>
              <Ionicons name="close-outline" size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}

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
            title="保存任务"
            onPress={handleSave}
            variant="primary"
            size="lg"
            style={styles.actionBtn}
            disabled={!title.trim()}
          />
        </View>
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
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  priorityOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  priorityEmoji: { fontSize: 22, marginBottom: 4 },
  priorityLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pomodoroStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  pomodoroDisplay: {
    alignItems: 'center',
  },
  pomodoroNumber: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  pomodoroUnit: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  subtaskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  subtaskInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  addSubtaskBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.sm,
  },
  subtaskText: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionBtn: {
    flex: 1,
  },
});
