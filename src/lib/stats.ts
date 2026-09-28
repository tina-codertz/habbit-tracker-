import type { DayCounts, EntryIndex, Habit } from '@/types/habit';

import { addDaysToKey, daysBetween, todayKey, type DateKey } from './dates';

export function progressRatio(count: number, goal: number): number {
  return goal <= 0 ? 0 : Math.min(1, count / goal);
}

export function isComplete(count: number | undefined, goal: number): boolean {
  return (count ?? 0) >= goal;
}

/**
 * Consecutive completed days ending today. If today isn't done yet the streak
 * still counts from yesterday, so it doesn't "break" until the day is over.
 */
export function currentStreak(counts: DayCounts, goal: number, today = todayKey()): number {
  let day = isComplete(counts.get(today), goal) ? today : addDaysToKey(today, -1);
  let streak = 0;
  while (isComplete(counts.get(day), goal)) {
    streak += 1;
    day = addDaysToKey(day, -1);
  }
  return streak;
}

export function bestStreak(counts: DayCounts, goal: number): number {
  const days = [...counts.entries()]
    .filter(([, count]) => isComplete(count, goal))
    .map(([day]) => day)
    .sort();
  let best = 0;
  let run = 0;
  let prev: DateKey | null = null;
  for (const day of days) {
    run = prev && daysBetween(prev, day) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

export function totalCompletions(counts: DayCounts, goal: number): number {
  let total = 0;
  for (const count of counts.values()) if (isComplete(count, goal)) total += 1;
  return total;
}

/** Share of days completed within the last `windowDays`, never counting days before the habit existed. */
export function completionRate(
  counts: DayCounts,
  goal: number,
  createdAt: DateKey,
  windowDays = 30,
  today = todayKey(),
): number {
  const windowStart = addDaysToKey(today, -(windowDays - 1));
  const start = createdAt > windowStart ? createdAt : windowStart;
  const span = daysBetween(start, today) + 1;
  if (span <= 0) return 0;
  let done = 0;
  for (let i = 0; i < span; i++) {
    if (isComplete(counts.get(addDaysToKey(start, i)), goal)) done += 1;
  }
  return done / span;
}

export type HabitStats = {
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  totalCompletions: number;
};

export function habitStats(habit: Habit, counts: DayCounts, today = todayKey()): HabitStats {
  return {
    currentStreak: currentStreak(counts, habit.goal, today),
    bestStreak: bestStreak(counts, habit.goal),
    completionRate: completionRate(counts, habit.goal, habit.createdAt, 30, today),
    totalCompletions: totalCompletions(counts, habit.goal),
  };
}

/**
 * Average progress across all habits that existed on `day`.
 * Returns null when no habit existed yet, so the heatmap can leave it blank.
 */
export function overallRatioForDay(habits: Habit[], entries: EntryIndex, day: DateKey): number | null {
  const active = habits.filter((h) => h.createdAt <= day);
  if (active.length === 0) return null;
  const sum = active.reduce(
    (acc, h) => acc + progressRatio(entries.get(h.id)?.get(day) ?? 0, h.goal),
    0,
  );
  return sum / active.length;
}
