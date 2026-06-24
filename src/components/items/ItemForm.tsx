// ============================================================
// ItemForm — 统一创建/编辑表单（Task + Schedule 字段）
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { TaskMemoInput } from '../tasks/TaskMemoInput';
import { TaskImageAttachment } from '../tasks/TaskImageAttachment';
import { TagInput } from '../tasks/TagInput';
import { EventColorPicker } from '../schedule/EventColorPicker';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { ITEM_CATEGORIES, type Priority, type ItemCategory, type EventColor } from '../../types';

interface ItemFormProps {
  onSave: (data: ItemFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ItemFormData>;
  defaultDate?: string;
}

export interface ItemFormData {
  title: string;
  description?: string;
  priority: Priority;
  category?: ItemCategory;
  estimatedPomodoros: number;
  subtasks: string[];
  memo?: string;
  imageUri?: string;
  date?: string;
  tags?: string[];
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  color?: EventColor;
  notes?: string;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; emoji: string; color: string }[] = [
  { value: 'high', label: '高优先级', emoji: '🔴', color: colors.priorityHigh },
  { value: 'medium', label: '中优先级', emoji: '🟡', color: colors.priorityMedium },
  { value: 'low', label: '低优先级', emoji: '🟢', color: colors.priorityLow },
];

export function ItemForm({ onSave, onCancel, initialData, defaultDate }: ItemFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [category, setCategory] = useState<ItemCategory | undefined>(initialData?.category);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(initialData?.estimatedPomodoros ?? 1);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(initialData?.subtasks || []);
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [imageUri, setImageUri] = useState<string | undefined>(initialData?.imageUri);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  // Schedule fields
  const [date, setDate] = useState(initialData?.date ?? defaultDate ?? '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');
  const [allDay, setAllDay] = useState(initialData?.allDay ?? false);
  const [color, setColor] = useState<EventColor | undefined>(initialData?.color);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleAddSubtask = () => {
    const trimmed = subtaskInput.trim();
    if (trimmed && !subtasks.includes(trimmed)) {
      setSubtasks([...subtasks, trimmed]);
      setSubtaskInput('');
    }
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
      date: date.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      startTime: allDay ? undefined : (startTime.trim() || undefined),
      endTime: allDay ? undefined : (endTime.trim() || undefined),
      allDay,
      color,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* 标题 */}
        <SectionHeader title="名称" />
        <TextInput style={styles.titleInput} placeholder="我要做什么？" placeholderTextColor={colors.textTertiary}
          value={title} onChangeText={setTitle} autoFocus />

        {/* 优先级 */}
        <SectionHeader title="优先级" />
        <View style={styles.priorityRow}>
          {PRIORITY_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.value} onPress={() => setPriority(opt.value)}
              style={[styles.priorityOption, priority === opt.value && { backgroundColor: opt.color + '20', borderColor: opt.color }]}
              activeOpacity={0.7}>
              <Text style={styles.priorityEmoji}>{opt.emoji}</Text>
              <Text style={[styles.priorityLabel, priority === opt.value && { color: opt.color, fontWeight: '600' }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 分类 */}
        <SectionHeader title="分类" />
        <View style={styles.priorityRow}>
          <TouchableOpacity onPress={() => setCategory(undefined)}
            style={[styles.priorityOption, !category && { backgroundColor: colors.textTertiary + '20', borderColor: colors.textTertiary }]} activeOpacity={0.7}>
            <Text style={styles.priorityEmoji}>📌</Text>
            <Text style={[styles.priorityLabel, !category && { color: colors.textSecondary, fontWeight: '600' }]}>无分类</Text>
          </TouchableOpacity>
          {(['work', 'study', 'life'] as ItemCategory[]).map((cat) => {
            const cfg = ITEM_CATEGORIES[cat];
            return (
              <TouchableOpacity key={cat} onPress={() => setCategory(cat)}
                style={[styles.priorityOption, category === cat && { backgroundColor: cfg.color + '20', borderColor: cfg.color }]} activeOpacity={0.7}>
                <Text style={styles.priorityEmoji}>{cfg.emoji}</Text>
                <Text style={[styles.priorityLabel, category === cat && { color: cfg.color, fontWeight: '600' }]}>{cfg.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 预估番茄数 */}
        <SectionHeader title="预估番茄钟数量" />
        <View style={styles.stepperRow}>
          <TouchableOpacity onPress={() => setEstimatedPomodoros(Math.max(0, estimatedPomodoros - 1))} style={styles.stepperBtn}>
            <Text style={styles.stepperBtnText}>−</Text>
          </TouchableOpacity>
          <View style={styles.stepperDisp}>
            <Text style={styles.stepperNum}>{estimatedPomodoros}</Text>
            <Text style={styles.stepperUnit}>个 🍅</Text>
          </View>
          <TouchableOpacity onPress={() => setEstimatedPomodoros(Math.min(10, estimatedPomodoros + 1))} style={styles.stepperBtn}>
            <Text style={styles.stepperBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* 子任务 */}
        <SectionHeader title="子任务（可选）" />
        <View style={styles.subtaskInputRow}>
          <TextInput style={styles.subtaskInput} placeholder="添加小步骤..." placeholderTextColor={colors.textTertiary}
            value={subtaskInput} onChangeText={setSubtaskInput} onSubmitEditing={handleAddSubtask} returnKeyType="done" />
          <TouchableOpacity onPress={handleAddSubtask} style={styles.addSubtaskBtn}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {subtasks.map((st, i) => (
          <View key={i} style={styles.subtaskRow}>
            <Ionicons name="remove-outline" size={16} color={colors.textTertiary} />
            <Text style={styles.subtaskText}>{st}</Text>
            <TouchableOpacity onPress={() => setSubtasks(subtasks.filter((_, j) => j !== i))} hitSlop={8}>
              <Ionicons name="close-outline" size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        {/* ---- 日程字段 ---- */}
        <SectionHeader title="📅 日程（可选）" />
        <View style={styles.scheduleGroup}>
          <View style={styles.dateRow}>
            <Text style={styles.scheduleLabel}>日期</Text>
            <TextInput style={styles.dateInput} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textTertiary}
              value={date} onChangeText={setDate} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.scheduleLabel}>全天</Text>
            <Switch value={allDay} onValueChange={setAllDay}
              trackColor={{ false: colors.tabBarBorder, true: colors.primaryLight }}
              thumbColor={allDay ? colors.primary : '#f4f3f4'} />
          </View>
          {!allDay && (
            <View style={styles.timeRow}>
              <View style={styles.timeField}>
                <Text style={styles.scheduleLabel}>开始</Text>
                <TextInput style={styles.dateInput} placeholder="09:00" placeholderTextColor={colors.textTertiary}
                  value={startTime} onChangeText={setStartTime} />
              </View>
              <Text style={styles.timeSep}>—</Text>
              <View style={styles.timeField}>
                <Text style={styles.scheduleLabel}>结束</Text>
                <TextInput style={styles.dateInput} placeholder="10:00" placeholderTextColor={colors.textTertiary}
                  value={endTime} onChangeText={setEndTime} />
              </View>
            </View>
          )}
        </View>

        {/* 颜色标签 */}
        <SectionHeader title="颜色标签" />
        <EventColorPicker selected={color ?? 'sky'} onSelect={(c) => setColor(c)} />

        {/* 日程备注 */}
        <SectionHeader title="日程备注（可选）" />
        <TextInput style={[styles.titleInput, { ...typography.body, minHeight: 60 }]} placeholder="简短备注..."
          placeholderTextColor={colors.textTertiary} value={notes} onChangeText={setNotes} multiline />

        {/* 备忘录 */}
        <TaskMemoInput value={memo} onChange={setMemo} />
        {/* 标签 */}
        <TagInput tags={tags} onChange={setTags} />
        {/* 图片附件 */}
        <TaskImageAttachment imageUri={imageUri} onChange={setImageUri} />

        {/* 操作 */}
        <View style={styles.actions}>
          <Button title="取消" onPress={onCancel} variant="outline" size="lg" style={styles.actionBtn} />
          <Button title="保存" onPress={handleSave} variant="primary" size="lg" style={styles.actionBtn} disabled={!title.trim()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  titleInput: { ...typography.heading3, color: colors.textPrimary, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.sm, marginBottom: spacing.lg },
  priorityRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.lg },
  priorityOption: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 2, borderColor: 'transparent', backgroundColor: colors.surface },
  priorityEmoji: { fontSize: 22, marginBottom: 4 },
  priorityLabel: { ...typography.caption, color: colors.textSecondary },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md },
  stepperBtn: { width: 40, height: 40, borderRadius: borderRadius.full, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
  stepperBtnText: { fontSize: 24, color: colors.primary, fontWeight: '600' },
  stepperDisp: { alignItems: 'center' },
  stepperNum: { ...typography.heading2, color: colors.textPrimary },
  stepperUnit: { ...typography.caption, color: colors.textSecondary },
  subtaskInputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.sm },
  subtaskInput: { flex: 1, ...typography.body, color: colors.textPrimary, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md },
  addSubtaskBtn: { width: 44, height: 44, borderRadius: borderRadius.full, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
  subtaskRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.sm, marginBottom: spacing.xs, backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.sm },
  subtaskText: { flex: 1, ...typography.bodySmall, color: colors.textPrimary },
  scheduleGroup: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.sm, marginBottom: spacing.lg, gap: spacing.md },
  dateRow: { gap: spacing.xs },
  scheduleLabel: { ...typography.caption, color: colors.textSecondary },
  dateInput: { ...typography.body, color: colors.textPrimary, backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.sm, padding: spacing.sm, marginTop: 2 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  timeField: { flex: 1 },
  timeSep: { ...typography.body, color: colors.textSecondary, paddingBottom: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  actionBtn: { flex: 1 },
});
