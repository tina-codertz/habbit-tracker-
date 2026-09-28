import type { ReactNode } from 'react';
import { View } from 'react-native';

import { spacing } from '@/theme';

import { ThemedText } from './themed-text';

type SectionHeaderProps = { title: string; trailing?: ReactNode };

export function SectionHeader({ title, trailing }: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.sm,
        gap: spacing.md,
      }}>
      <ThemedText variant="title" accessibilityRole="header">
        {title}
      </ThemedText>
      {typeof trailing === 'string' ? (
        <ThemedText variant="subhead" tone="tertiary">
          {trailing}
        </ThemedText>
      ) : (
        trailing
      )}
    </View>
  );
}
