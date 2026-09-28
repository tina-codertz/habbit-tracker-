import type { Habit } from '@/types/habit';

/** "8 glasses", "3 times", or "Once a day". */
export function formatGoal(habit: Pick<Habit, 'goal' | 'unit'>): string {
  if (habit.goal <= 1) return 'Once a day';
  return `${habit.goal} ${habit.unit?.trim() || 'times'}`;
}

export function formatStreak(days: number): string {
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
