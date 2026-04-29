/* MENTOR_TRACE_STAGE3_HABIT_A91 */
import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/src/lib/streaks';

describe('calculateCurrentStreak', () => {
  const today = '2025-01-10';

  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2025-01-09'], today)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    const completions = ['2025-01-10', '2025-01-09', '2025-01-08'];
    expect(calculateCurrentStreak(completions, today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    const completions = ['2025-01-10', '2025-01-10', '2025-01-09'];
    expect(calculateCurrentStreak(completions, today)).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    const completions = ['2025-01-10', '2025-01-08'];
    expect(calculateCurrentStreak(completions, today)).toBe(1);
  });
});