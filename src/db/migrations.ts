import type { SQLiteDatabase } from 'expo-sqlite';

/**
 * Ordered schema migrations. Append new steps — never edit a shipped one.
 * `PRAGMA user_version` records how many have run on this device.
 */
const migrations: string[] = [
  `
  CREATE TABLE habits (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    goal INTEGER NOT NULL DEFAULT 1,
    unit TEXT,
    reminder_time TEXT,
    notification_id TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE TABLE entries (
    habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY (habit_id, date)
  );
  CREATE INDEX entries_date ON entries(date);
  `,
];

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // Connection-level settings must be applied on every open.
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  if (current >= migrations.length) return;

  await db.withTransactionAsync(async () => {
    for (let version = current; version < migrations.length; version++) {
      await db.execAsync(migrations[version]);
    }
    await db.execAsync(`PRAGMA user_version = ${migrations.length}`);
  });
}
