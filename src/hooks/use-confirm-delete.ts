import { Alert } from 'react-native';

import type { Habit } from '@/types/habit';

import { useHabitActions } from './use-habit-actions';

/** Returns a function that asks for confirmation, then deletes the habit and its history. */
export function useConfirmDeleteHabit() {
  const { deleteHabit } = useHabitActions();

  return (habit: Habit, onDeleted?: () => void) => {
    Alert.alert(`Delete “${habit.name}”?`, 'Its full history will be removed from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteHabit(habit);
          onDeleted?.();
        },
      },
    ]);
  };
}
