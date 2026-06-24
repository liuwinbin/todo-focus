// ============================================================
// Type declarations for expo-notifications (lightweight stubs)
// The actual module is loaded via dynamic import() at runtime
// ============================================================

declare module 'expo-notifications' {
  export interface NotificationContent {
    title?: string;
    body?: string;
    subtitle?: string;
    sound?: boolean | string;
    data?: Record<string, unknown>;
  }

  export interface DailyTriggerInput {
    type: 'daily';
    hour: number;
    minute: number;
  }

  export interface DateTriggerInput {
    type: 'date';
    date: Date;
  }

  export type NotificationTriggerInput = DailyTriggerInput | DateTriggerInput;

  export interface NotificationRequestInput {
    content: NotificationContent;
    trigger: NotificationTriggerInput;
  }

  export interface PermissionStatus {
    status: 'granted' | 'denied' | 'undetermined';
    granted?: boolean;
  }

  export function getPermissionsAsync(): Promise<PermissionStatus>;
  export function requestPermissionsAsync(): Promise<PermissionStatus>;
  export function scheduleNotificationAsync(request: NotificationRequestInput): Promise<string>;
  export function cancelScheduledNotificationAsync(identifier: string): Promise<void>;
  export function cancelAllScheduledNotificationsAsync(): Promise<void>;
  export function getAllScheduledNotificationsAsync(): Promise<Array<{
    identifier: string;
    content: NotificationContent;
    trigger: NotificationTriggerInput;
  }>>;
  export function setNotificationHandler(handler: {
    handleNotification: () => Promise<{ shouldShowAlert: boolean; shouldPlaySound: boolean; shouldSetBadge: boolean }>;
  }): void;
}
