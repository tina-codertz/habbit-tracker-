import * as Notifications from 'expo-notifications';

const isSupported = process.env.EXPO_OS !== 'web';
const CHANNEL_ID = 'habit-reminders';

/** Call once at startup so reminders also show while the app is open. */
export function configureNotifications() {
  if (!isSupported) return;
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
  if (!isSupported) return false;
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
  if (!(await ensureNotificationPermission())) return null;
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
  if (!isSupported || !id) return;
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}

export async function cancelAllReminders() {
  if (!isSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
