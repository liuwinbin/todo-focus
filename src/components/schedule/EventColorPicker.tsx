// ============================================================
// EventColorPicker — 6 色标签选择器
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { EVENT_COLORS, EVENT_COLOR_LABELS, type EventColor } from '../../types';

interface EventColorPickerProps {
  selected: EventColor;
  onSelect: (color: EventColor) => void;
}

const COLOR_ENTRIES = Object.keys(EVENT_COLORS) as EventColor[];

export function EventColorPicker({ selected, onSelect }: EventColorPickerProps) {
  return (
    <View style={styles.row}>
      {COLOR_ENTRIES.map((key) => {
        const hex = EVENT_COLORS[key];
        const isSelected = selected === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key)}
            style={[styles.swatch, { backgroundColor: hex }, isSelected && styles.swatchSelected]}
            activeOpacity={0.7}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={18} color={colors.textInverse} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// 导出供其他组件使用
export { EVENT_COLORS, EVENT_COLOR_LABELS, COLOR_ENTRIES };

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
  },
});
