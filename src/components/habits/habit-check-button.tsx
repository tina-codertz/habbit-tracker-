import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { ProgressRing } from '@/components/ui/progress-ring';
import { ThemedText } from '@/components/ui/themed-text';
import { progressRatio } from '@/lib/stats';
import { radius, useTheme } from '@/theme';
import type { Habit } from '@/types/habit';

import { formatGoal } from './format';

type HabitCheckButtonProps = {
  habit: Habit;
  color: string;
  count: number;
  onChange: (count: number) => void;
  size?: number;
};

/**
 * Tap to log progress. Done/not-done habits toggle; count habits step up
 * toward the goal (long-press steps back). Tapping a completed habit undoes it.
 */
export function HabitCheckButton({ habit, color, count, onChange, size = 44 }: HabitCheckButtonProps) {
  const { colors } = useTheme();
  const done = count >= habit.goal;
  const isCounter = habit.goal > 1;

  const onPress = () => onChange(done ? 0 : count + 1);
  const onLongPress = isCounter && count > 0 ? () => onChange(count - 1) : undefined;

  const a11y = isCounter
    ? {
        accessibilityRole: 'adjustable' as const,
        accessibilityLabel: habit.name,
        accessibilityValue: { text: `${count} of ${formatGoal(habit)}` },
        accessibilityActions: [{ name: 'increment' as const }, { name: 'decrement' as const }],
        onAccessibilityAction: (e: { nativeEvent: { actionName: string } }) =>
          onChange(e.nativeEvent.actionName === 'increment' ? count + 1 : count - 1),
      }
    : {
        accessibilityRole: 'checkbox' as const,
        accessibilityLabel: `Mark ${habit.name} done`,
        accessibilityState: { checked: done },
      };

  return (
    <Pressable
      {...a11y}
      hitSlop={6}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.9 : 1 }] })}>
      {done ? (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: radius.full,
            backgroundColor: color,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="check" size={size * 0.45} color="#FFFFFF" weight="bold" />
        </View>
      ) : (
        <ProgressRing
          size={size}
          strokeWidth={isCounter ? 4 : 2.5}
          progress={progressRatio(count, habit.goal)}
          color={color}
          trackColor={colors.separator}>
          {isCounter ? (
            <ThemedText variant="footnote" style={{ fontVariant: ['tabular-nums'] }}>
              {count}
            </ThemedText>
          ) : null}
        </ProgressRing>
      )}
    </Pressable>
  );
}
