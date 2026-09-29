import { isRunningInExpoGo } from 'expo';

type NotificationsModule = typeof import('expo-notifications');

// expo-notifications throws on import in Expo Go on Android (SDK 53+), so load it lazily
// and treat reminders as unavailable there. Use a development build to test them.
const isSupported =
  process.env.EXPO_OS !== 'web' && !(process.env.EXPO_OS === 'android' && isRunningInExpoGo());
const Notifications: NotificationsModule | null = isSupported
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('expo-notifications')
  : null;
const CHANNEL_ID = 'habit-reminders';

/** Call once at startup so reminders also show while the app is open. */
export function configureNotifications() {
  if (!Notifications) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/** Asks for permission if needed. Resolves `true` when reminders can be delivered. */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (!Notifications) return false;
  if (process.env.EXPO_OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Habit reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export function parseTime(time: string): { hour: number; minute: number } {
  const [hour, minute] = time.split(':').map(Number);
  return { hour, minute };
}

export function formatTime(time: string): string {
  const { hour, minute } = parseTime(time);
  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Schedules a repeating daily reminder. Returns its id, or null if permission was denied. */
export async function scheduleDailyReminder(habitName: string, time: string): Promise<string | null> {
  if (!Notifications || !(await ensureNotificationPermission())) return null;
  const { hour, minute } = parseTime(time);
  return Notifications.scheduleNotificationAsync({
    content: {
      title: habitName,
      body: 'A small step today keeps your streak alive.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelReminder(id: string | null) {
  if (!Notifications || !id) return;
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}

export async function cancelAllReminders() {
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
