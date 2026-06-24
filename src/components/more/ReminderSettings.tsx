// ============================================================
// ReminderSettings — 每日提醒设置
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { scheduleDailyReminder, cancelAllReminders, requestNotificationPermission } from '../../utils/notifications';

interface ReminderSettingsProps {
  enabled: boolean;
  time: string;
  onToggle: (enabled: boolean) => void;
  onTimeChange: (time: string) => void;
}

const TIME_PRESETS = ['07:00', '08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '21:00'];

export function ReminderSettings({ enabled, time, onToggle, onTimeChange }: ReminderSettingsProps) {
  const [requesting, setRequesting] = useState(false);

  const handleToggle = async (value: boolean) => {
    if (value) {
      setRequesting(true);
      const granted = await requestNotificationPermission();
      setRequesting(false);

      if (!granted) {
        Alert.alert('权限不足', '请在系统设置中开启通知权限');
        return;
      }

      onToggle(true);
      scheduleDailyReminder(time);
    } else {
      onToggle(false);
      cancelAllReminders();
    }
  };

  const handleTimeSelect = (t: string) => {
    onTimeChange(t);
    if (enabled) {
      scheduleDailyReminder(t);
    }
  };

  return (
    <Card style={styles.card} padding={spacing.md}>
      {/* 开关 */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.title}>每日专注提醒</Text>
          <Text style={styles.subtitle}>到时间提醒你开始专注</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          disabled={requesting}
          trackColor={{ false: colors.tabBarBorder, true: colors.primaryLight }}
          thumbColor={enabled ? colors.primary : '#f4f3f4'}
        />
      </View>

      {/* 时间选择 */}
      {enabled && (
        <>
          <View style={styles.divider} />
          <Text style={styles.currentTime}>
            提醒时间：<Text style={styles.timeBold}>{time}</Text>
          </Text>
          <View style={styles.timeGrid}>
            {TIME_PRESETS.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => handleTimeSelect(t)}
                style={[styles.timeChip, time === t && styles.timeChipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeChipText, time === t && styles.timeChipTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.tabBarBorder,
  },
  currentTime: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timeBold: {
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 18,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  timeChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  timeChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  timeChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  timeChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
