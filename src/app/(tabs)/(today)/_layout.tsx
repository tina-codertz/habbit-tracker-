import { Stack } from 'expo-router';

import { useStackOptions } from '@/hooks/use-stack-options';

export default function TabStackLayout() {
  return <Stack screenOptions={{ ...useStackOptions(), headerLargeTitleEnabled: true }} />;
}
