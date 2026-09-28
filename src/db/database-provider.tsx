import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, type ReactNode } from 'react';

import { migrateDbIfNeeded } from './migrations';

export const DATABASE_NAME = 'habits.db';

/** Opens the local database and runs migrations before rendering children. */
export function DatabaseProvider({ children }: { children: ReactNode }) {
  return (
    // The splash screen stays up while the database opens, so no fallback UI is needed.
    <Suspense fallback={null}>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded} useSuspense>
        {children}
      </SQLiteProvider>
    </Suspense>
  );
}
