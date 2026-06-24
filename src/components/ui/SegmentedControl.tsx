// ============================================================
// SegmentedControl — 通用分段控制器
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface Segment<T extends string> {
  value: T;
  label: string;
  icon?: string; // Ionicon name
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {segments.map((seg) => {
        const isActive = seg.value === value;
        return (
          <TouchableOpacity
            key={seg.value}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => onChange(seg.value)}
            activeOpacity={0.7}
          >
            {seg.icon && (
              <Ionicons
                name={seg.icon as any}
                size={16}
                color={isActive ? colors.primary : colors.textSecondary}
              />
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {seg.label}
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
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    ...({
      shadowColor: '#4A4458',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    } as any),
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
