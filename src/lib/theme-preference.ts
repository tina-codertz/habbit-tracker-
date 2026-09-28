import 'expo-sqlite/localStorage/install';

import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

const KEY = 'theme-preference';
const listeners = new Set<() => void>();

function read(): ThemePreference {
  const value = globalThis.localStorage?.getItem(KEY);
  return value === 'light' || value === 'dark' ? value : 'system';
}

function apply(preference: ThemePreference) {
  // Overriding Appearance makes useColorScheme(), native controls and system chrome follow the choice.
  Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
}

/** Applies the saved preference. Call once before the first render. */
export function applyStoredThemePreference() {
  apply(read());
}

export function setThemePreference(preference: ThemePreference) {
  globalThis.localStorage?.setItem(KEY, preference);
  apply(preference);
  listeners.forEach((listener) => listener());
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    read,
  );
}
