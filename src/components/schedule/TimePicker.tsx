// ============================================================
// TimePicker — 时间选择器（HH:mm 步进按钮）
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface TimePickerProps {
  value: string;       // HH:mm
  onChange: (time: string) => void;
  label: string;
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [hourStr, minuteStr] = value.split(':');
  const hour = parseInt(hourStr, 10) || 0;
  const minute = parseInt(minuteStr, 10) || 0;

  const changeHour = (delta: number) => {
    const h = (hour + delta + 24) % 24;
    onChange(`${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  };

  const changeMinute = (delta: number) => {
    const m = (minute + delta * 5 + 60) % 60;
    onChange(`${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerRow}>
        {/* 小时 */}
        <View style={styles.col}>
          <TouchableOpacity onPress={() => changeHour(1)} style={styles.btn} activeOpacity={0.7}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{String(hour).padStart(2, '0')}</Text>
          </View>
          <TouchableOpacity onPress={() => changeHour(-1)} style={styles.btn} activeOpacity={0.7}>
            <Text style={styles.btnText}>−</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.separator}>:</Text>

        {/* 分钟（步进 5） */}
        <View style={styles.col}>
          <TouchableOpacity onPress={() => changeMinute(1)} style={styles.btn} activeOpacity={0.7}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
          <View style={styles.displayBox}>
            <Text style={styles.displayText}>{String(minute).padStart(2, '0')}</Text>
          </View>
          <TouchableOpacity onPress={() => changeMinute(-1)} style={styles.btn} activeOpacity={0.7}>
            <Text style={styles.btnText}>−</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  col: {
    alignItems: 'center',
    gap: 4,
  },
  btn: {
    width: 36,
    height: 30,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
    lineHeight: 22,
  },
  displayBox: {
    width: 56,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayText: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  separator: {
    ...typography.heading2,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    marginTop: -8,
  },
});
