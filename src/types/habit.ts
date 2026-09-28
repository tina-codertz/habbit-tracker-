import type { DateKey } from '@/lib/dates';
import type { HabitColorName } from '@/theme';
import type { HabitIconName } from '@/constants/habit-icons';

export type Habit = {
  id: string;
  name: string;
  icon: HabitIconName;
  color: HabitColorName;
  /** Daily target. `1` means a simple done / not-done habit. */
  goal: number;
  /** Unit label for count habits, e.g. "glasses". */
  unit: string | null;
  /** Local reminder time as `HH:mm`, or null when off. */
  reminderTime: string | null;
  notificationId: string | null;
  sortOrder: number;
  createdAt: DateKey;
};

export type HabitInput = Pick<Habit, 'name' | 'icon' | 'color' | 'goal' | 'unit' | 'reminderTime'>;

/** Count logged per day for one habit. */
export type DayCounts = Map<DateKey, number>;

/** Every habit's day counts, keyed by habit id. */
export type EntryIndex = Map<string, DayCounts>;
