import { router, Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { HabitCard } from '@/components/habits/habit-card';
import { HeroProgressCard } from '@/components/today/hero-progress-card';
import type { WeekDay } from '@/components/today/week-strip';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { SectionHeader } from '@/components/ui/section-header';
import { ThemedText } from '@/components/ui/themed-text';
import { useConfirmDeleteHabit } from '@/hooks/use-confirm-delete';
import { useHabitActions } from '@/hooks/use-habit-actions';
import { useEntryIndex, useHabits } from '@/hooks/use-habits';
import { useToday } from '@/hooks/use-today';
import { addDays, formatLongDate, fromDateKey, greeting, startOfWeek, toDateKey } from '@/lib/dates';
import { isComplete, overallRatioForDay } from '@/lib/stats';
import { screenPadding, spacing } from '@/theme';
import type { EntryIndex } from '@/types/habit';

const EMPTY_INDEX: EntryIndex = new Map();
const openNewHabit = () => router.push('/habit/new');

export default function TodayScreen() {
  const today = useToday();
  const habitsQuery = useHabits();
  const entriesQuery = useEntryIndex();
  const { setCount } = useHabitActions();
  const confirmDelete = useConfirmDeleteHabit();

  const habits = habitsQuery.data ?? [];
  const entries = entriesQuery.data ?? EMPTY_INDEX;
  const loading = habitsQuery.status === 'loading' || entriesQuery.status === 'loading';
  const error = habitsQuery.error ?? entriesQuery.error;

  const todayDate = fromDateKey(today);
  const completed = habits.filter((h) => isComplete(entries.get(h.id)?.get(today), h.goal)).length;
  const week: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(todayDate), i);
    const key = toDateKey(date);
    return { key, date, isToday: key === today, ratio: key > today ? null : overallRatioForDay(habits, entries, key) };
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: greeting(),
          headerRight: () => <IconButton icon="add" accessibilityLabel="New habit" onPress={openNewHabit} />,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: screenPadding, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
        <ThemedText variant="subhead" tone="secondary" style={{ marginTop: -spacing.sm }}>
          {formatLongDate(todayDate)}
        </ThemedText>

        {error ? (
          <EmptyState icon="sparkles" title="Couldn’t load your habits" message={error.message} />
        ) : loading ? null : habits.length === 0 ? (
          <EmptyState
            icon="sparkles"
            title="Start your first habit"
            message="Small daily actions add up. Pick one thing you want to do every day.">
            <Button title="New habit" icon="add" onPress={openNewHabit} />
          </EmptyState>
        ) : (
          <>
            <HeroProgressCard
              progress={overallRatioForDay(habits, entries, today) ?? 0}
              completed={completed}
              total={habits.length}
              week={week}
            />
            <SectionHeader title="Your habits" trailing={`${completed} of ${habits.length} done`} />
            <View style={{ gap: spacing.md }}>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  today={today}
                  counts={entries.get(habit.id) ?? new Map()}
                  onChangeCount={(count) => setCount(habit, today, count)}
                  onEdit={() => router.push({ pathname: '/habit/[id]/edit', params: { id: habit.id } })}
                  onDelete={() => confirmDelete(habit)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}
