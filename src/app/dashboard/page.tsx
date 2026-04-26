'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getSession,
  getHabits,
  saveHabits,
  clearSession,
  seedHabits
} from '@/src/lib/storage';

import { Habit } from '@/src/types/habit';
import { toggleHabitCompletion } from '@/src/lib/habit';
import { calculateCurrentStreak } from '@/src/lib/streak';

export default function DashboardPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace('/login');
      return;
    }

    setUserId(session.userId);
    seedHabits(session.userId);

    const all = getHabits();
    const userHabits = all?.filter(h => h.userId === session.userId) || [];

    setHabits(userHabits);
  }, []);

  function toggle(habit: Habit) {
    const updated = toggleHabitCompletion(habit, today);

    const all = getHabits()?.map(h =>
      h.id === updated.id ? updated : h
    ) || [];

    saveHabits(all);

    const userHabits = all.filter(h => h.userId === userId);
    setHabits(userHabits);
  }

  function logout() {
    clearSession();
    router.push('/login');
  }

  if (!userId) return null;

  return (
    <div className="min-h-screen  px-6 py-6">

      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Dashboard</h1>

        <button
          onClick={logout}
          className="text-sm text-red-500"
        >
          Logout
        </button>
      </div>

      {/* empty state */}
      {habits.length === 0 && (
        <p className="text-center text-gray-500 mt-20">
          No habits yet
        </p>
      )}

      {/* habits */}
      <div className="space-y-3">
        {habits.map(h => {
          const streak = calculateCurrentStreak(h.completions);

          return (
            <div
              key={h.id}
              className="bg border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{h.name}</p>
                <p className="text-sm text-gray-500">
                  {streak} day streak
                </p>
              </div>

              <button
                onClick={() => toggle(h)}
                className="text-sm bg-violet-600 text-white px-3 py-1 rounded-lg"
              >
                Toggle
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}