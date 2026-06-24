export type SessionType = 'focus' | 'shortBreak' | 'longBreak';

export interface FocusSession {
  id: string;
  type: SessionType;
  plannedDuration: number;    // 秒
  actualDuration: number;     // 秒
  completed: boolean;
  startedAt: string;          // ISO 8601
  completedAt?: string;
  taskId?: string;            // 关联任务
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  sessionType: SessionType;
  totalSeconds: number;
  remainingSeconds: number;
  startTimestamp: number | null;   // Date.now()
}
