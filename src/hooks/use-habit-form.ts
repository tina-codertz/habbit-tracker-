import { useState } from 'react';

import type { HabitIconName } from '@/constants/habit-icons';
import type { HabitColorName } from '@/theme';
import type { Habit, HabitInput } from '@/types/habit';

export const MAX_GOAL = 99;

export type HabitFormState = {
  name: string;
  icon: HabitIconName;
  color: HabitColorName;
  goal: number;
  unit: string;
  reminderEnabled: boolean;
  reminderTime: Date;
};

function initialState(habit?: Habit | null): HabitFormState {
  const reminder = new Date();
  const [h, m] = (habit?.reminderTime ?? '09:00').split(':').map(Number);
  reminder.setHours(h, m, 0, 0);
  return {
    name: habit?.name ?? '',
    icon: habit?.icon ?? 'star',
    color: habit?.color ?? 'lilac',
    goal: habit?.goal ?? 1,
    unit: habit?.unit ?? '',
    reminderEnabled: !!habit?.reminderTime,
    reminderTime: reminder,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Form state for creating or editing a habit, independent of how it's rendered. */
export function useHabitForm(habit?: Habit | null) {
  const [values, setValues] = useState(() => initialState(habit));

  const set = <K extends keyof HabitFormState>(key: K, value: HabitFormState[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const toInput = (): HabitInput => ({
    name: values.name.trim(),
    icon: values.icon,
    color: values.color,
    goal: values.goal,
    unit: values.goal > 1 && values.unit.trim() ? values.unit.trim() : null,
    reminderTime: values.reminderEnabled
      ? `${pad(values.reminderTime.getHours())}:${pad(values.reminderTime.getMinutes())}`
      : null,
  });

  return { values, set, toInput, isValid: values.name.trim().length > 0 };
}

export type HabitForm = ReturnType<typeof useHabitForm>;
