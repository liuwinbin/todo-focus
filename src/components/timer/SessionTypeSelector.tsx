// ============================================================
// SessionTypeSelector — 专注/短休息/长休息 切换器
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import type { SessionType } from '../../types';

interface SessionTypeSelectorProps {
  selected: SessionType;
  onSelect: (type: SessionType) => void;
  disabled?: boolean;
}

const options: { type: SessionType; label: string; emoji: string; color: string }[] = [
  { type: 'focus', label: '专注', emoji: '🍅', color: colors.primary },
  { type: 'shortBreak', label: '短休息', emoji: '☕', color: colors.info },
  { type: 'longBreak', label: '长休息', emoji: '🌿', color: colors.success },
];

export function SessionTypeSelector({
  selected,
  onSelect,
  disabled = false,
}: SessionTypeSelectorProps) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isActive = selected === opt.type;
        return (
          <TouchableOpacity
            key={opt.type}
            onPress={() => onSelect(opt.type)}
            disabled={disabled}
            activeOpacity={0.7}
            style={[
              styles.option,
              isActive && { backgroundColor: opt.color + '20', borderColor: opt.color },
            ]}
          >
            <Text style={styles.emoji}>{opt.emoji}</Text>
            <Text
              style={[
                styles.label,
                isActive && { color: opt.color, fontWeight: '600' },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  emoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
