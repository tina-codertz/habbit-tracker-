/**
 * Calendar-day helpers. Days are stored as local `YYYY-MM-DD` keys so a
 * check-in always belongs to the day the user saw on their phone, regardless
 * of timezone math.
 */
export type DateKey = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): DateKey {
  return toDateKey(new Date());
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

export function addDaysToKey(key: DateKey, amount: number): DateKey {
  return toDateKey(addDays(fromDateKey(key), amount));
}

/** Monday-based weekday index: Mon = 0 … Sun = 6. */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -weekdayIndex(date));
}

/** Whole days from `a` to `b` (positive when `b` is later). */
export function daysBetween(a: DateKey, b: DateKey): number {
  const ms = fromDateKey(b).getTime() - fromDateKey(a).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatMonthShort(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short' });
}

export function formatWeekdayNarrow(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'narrow' });
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
