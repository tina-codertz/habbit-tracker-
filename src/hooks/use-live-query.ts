import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useEffectEvent, useState } from 'react';

import { subscribeToDataChanges } from '@/db/events';

type LiveQueryState<T> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: T | undefined; error: Error };

/**
 * Runs `query` against the local database and re-runs it whenever data
 * changes. `key` identifies the query — change it to refetch with new inputs.
 */
export function useLiveQuery<T>(key: string, query: (db: SQLiteDatabase) => Promise<T>): LiveQueryState<T> {
  const db = useSQLiteContext();
  const [state, setState] = useState<LiveQueryState<T>>({
    status: 'loading',
    data: undefined,
    error: undefined,
  });
  const runQuery = useEffectEvent(() => query(db));

  useEffect(() => {
    let active = true;
    const load = () => {
      runQuery().then(
        (data) => active && setState({ status: 'success', data, error: undefined }),
        (error: unknown) =>
          active &&
          setState((prev) => ({
            status: 'error',
            data: prev.data,
            error: error instanceof Error ? error : new Error(String(error)),
          })),
      );
    };
    load();
    const unsubscribe = subscribeToDataChanges(load);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [key]);

  return state;
}
