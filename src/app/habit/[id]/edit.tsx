import { router, useLocalSearchParams } from 'expo-router';

import { HabitFormScreen } from '@/components/habits/habit-form-screen';
import { EmptyState } from '@/components/ui/empty-state';
import { useConfirmDeleteHabit } from '@/hooks/use-confirm-delete';
import { useHabitActions } from '@/hooks/use-habit-actions';
import { useHabit } from '@/hooks/use-habits';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: habit, status } = useHabit(id);
  const { updateHabit } = useHabitActions();
  const confirmDelete = useConfirmDeleteHabit();

  if (status === 'loading') return null;
  if (!habit) return <EmptyState icon="sparkles" title="Habit not found" message="It may have been deleted." />;

  return (
    <HabitFormScreen
      key={habit.id}
      habit={habit}
      onSubmit={(input) => updateHabit(habit, input)}
      // Leave the modal and the (now deleted) habit's detail screen.
      onDelete={() => confirmDelete(habit, () => router.dismissTo('/'))}
    />
  );
}
