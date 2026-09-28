import { getEntryIndex, getHabit, listHabits } from '@/db/habits-repository';
import type { DayCounts } from '@/types/habit';

import { useLiveQuery } from './use-live-query';

const EMPTY_COUNTS: DayCounts = new Map();

export function useHabits() {
  return useLiveQuery('habits', listHabits);
}

export function useHabit(id: string) {
  return useLiveQuery(`habit:${id}`, (db) => getHabit(db, id));
}

/** Every logged entry, indexed by habit then day. Small enough to hold in memory for a personal tracker. */
export function useEntryIndex() {
  return useLiveQuery('entries', getEntryIndex);
}

export function useHabitCounts(habitId: string): DayCounts {
  const { data } = useEntryIndex();
  return data?.get(habitId) ?? EMPTY_COUNTS;
}
