import type { SQLiteDatabase } from 'expo-sqlite';

import { todayKey, type DateKey } from '@/lib/dates';
import type { EntryIndex, Habit, HabitInput } from '@/types/habit';

type HabitRow = {
  id: string;
  name: string;
  icon: string;
  color: string;
  goal: number;
  unit: string | null;
  reminder_time: string | null;
  notification_id: string | null;
  sort_order: number;
  created_at: string;
};

function toHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon as Habit['icon'],
    color: row.color as Habit['color'],
    goal: row.goal,
    unit: row.unit,
    reminderTime: row.reminder_time,
    notificationId: row.notification_id,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export async function listHabits(db: SQLiteDatabase): Promise<Habit[]> {
  const rows = await db.getAllAsync<HabitRow>('SELECT * FROM habits ORDER BY sort_order, created_at');
  return rows.map(toHabit);
}

export async function getHabit(db: SQLiteDatabase, id: string): Promise<Habit | null> {
  const row = await db.getFirstAsync<HabitRow>('SELECT * FROM habits WHERE id = ?', [id]);
  return row ? toHabit(row) : null;
}

export async function insertHabit(db: SQLiteDatabase, input: HabitInput): Promise<Habit> {
  const id = createId();
  const order = await db.getFirstAsync<{ next: number }>(
    'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM habits',
  );
  await db.runAsync(
    `INSERT INTO habits (id, name, icon, color, goal, unit, reminder_time, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, input.name, input.icon, input.color, input.goal, input.unit, input.reminderTime, order?.next ?? 0, todayKey()],
  );
  return (await getHabit(db, id))!;
}

export async function updateHabit(db: SQLiteDatabase, id: string, input: HabitInput): Promise<void> {
  await db.runAsync(
    `UPDATE habits SET name = ?, icon = ?, color = ?, goal = ?, unit = ?, reminder_time = ? WHERE id = ?`,
    [input.name, input.icon, input.color, input.goal, input.unit, input.reminderTime, id],
  );
}

export async function setNotificationId(db: SQLiteDatabase, id: string, notificationId: string | null) {
  await db.runAsync('UPDATE habits SET notification_id = ? WHERE id = ?', [notificationId, id]);
}

export async function deleteHabit(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
}

export async function deleteAllData(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('DELETE FROM entries; DELETE FROM habits;');
}

export async function setEntryCount(db: SQLiteDatabase, habitId: string, date: DateKey, count: number) {
  if (count <= 0) {
    await db.runAsync('DELETE FROM entries WHERE habit_id = ? AND date = ?', [habitId, date]);
    return;
  }
  await db.runAsync(
    `INSERT INTO entries (habit_id, date, count) VALUES (?, ?, ?)
     ON CONFLICT(habit_id, date) DO UPDATE SET count = excluded.count`,
    [habitId, date, count],
  );
}

export async function getEntryIndex(db: SQLiteDatabase): Promise<EntryIndex> {
  const rows = await db.getAllAsync<{ habit_id: string; date: string; count: number }>(
    'SELECT habit_id, date, count FROM entries',
  );
  const index: EntryIndex = new Map();
  for (const row of rows) {
    let days = index.get(row.habit_id);
    if (!days) index.set(row.habit_id, (days = new Map()));
    days.set(row.date, row.count);
  }
  return index;
}
