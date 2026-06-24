// ============================================================
// SubtaskItem — 子任务行
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
import type { Subtask } from '../../types';

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
}

export function SubtaskItem({ subtask, onToggle, onDelete }: SubtaskItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} style={styles.checkRow} activeOpacity={0.6}>
        <Ionicons
          name={subtask.completed ? 'checkbox' : 'square-outline'}
          size={20}
          color={subtask.completed ? colors.success : colors.textTertiary}
        />
        <Text style={[styles.title, subtask.completed && styles.completed]}>
          {subtask.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} hitSlop={8}>
        <Ionicons name="close-outline" size={18} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
});
