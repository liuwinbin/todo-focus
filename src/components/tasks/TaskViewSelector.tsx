// ============================================================
// TaskViewSelector — 任务视图切换器（列表/日/周/四象限）
// ============================================================
import React from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import type { TaskView } from '../../types';

interface TaskViewSelectorProps {
  value: TaskView;
  onChange: (view: TaskView) => void;
}

const VIEW_SEGMENTS: { value: TaskView; label: string; icon: string }[] = [
  { value: 'list', label: '列表', icon: 'list-outline' },
  { value: 'day', label: '日', icon: 'today-outline' },
  { value: 'week', label: '周', icon: 'calendar-outline' },
  { value: 'quadrant', label: '四象限', icon: 'grid-outline' },
];

export function TaskViewSelector({ value, onChange }: TaskViewSelectorProps) {
  return <SegmentedControl segments={VIEW_SEGMENTS} value={value} onChange={onChange} />;
}
