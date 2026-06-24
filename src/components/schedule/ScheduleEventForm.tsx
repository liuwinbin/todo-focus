// ============================================================
// ScheduleEventForm — 添加/编辑日程事件表单
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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { EventColorPicker } from './EventColorPicker';
import { TimePicker } from './TimePicker';

import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatFriendlyDate } from '../../utils/dates';
import type { EventColor } from '../../types';

interface ScheduleEventFormProps {
  initialDate?: string;
  initialData?: {
    id: string;
    title: string;
    date: string;
    startTime?: string;
    endTime?: string;
    allDay: boolean;
    color: EventColor;
    taskId?: string;
    notes?: string;
  };
  onSave: (data: {
    title: string;
    date: string;
    startTime?: string;
    endTime?: string;
    allDay: boolean;
    color: EventColor;
    taskId?: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ScheduleEventForm({
  initialDate,
  initialData,
  onSave,
  onCancel,
  onDelete,
}: ScheduleEventFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || initialDate || '');
  const [allDay, setAllDay] = useState(initialData?.allDay ?? false);
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '10:00');
  const [color, setColor] = useState<EventColor>(initialData?.color || 'lavender');
  const [taskId, setTaskId] = useState<string | undefined>(initialData?.taskId);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSave = () => {
    if (!title.trim() || !date) return;
    onSave({
      title: title.trim(),
      date,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      allDay,
      color,
      taskId,
      notes: notes.trim() || undefined,
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
        {/* 事件名称 */}
        <SectionHeader title="事件名称" />
        <TextInput
          style={styles.titleInput}
          placeholder="我要做什么？"
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* 日期 */}
        <SectionHeader title="日期" />
        <TouchableOpacity style={styles.dateDisplay} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <Text style={styles.dateText}>
            {date ? formatFriendlyDate(date) : '选择日期'}
          </Text>
        </TouchableOpacity>

        {/* 全天开关 */}
        <SectionHeader title="时间" />
        <View style={styles.allDayRow}>
          <Text style={styles.allDayLabel}>全天事件</Text>
          <Switch
            value={allDay}
            onValueChange={setAllDay}
            trackColor={{ false: colors.tabBarBorder, true: colors.primaryLight }}
            thumbColor={allDay ? colors.primary : colors.textTertiary}
          />
        </View>

        {/* 时间选择 */}
        {!allDay && (
          <View style={styles.timeSection}>
            <TimePicker label="开始时间" value={startTime} onChange={setStartTime} />
            <TimePicker label="结束时间" value={endTime} onChange={setEndTime} />
          </View>
        )}

        {/* 颜色标签 */}
        <SectionHeader title="颜色标签" />
        <EventColorPicker selected={color} onSelect={setColor} />

        {/* 备注 */}
        <SectionHeader title="备注（可选）" />
        <TextInput
          style={styles.notesInput}
          placeholder="添加备注..."
          placeholderTextColor={colors.textTertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* 操作按钮 */}
        <View style={styles.actions}>
          <Button title="取消" onPress={onCancel} variant="outline" size="lg" style={styles.actionBtn} />
          <Button
            title="保存"
            onPress={handleSave}
            variant="primary"
            size="lg"
            style={styles.actionBtn}
            disabled={!title.trim() || !date}
          />
        </View>

        {/* 删除按钮（编辑模式） */}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.deleteText}>删除事件</Text>
          </TouchableOpacity>
        )}
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
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  dateText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  allDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  allDayLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  timeSection: {
    marginBottom: spacing.lg,
  },
  notesInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    minHeight: 80,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionBtn: {
    flex: 1,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  deleteText: {
    ...typography.body,
    color: colors.error,
  },
});
