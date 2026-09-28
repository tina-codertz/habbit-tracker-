import { View } from 'react-native';

import { spacing } from '@/theme';

import { IconButton } from './icon-button';
import { ThemedText } from './themed-text';

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
};

export function Stepper({ value, onChange, min = 0, max = Infinity, label }: StepperProps) {
  const set = (next: number) => onChange(Math.max(min, Math.min(max, next)));
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ now: value, min, max: Number.isFinite(max) ? max : undefined }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => set(value + (e.nativeEvent.actionName === 'increment' ? 1 : -1))}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
      <IconButton icon="minus" accessibilityLabel="Decrease" onPress={() => set(value - 1)} />
      <ThemedText variant="headline" style={{ minWidth: 28, textAlign: 'center', fontVariant: ['tabular-nums'] }}>
        {value}
      </ThemedText>
      <IconButton icon="add" accessibilityLabel="Increase" onPress={() => set(value + 1)} />
    </View>
  );
}
