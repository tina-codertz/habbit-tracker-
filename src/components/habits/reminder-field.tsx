import { Host, Switch } from '@expo/ui';
import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { ThemedText } from '@/components/ui/themed-text';
import { radius, spacing, useTheme } from '@/theme';

type ReminderFieldProps = {
  enabled: boolean;
  time: Date;
  accentColor: string;
  onToggle: (enabled: boolean) => void;
  onChangeTime: (time: Date) => void;
};

export function ReminderField({ enabled, time, accentColor, onToggle, onChangeTime }: ReminderFieldProps) {
  const { colors, scheme } = useTheme();
  const [androidPickerOpen, setAndroidPickerOpen] = useState(false);
  const timeLabel = time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderCurve: 'continuous',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Icon name="bell" size={18} color={colors.textSecondary} />
        <ThemedText variant="callout" style={{ flex: 1 }}>
          Daily reminder
        </ThemedText>
        <Host matchContents>
          <Switch value={enabled} onValueChange={onToggle} />
        </Host>
      </View>

      {enabled && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
          <ThemedText variant="subhead" tone="secondary">
            Remind me at
          </ThemedText>
          {process.env.EXPO_OS === 'ios' ? (
            <DateTimePicker
              value={time}
              mode="time"
              display="compact"
              accentColor={accentColor}
              themeVariant={scheme}
              onValueChange={(_, date) => onChangeTime(date)}
            />
          ) : (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Reminder time, ${timeLabel}`}
                onPress={() => setAndroidPickerOpen(true)}
                style={({ pressed }) => ({
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.sm,
                  backgroundColor: pressed ? colors.surfacePressed : colors.surfaceRaised,
                })}>
                <ThemedText variant="callout">{timeLabel}</ThemedText>
              </Pressable>
              {androidPickerOpen && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  accentColor={accentColor}
                  onValueChange={(_, date) => {
                    setAndroidPickerOpen(false);
                    onChangeTime(date);
                  }}
                  onDismiss={() => setAndroidPickerOpen(false)}
                />
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}
