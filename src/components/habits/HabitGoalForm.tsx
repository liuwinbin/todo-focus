// ============================================================
// HabitGoalForm — 创建/编辑打卡目标表单
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { HABIT_GOAL_CATEGORIES } from '../../types';
import type { HabitGoal, HabitGoalType, HabitGoalCategory } from '../../types';

const ICON_OPTIONS = [
  'fitness-outline', 'walk-outline', 'bed-outline', 'water-outline',
  'book-outline', 'school-outline', 'language-outline', 'musical-notes-outline',
  'briefcase-outline', 'laptop-outline', 'document-text-outline', 'mail-outline',
  'home-outline', 'cafe-outline', 'leaf-outline', 'sunny-outline',
];

const TYPE_OPTIONS: { key: HabitGoalType; label: string; desc: string }[] = [
  { key: 'daily', label: '每日', desc: '每天打卡一次' },
  { key: 'weekly', label: '每周', desc: '每周达成目标次数' },
  { key: 'custom', label: '自定义', desc: '自定义重复周期' },
];

interface HabitGoalFormProps {
  initialData?: HabitGoal;
  onSave: (data: Omit<HabitGoal, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function HabitGoalForm({ initialData, onSave, onCancel }: HabitGoalFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [type, setType] = useState<HabitGoalType>(initialData?.type ?? 'daily');
  const [targetCount, setTargetCount] = useState(String(initialData?.targetCount ?? 1));
  const [periodDays, setPeriodDays] = useState(String(initialData?.periodDays ?? 7));
  const [category, setCategory] = useState<HabitGoalCategory>(initialData?.category ?? 'health');
  const [motivationalMessage, setMotivationalMessage] = useState(initialData?.motivationalMessage ?? '');
  const [icon, setIcon] = useState(initialData?.icon ?? 'fitness-outline');
  const [showIcons, setShowIcons] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      targetCount: Math.max(1, parseInt(targetCount, 10) || 1),
      periodDays: Math.max(1, parseInt(periodDays, 10) || 7),
      category,
      motivationalMessage: motivationalMessage.trim() || undefined,
      color: HABIT_GOAL_CATEGORIES[category].color,
      icon,
      isArchived: false,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 标题 */}
      <Text style={styles.label}>目标名称</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="如：每天阅读 30 分钟"
        placeholderTextColor={colors.textTertiary}
        maxLength={30}
      />

      {/* 描述 */}
      <Text style={styles.label}>描述（可选）</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        placeholder="记录你的目标详情..."
        placeholderTextColor={colors.textTertiary}
        multiline
        numberOfLines={2}
        maxLength={100}
      />

      {/* 类型选择 */}
      <Text style={styles.label}>重复类型</Text>
      <View style={styles.typeRow}>
        {TYPE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setType(opt.key)}
            style={[
              styles.typeBtn,
              type === opt.key && styles.typeBtnActive,
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeBtnText, type === opt.key && styles.typeBtnTextActive]}>
              {opt.label}
            </Text>
            <Text style={styles.typeBtnDesc}>{opt.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 目标次数 */}
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>目标次数</Text>
          <TextInput
            style={styles.input}
            value={targetCount}
            onChangeText={setTargetCount}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>
        {type === 'custom' && (
          <View style={styles.halfField}>
            <Text style={styles.label}>周期（天）</Text>
            <TextInput
              style={styles.input}
              value={periodDays}
              onChangeText={setPeriodDays}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
        )}
      </View>

      {/* 分类 */}
      <Text style={styles.label}>分类</Text>
      <View style={styles.catRow}>
        {(Object.entries(HABIT_GOAL_CATEGORIES) as [HabitGoalCategory, typeof HABIT_GOAL_CATEGORIES[HabitGoalCategory]][]).map(
          ([key, config]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setCategory(key)}
              style={[
                styles.catBtn,
                category === key && { borderColor: config.color, backgroundColor: config.color + '20' },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.catEmoji}>{config.emoji}</Text>
              <Text style={[styles.catLabel, category === key && { color: config.color }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* 图标选择 */}
      <Text style={styles.label}>图标</Text>
      <TouchableOpacity
        onPress={() => setShowIcons(!showIcons)}
        style={styles.iconSelector}
        activeOpacity={0.7}
      >
        <Ionicons name={icon as any} size={24} color={colors.primary} />
        <Text style={styles.iconSelectorText}>点击更换图标</Text>
        <Ionicons name={showIcons ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textTertiary} />
      </TouchableOpacity>

      {showIcons && (
        <View style={styles.iconGrid}>
          {ICON_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => { setIcon(opt); setShowIcons(false); }}
              style={[styles.iconOption, icon === opt && styles.iconOptionActive]}
              activeOpacity={0.7}
            >
              <Ionicons name={opt as any} size={24} color={icon === opt ? colors.primary : colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 激励语 */}
      <Text style={styles.label}>激励语（可选）</Text>
      <TextInput
        style={styles.input}
        value={motivationalMessage}
        onChangeText={setMotivationalMessage}
        placeholder="如：坚持就是胜利！"
        placeholderTextColor={colors.textTertiary}
        maxLength={40}
      />

      {/* 操作按钮 */}
      <View style={styles.actions}>
        <Button title="取消" onPress={onCancel} variant="ghost" size="md" />
        <Button
          title={initialData ? '保存' : '创建目标'}
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
  container: {
    flex: 1,
  },
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
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfField: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.tabBarBorder,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  typeBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  typeBtnText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeBtnTextActive: {
    color: colors.primaryDark,
  },
  typeBtnDesc: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  catRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  catBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.tabBarBorder,
    backgroundColor: colors.surface,
  },
  catEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  catLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  iconSelectorText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  iconOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
