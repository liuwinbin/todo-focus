// ============================================================
// TaskMemoInput — 备忘录编辑器
// ============================================================
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface TaskMemoInputProps {
  value: string;
  onChange: (text: string) => void;
}

export function TaskMemoInput({ value, onChange }: TaskMemoInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>📝 备忘录</Text>
      <TextInput
        style={styles.input}
        placeholder="添加备注说明..."
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChange}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    minHeight: 80,
    fontSize: 14,
    lineHeight: 20,
  },
});
