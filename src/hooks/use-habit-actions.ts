import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

import { notifyDataChanged } from '@/db/events';
import * as repo from '@/db/habits-repository';
import type { DateKey } from '@/lib/dates';
import { cancelAllReminders, cancelReminder, scheduleDailyReminder } from '@/lib/notifications';
import type { Habit, HabitInput } from '@/types/habit';

function feedback(style: 'light' | 'success') {
  if (process.env.EXPO_OS !== 'ios') return;
  if (style === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** All habit writes go through here so reminders, haptics and live queries stay in sync. */
export function useHabitActions() {
  const db = useSQLiteContext();

  async function syncReminder(habit: Pick<Habit, 'id' | 'name' | 'notificationId'>, time: string | null) {
    await cancelReminder(habit.notificationId);
    const notificationId = time ? await scheduleDailyReminder(habit.name, time) : null;
    await repo.setNotificationId(db, habit.id, notificationId);
    if (time && !notificationId && process.env.EXPO_OS !== 'web') {
      Alert.alert('Reminders are off', 'Allow notifications for this app in Settings to get daily reminders.');
    }
    return notificationId;
  }

  return {
    async createHabit(input: HabitInput) {
      const habit = await repo.insertHabit(db, input);
      if (input.reminderTime) await syncReminder(habit, input.reminderTime);
      notifyDataChanged();
      return habit;
    },

    async updateHabit(habit: Habit, input: HabitInput) {
      await repo.updateHabit(db, habit.id, input);
      const reminderChanged =
        input.reminderTime !== habit.reminderTime || (input.reminderTime && input.name !== habit.name);
      if (reminderChanged) await syncReminder({ ...habit, name: input.name }, input.reminderTime);
      notifyDataChanged();
    },

    async deleteHabit(habit: Habit) {
      await cancelReminder(habit.notificationId);
      await repo.deleteHabit(db, habit.id);
      notifyDataChanged();
    },

    async deleteEverything() {
      await cancelAllReminders();
      await repo.deleteAllData(db);
      notifyDataChanged();
    },

    /** Sets the count logged for a day, clamped between 0 and the goal. */
    async setCount(habit: Habit, date: DateKey, count: number) {
      const next = Math.max(0, Math.min(habit.goal, count));
      await repo.setEntryCount(db, habit.id, date, next);
      feedback(next >= habit.goal ? 'success' : 'light');
      notifyDataChanged();
    },
  };
}
