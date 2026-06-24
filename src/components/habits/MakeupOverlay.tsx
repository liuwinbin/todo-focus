// ============================================================
// MakeupOverlay — 补卡面板
// ============================================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatFriendlyDate } from '../../utils/dates';

interface MakeupOverlayProps {
  visible: boolean;
  makeupDates: string[];
  onMakeup: (date: string, note?: string) => void;
  onClose: () => void;
}

export function MakeupOverlay({ visible, makeupDates, onMakeup, onClose }: MakeupOverlayProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (selectedDate) {
      onMakeup(selectedDate, note.trim() || undefined);
      setSelectedDate(null);
      setNote('');
    }
  };

  const handleClose = () => {
    setSelectedDate(null);
    setNote('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Card style={styles.panel}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.title}>📅 补卡</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            选择需要补卡的日期（最近 7 天未打卡日期）
          </Text>

          {/* 日期列表 */}
          {makeupDates.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="checkmark-circle-outline" size={32} color={colors.success} />
              <Text style={styles.emptyText}>最近 7 天全部已打卡 🎉</Text>
            </View>
          ) : (
            <View style={styles.dateList}>
              {makeupDates.map((date) => (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  style={[
                    styles.dateItem,
                    selectedDate === date && styles.dateItemSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={selectedDate === date ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={selectedDate === date ? colors.primary : colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === date && styles.dateTextSelected,
                    ]}
                  >
                    {formatFriendlyDate(date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 备注 */}
          {selectedDate && (
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="添加补卡备注（可选）"
              placeholderTextColor={colors.textTertiary}
              maxLength={50}
            />
          )}

          {/* 操作 */}
          <View style={styles.actions}>
            <Button title="取消" onPress={handleClose} variant="ghost" size="sm" />
            <Button
              title="确认补卡"
              onPress={handleConfirm}
              variant="primary"
              size="sm"
              disabled={!selectedDate}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  dateList: {
    gap: spacing.sm,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  dateItemSelected: {
    backgroundColor: colors.primaryBg,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  dateTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  noteInput: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});
