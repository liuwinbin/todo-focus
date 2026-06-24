// ============================================================
// 通知工具 — 基于 expo-notifications 的本地通知调度
// ============================================================
import type { CountdownItem } from '../types';

/** 检查通知权限并请求 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    // 动态导入 expo-notifications，避免模块未安装时报错
    const { getPermissionsAsync, requestPermissionsAsync } = await import('expo-notifications');
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch {
    return false;
  }
}

/** 调度每日提醒通知 */
export async function scheduleDailyReminder(time: string): Promise<string | null> {
  try {
    const { scheduleNotificationAsync } = await import('expo-notifications');
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (isNaN(hour) || isNaN(minute)) return null;

    // 取消之前的每日提醒
    await cancelAllReminders();

    const id = await scheduleNotificationAsync({
      content: {
        title: '⏰ 专注时间到！',
        body: '别忘了今天的专注目标，加油！',
        sound: true,
      },
      trigger: {
        type: 'daily',
        hour,
        minute,
      },
    });

    return id;
  } catch {
    return null;
  }
}

/** 为倒数日设置提醒（前一天通知） */
export async function scheduleCountdownReminder(item: CountdownItem): Promise<string | null> {
  try {
    const { scheduleNotificationAsync } = await import('expo-notifications');
    const target = new Date(item.targetDate);
    // 提前一天 9:00 提醒
    const triggerDate = new Date(target);
    triggerDate.setDate(triggerDate.getDate() - 1);
    triggerDate.setHours(9, 0, 0, 0);

    // 如果触发时间已过，跳过
    if (triggerDate.getTime() <= Date.now()) return null;

    const id = await scheduleNotificationAsync({
      content: {
        title: `📅 ${item.title}`,
        body: `明天就是${item.icon} ${item.title} 啦！`,
        sound: true,
      },
      trigger: {
        type: 'date',
        date: triggerDate,
      },
    });

    return id;
  } catch {
    return null;
  }
}

/** 取消所有已调度的通知 */
export async function cancelAllReminders(): Promise<void> {
  try {
    const { cancelAllScheduledNotificationsAsync } = await import('expo-notifications');
    await cancelAllScheduledNotificationsAsync();
  } catch {
    // 静默失败
  }
}

/** 取消特定通知 */
export async function cancelNotification(id: string): Promise<void> {
  try {
    const { cancelScheduledNotificationAsync } = await import('expo-notifications');
    await cancelScheduledNotificationAsync(id);
  } catch {
    // 静默失败
  }
}

/** 为任务截止日期设置提醒（到期当天 9:00） */
export async function scheduleTaskDueReminder(
  taskId: string,
  taskTitle: string,
  dueDate: string,
): Promise<string | null> {
  try {
    const { scheduleNotificationAsync } = await import('expo-notifications');
    const due = new Date(dueDate);
    due.setHours(9, 0, 0, 0);

    // 如果截止时间已过，跳过
    if (due.getTime() <= Date.now()) return null;

    const id = await scheduleNotificationAsync({
      content: {
        title: `📋 任务到期提醒`,
        body: `「${taskTitle}」今天截止！`,
        sound: true,
        data: { taskId },
      },
      trigger: {
        type: 'date',
        date: due,
      },
    });

    return id;
  } catch {
    return null;
  }
}

/** 为习惯打卡设置每日提醒 */
export async function scheduleHabitReminder(habitTitle: string, time: string): Promise<string | null> {
  try {
    const { scheduleNotificationAsync } = await import('expo-notifications');
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (isNaN(hour) || isNaN(minute)) return null;

    const id = await scheduleNotificationAsync({
      content: {
        title: '✅ 打卡提醒',
        body: `别忘了完成「${habitTitle}」的打卡哦！`,
        sound: true,
      },
      trigger: {
        type: 'daily',
        hour,
        minute,
      },
    });

    return id;
  } catch {
    return null;
  }
}
