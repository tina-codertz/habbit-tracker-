import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { formatGoal, formatPercent, formatStreak } from '@/components/habits/format';
import { HabitCheckButton } from '@/components/habits/habit-check-button';
import { HeatmapLegend } from '@/components/heatmap/heatmap-legend';
import { YearHeatmap } from '@/components/heatmap/year-heatmap';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { IconTile } from '@/components/ui/icon-tile';
import { SectionHeader } from '@/components/ui/section-header';
import { StatGrid, StatTile } from '@/components/ui/stat-tile';
import { Surface } from '@/components/ui/surface';
import { ThemedText } from '@/components/ui/themed-text';
import { useHabitActions } from '@/hooks/use-habit-actions';
import { useHabit, useHabitCounts } from '@/hooks/use-habits';
import { useToday } from '@/hooks/use-today';
import { formatTime } from '@/lib/notifications';
import { habitStats, progressRatio } from '@/lib/stats';
import { habitColors, screenPadding, spacing, useTheme } from '@/theme';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, scheme } = useTheme();
  const today = useToday();
  const { data: habit, status } = useHabit(id);
  const counts = useHabitCounts(id);
  const { setCount } = useHabitActions();

  if (status === 'loading') return null;
  if (!habit) {
    return <EmptyState icon="sparkles" title="Habit not found" message="It may have been deleted." />;
  }

  const color = habitColors[habit.color][scheme];
  const stats = habitStats(habit, counts, today);
  const count = counts.get(today) ?? 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: habit.name,
          headerRight: () => (
            <IconButton
              icon="edit"
              accessibilityLabel="Edit habit"
              onPress={() => router.push({ pathname: '/habit/[id]/edit', params: { id: habit.id } })}
            />
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: screenPadding, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.sm }}>
          <IconTile icon={habit.icon} color={color} size="lg" />
          <View style={{ flex: 1, gap: spacing.xs }}>
            <ThemedText variant="title" numberOfLines={2}>
              {habit.name}
            </ThemedText>
            <ThemedText variant="subhead" tone="secondary">
              {formatGoal(habit)}
            </ThemedText>
            {habit.reminderTime && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <Icon name="bell" size={12} color={colors.textTertiary} />
                <ThemedText variant="footnote" tone="tertiary">
                  {formatTime(habit.reminderTime)}
                </ThemedText>
              </View>
            )}
          </View>
          <HabitCheckButton
            habit={habit}
            color={color}
            count={count}
            size={56}
            onChange={(next) => setCount(habit, today, next)}
          />
        </View>

        <StatGrid>
          <StatTile icon="flame" label="Current streak" value={formatStreak(stats.currentStreak)} color={colors.streak} />
          <StatTile icon="trophy" label="Best streak" value={formatStreak(stats.bestStreak)} color={colors.award} />
          <StatTile icon="percent" label="30-day rate" value={formatPercent(stats.completionRate)} color={color} />
          <StatTile icon="total" label="Days completed" value={stats.totalCompletions.toLocaleString()} color={colors.positive} />
        </StatGrid>

        <SectionHeader title="Consistency" trailing="Last 12 months" />
        <Surface style={{ gap: spacing.md }}>
          <YearHeatmap
            endDate={today}
            color={color}
            getRatio={(day) => (day < habit.createdAt ? null : progressRatio(counts.get(day) ?? 0, habit.goal))}
            accessibilityLabel={`${habit.name} history for the last year, ${stats.totalCompletions} days completed`}
          />
          <HeatmapLegend color={color} />
        </Surface>
      </ScrollView>
    </>
  );
}
