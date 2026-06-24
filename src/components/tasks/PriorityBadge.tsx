// ============================================================
// PriorityBadge — 优先级标签
// ============================================================
import React from 'react';
import { PillBadge } from '../ui/PillBadge';
import { colors } from '../../constants/theme';
import type { Priority } from '../../types';

const priorityConfig: Record<Priority, { label: string; bg: string; text: string }> = {
  high: { label: '� 高', bg: colors.priorityHigh + '30', text: colors.priorityHigh },
  medium: { label: '中', bg: colors.priorityMedium + '30', text: '#C4A43A' },
  low: { label: '低', bg: colors.priorityLow + '30', text: '#6B9A6B' },
};

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <PillBadge
      label={config.label}
      backgroundColor={config.bg}
      color={config.text}
      size="sm"
    />
  );
}
