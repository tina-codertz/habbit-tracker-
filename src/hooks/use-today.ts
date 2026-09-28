import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { todayKey, type DateKey } from '@/lib/dates';

/** Today's date key, refreshed when the app returns to the foreground (e.g. after midnight). */
export function useToday(): DateKey {
  const [today, setToday] = useState(todayKey);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') setToday(todayKey());
    });
    return () => subscription.remove();
  }, []);

  return today;
}
