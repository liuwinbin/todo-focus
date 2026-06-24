// ============================================================
// TimeLogForm — 时间日志录入/编辑表单
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityCategorySelector } from './ActivityCategorySelector';
import { Button } from '../ui/Button';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { QUICK_TIME_TEMPLATES, TIME_LOG_CATEGORIES } from '../../types';
import type { TimeLogEntry, TimeLogCategory } from '../../types';

interface TimeLogFormProps {
  initialData?: TimeLogEntry;
  onSave: (data: Omit<TimeLogEntry, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function TimeLogForm({ initialData, onSave, onCancel }: TimeLogFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [category, setCategory] = useState<TimeLogCategory>(initialData?.category ?? 'work');
  const [durationMinutes, setDurationMinutes] = useState(String(initialData?.durationMinutes ?? 30));
  const [note, setNote] = useState(initialData?.note ?? '');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      category,
      durationMinutes: Math.max(1, parseInt(durationMinutes, 10) || 30),
      note: note.trim() || undefined,
      startedAt: initialData?.startedAt ?? new Date().toISOString(),
      endedAt: undefined,
    });
  };

  const applyTemplate = (tmpl: typeof QUICK_TIME_TEMPLATES[number]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setDurationMinutes(String(tmpl.durationMinutes));
    setShowTemplates(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 标题 */}
      <Text style={styles.label}>活动名称</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="如：写代码、开会、阅读..."
        placeholderTextColor={colors.textTertiary}
        maxLength={30}
      />

      {/* 分类 */}
      <Text style={styles.label}>分类</Text>
      <ActivityCategorySelector selected={category} onSelect={setCategory} />

      {/* 时长 */}
      <Text style={styles.label}>时长（分钟）</Text>
      <View style={styles.durationRow}>
        {[15, 30, 45, 60, 90, 120].map((min) => (
          <TouchableOpacity
            key={min}
            onPress={() => setDurationMinutes(String(min))}
            style={[
              styles.durationChip,
              parseInt(durationMinutes, 10) === min && styles.durationChipActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.durationChipText,
                parseInt(durationMinutes, 10) === min && styles.durationChipTextActive,
              ]}
            >
              {min >= 60 ? `${min / 60}h` : `${min}m`}
            </Text>
          </TouchableOpacity>
        ))}
        <TextInput
          style={[styles.input, styles.durationInput]}
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="自定义"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      {/* 备注 */}
      <Text style={styles.label}>备注（可选）</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={note}
        onChangeText={setNote}
        placeholder="添加备注..."
        placeholderTextColor={colors.textTertiary}
        multiline
        numberOfLines={2}
        maxLength={100}
      />

      {/* 快捷模板 */}
      <TouchableOpacity
        onPress={() => setShowTemplates(!showTemplates)}
        style={styles.templateToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.templateToggleText}>📋 快捷模板</Text>
        <Text style={styles.templateToggleArrow}>{showTemplates ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {showTemplates && (
        <View style={styles.templateGrid}>
          {QUICK_TIME_TEMPLATES.map((tmpl, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => applyTemplate(tmpl)}
              style={styles.templateChip}
              activeOpacity={0.7}
            >
              <Text style={styles.templateText}>
                {TIME_LOG_CATEGORIES[tmpl.category]?.emoji} {tmpl.title} ({tmpl.durationMinutes}m)
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 操作 */}
      <View style={styles.actions}>
        <Button title="取消" onPress={onCancel} variant="ghost" size="md" />
        <Button
          title={initialData ? '保存' : '记录'}
          onPress={handleSave}
          variant="primary"
          size="md"
          disabled={!title.trim()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  textarea: {
    minHeight: 56,
    textAlignVertical: 'top',
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  durationChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  durationChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  durationChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  durationChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  durationInput: {
    width: 80,
    textAlign: 'center',
  },
  templateToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  templateToggleText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  templateToggleArrow: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  templateChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryBg,
  },
  templateText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
