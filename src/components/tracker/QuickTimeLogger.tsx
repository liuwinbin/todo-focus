// ============================================================
// QuickTimeLogger — 快捷时间记录器（一键记录）
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { QUICK_TIME_TEMPLATES, TIME_LOG_CATEGORIES } from '../../types';
import type { TimeLogEntry } from '../../types';

interface QuickTimeLoggerProps {
  onQuickLog: (data: Omit<TimeLogEntry, 'id' | 'createdAt'>) => void;
  onCustomLog: () => void;
}

export function QuickTimeLogger({ onQuickLog, onCustomLog }: QuickTimeLoggerProps) {
  // 取常用的 6 个模板
  const quickTemplates = QUICK_TIME_TEMPLATES.slice(0, 6);

  return (
    <Card style={styles.container} padding={0}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="time-outline" size={18} color={colors.primary} />
          <Text style={styles.headerTitle}>快速记录</Text>
        </View>
        <TouchableOpacity onPress={onCustomLog} activeOpacity={0.7}>
          <Text style={styles.customBtn}>+ 自定义</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {quickTemplates.map((tmpl, i) => {
          const catConfig = TIME_LOG_CATEGORIES[tmpl.category];
          return (
            <TouchableOpacity
              key={i}
              onPress={() =>
                onQuickLog({
                  title: tmpl.title,
                  category: tmpl.category,
                  durationMinutes: tmpl.durationMinutes,
                  startedAt: new Date().toISOString(),
                })
              }
              style={styles.chip}
              activeOpacity={0.7}
            >
              <Text style={styles.chipEmoji}>{catConfig.emoji}</Text>
              <Text style={styles.chipTitle}>{tmpl.title}</Text>
              <Text style={styles.chipDuration}>{tmpl.durationMinutes}m</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  customBtn: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
  },
  chipRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
    minWidth: 80,
  },
  chipEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  chipTitle: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  chipDuration: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
});
