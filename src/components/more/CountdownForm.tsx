// ============================================================
// CountdownForm — 倒数日编辑表单
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, Switch, Platform,
} from 'react-native';
import { Button } from '../ui/Button';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import {
  COUNTDOWN_TYPES,
  COUNTDOWN_TYPE_CONFIG,
} from '../../types';
import type { CountdownItem, CountdownType } from '../../types';

const EMOJI_OPTIONS = ['🎂', '💝', '📝', '✈️', '⭐', '🎓', '💍', '🎄', '🎃', '🎁', '🏆', '🌈'];

const PRESET_COLORS = [
  '#C3B1E1', '#FFB347', '#A4C8E8', '#F4A4A4',
  '#77DD77', '#FFDAB9', '#B2C9AB', '#E8A4A4',
];

interface CountdownFormProps {
  initialData?: CountdownItem;
  onSave: (data: Omit<CountdownItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function CountdownForm({ initialData, onSave, onCancel }: CountdownFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [type, setType] = useState<CountdownType>(initialData?.type ?? 'custom');
  const [icon, setIcon] = useState(initialData?.icon ?? '⭐');
  const [color, setColor] = useState(initialData?.color ?? '#C3B1E1');
  const [note, setNote] = useState(initialData?.note ?? '');
  const [isRepeatYearly, setIsRepeatYearly] = useState(initialData?.isRepeatYearly ?? false);
  const [dateText, setDateText] = useState(
    initialData?.targetDate
      ? initialData.targetDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      targetDate: new Date(dateText).toISOString(),
      type,
      icon,
      color,
      note: note.trim() || undefined,
      isRepeatYearly,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 标题 */}
      <Text style={styles.label}>名称</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="如：考研倒计时、生日..."
        placeholderTextColor={colors.textTertiary}
        maxLength={20}
      />

      {/* 类型 */}
      <Text style={styles.label}>类型</Text>
      <View style={styles.chipRow}>
        {COUNTDOWN_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setType(t)}
            style={[styles.chip, type === t && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>
              {COUNTDOWN_TYPE_CONFIG[t].emoji} {COUNTDOWN_TYPE_CONFIG[t].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 日期 */}
      <Text style={styles.label}>目标日期</Text>
      <TextInput
        style={styles.input}
        value={dateText}
        onChangeText={setDateText}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.textTertiary}
        maxLength={10}
      />

      {/* 图标 */}
      <Text style={styles.label}>图标</Text>
      <View style={styles.chipRow}>
        {EMOJI_OPTIONS.map((e) => (
          <TouchableOpacity
            key={e}
            onPress={() => setIcon(e)}
            style={[styles.emojiChip, icon === e && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={styles.emojiText}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 颜色 */}
      <Text style={styles.label}>卡片颜色</Text>
      <View style={styles.chipRow}>
        {PRESET_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.colorChip,
              { backgroundColor: c },
              color === c && styles.colorChipActive,
            ]}
            activeOpacity={0.7}
          />
        ))}
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
        maxLength={60}
      />

      {/* 每年重复 */}
      <View style={styles.toggleRow}>
        <Text style={styles.label}>每年重复</Text>
        <Switch
          value={isRepeatYearly}
          onValueChange={setIsRepeatYearly}
          trackColor={{ false: colors.tabBarBorder, true: colors.primaryLight }}
          thumbColor={isRepeatYearly ? colors.primary : '#f4f3f4'}
        />
      </View>

      {/* 操作 */}
      <View style={styles.actions}>
        <Button title="取消" onPress={onCancel} variant="ghost" size="md" />
        <Button title="保存" onPress={handleSave} variant="primary" size="md" disabled={!title.trim()} />
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  chipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  emojiChip: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  colorChip: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorChipActive: {
    borderColor: colors.primaryDark,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
