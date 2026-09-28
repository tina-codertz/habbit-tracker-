import type { SymbolViewProps } from 'expo-symbols';

type SymbolName = Extract<SymbolViewProps['name'], object>;

/** Icons a user can pick for a habit: SF Symbol on iOS, Material Symbol elsewhere. */
export const habitIcons = {
  water: { ios: 'drop.fill', android: 'water_drop', web: 'water_drop', label: 'Water' },
  run: { ios: 'figure.run', android: 'directions_run', web: 'directions_run', label: 'Run' },
  workout: { ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center', label: 'Workout' },
  meditate: { ios: 'figure.mind.and.body', android: 'self_improvement', web: 'self_improvement', label: 'Meditate' },
  read: { ios: 'book.fill', android: 'menu_book', web: 'menu_book', label: 'Read' },
  sleep: { ios: 'moon.zzz.fill', android: 'bedtime', web: 'bedtime', label: 'Sleep' },
  journal: { ios: 'pencil.line', android: 'edit_note', web: 'edit_note', label: 'Journal' },
  eat: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant', label: 'Eat well' },
  fruit: { ios: 'carrot.fill', android: 'nutrition', web: 'nutrition', label: 'Veggies' },
  code: { ios: 'chevron.left.forwardslash.chevron.right', android: 'code', web: 'code', label: 'Code' },
  music: { ios: 'music.note', android: 'music_note', web: 'music_note', label: 'Music' },
  art: { ios: 'paintbrush.fill', android: 'brush', web: 'brush', label: 'Create' },
  save: { ios: 'banknote.fill', android: 'savings', web: 'savings', label: 'Save' },
  learn: { ios: 'brain.head.profile', android: 'psychology', web: 'psychology', label: 'Learn' },
  sun: { ios: 'sun.max.fill', android: 'sunny', web: 'sunny', label: 'Outside' },
  heart: { ios: 'heart.fill', android: 'favorite', web: 'favorite', label: 'Self-care' },
  pet: { ios: 'pawprint.fill', android: 'pets', web: 'pets', label: 'Pet' },
  plant: { ios: 'leaf.fill', android: 'local_florist', web: 'local_florist', label: 'Plants' },
  noSmoking: { ios: 'nosign', android: 'smoke_free', web: 'smoke_free', label: 'Quit' },
  star: { ios: 'star.fill', android: 'star', web: 'star', label: 'Other' },
} as const satisfies Record<string, SymbolName & { label: string }>;

export type HabitIconName = keyof typeof habitIcons;
export const habitIconNames = Object.keys(habitIcons) as HabitIconName[];

/** UI chrome icons used across the app. */
export const appIcons = {
  add: { ios: 'plus', android: 'add', web: 'add' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  minus: { ios: 'minus', android: 'remove', web: 'remove' },
  flame: { ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' },
  trophy: { ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' },
  percent: { ios: 'chart.line.uptrend.xyaxis', android: 'trending_up', web: 'trending_up' },
  total: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
  chart: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  bell: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
  sparkles: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
} as const satisfies Record<string, SymbolName>;

export type AppIconName = keyof typeof appIcons;
