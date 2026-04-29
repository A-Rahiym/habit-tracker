import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/src/lib/habits';

const habit = {
  id: '1',
  userId: 'u1',
  name: 'Test',
  description: '',
  frequency: 'daily' as const,
  createdAt: new Date().toISOString(),
  completions: []
};

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(habit, '2025-01-10');
    expect(result.completions).toContain('2025-01-10');
  });

  it('removes a completion date when the date already exists', () => {
    const withDate = { ...habit, completions: ['2025-01-10'] };
    const result = toggleHabitCompletion(withDate, '2025-01-10');

    expect(result.completions).not.toContain('2025-01-10');
  });

  it('does not mutate the original habit object', () => {
    const original = { ...habit };
    toggleHabitCompletion(original, '2025-01-10');

    expect(original.completions.length).toBe(0);
  });

  it('does not return duplicate completion dates', () => {
    const withDup = { ...habit, completions: ['2025-01-10'] };
    const result = toggleHabitCompletion(withDup, '2025-01-10');

    expect(result.completions.filter(d => d === '2025-01-10').length).toBeLessThanOrEqual(1);
  });
});