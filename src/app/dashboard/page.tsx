"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHabits, saveHabits, updateHabit, deleteHabit, addHabit } from "@/src/lib/storage";
import { getCurrentUser, logout as authLogout } from "@/src/lib/auth";
import { AddIcon } from "@/src/components/Icons/Add";
import { Habit } from "@/src/types/habit";
import { toggleHabitCompletion } from "@/src/lib/habits";
import { calculateCurrentStreak } from "@/src/lib/streaks";
import { ProtectedRoute } from "@/src/components/shared/ProtectedRoute";
import { HabitList } from "@/src/components/habits/HabitList";
import { HabitForm } from "@/src/components/habits/HabitForm";

export default function DashboardPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const totalStreak = habits.reduce(
    (sum, habit) => sum + calculateCurrentStreak(habit.completions, today),
    0
  );

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      const user = await getCurrentUser();
      if (cancelled) return;
      if (!user) return;

      setUserId(user.id);

      const all = getHabits();
      const userHabits = all?.filter((h) => h.userId === user.id) || [];
      console.log(`Loaded ${userHabits.length} habits for user ${user.email} (${user.id})`);
      setHabits(userHabits);
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(habit: Habit) {
    const updated = toggleHabitCompletion(habit, today);
    const all =
      getHabits()?.map((h) =>
        h.id === updated.id ? updated : h
      ) || [];
    saveHabits(all);
    const userHabits = all.filter((h) => h.userId === userId);
    setHabits(userHabits);
  }

  async function logout() {
    await authLogout();
    router.push("/login");
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(h: Habit) {
    setEditing(h);
    setFormOpen(true);
  }

  function confirmDelete(h: Habit) {
    deleteHabit(h.id);
    const all = getHabits() || [];
    setHabits(all.filter((x) => x.userId === userId));
    console.log(`Deleted habit ${h.name} (${h.id})`);
  }

  function saveDraft(draft: {
    name: string;
    description: string;
    frequency: Habit["frequency"];
  }) {
    if (!userId) return;
    if (editing) {
      const updated: Habit = {
        ...editing,
        name: draft.name,
        description: draft.description,
        frequency: draft.frequency,
      };
      updateHabit(updated);
    } else {
      const created: Habit = {
        id: crypto.randomUUID(),
        userId,
        name: draft.name,
        description: draft.description,
        frequency: draft.frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      addHabit(created);
    }

    const next = getHabits() || [];
    setHabits(next.filter((h) => h.userId === userId));
    setFormOpen(false);

    setEditing(null);
  }

  return (
    <ProtectedRoute>
      <div data-testid="dashboard-page" className="h-screen bg-background text-text-primary px-4 py-6 md:px-8 md:py-8">
        <div className="w-full mx-auto max-w-180 xl:max-w-260 flex flex-col flex-1 overflow-hidden">
          <div className="rounded-3xl border border-primary/20 bg-primary px-5 py-5 md:px-6 md:py-6 shadow-sm mb-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start justify-between w-full">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">
                    Hello 👋
                  </div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-white truncate md:text-2xl">
                    Welcome back
                  </div>
                  <div className="mt-2 text-sm text-white max-w-md italic">
                    A calm space for today’s habits. Keep the streak alive, one tap at a time.
                  </div>
                </div>

                <button
                  data-testid="auth-logout-button"
                  onClick={logout}
                  className="shrink-0 px-2.5 py-1.5 text-xs rounded-full border border-border bg-surface text-danger hover:bg-muted-surface transition"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/12 px-4 py-3 text-white backdrop-blur-sm">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
                  Total streak
                </div>
                <div className="mt-1 text-3xl font-semibold tracking-tight">
                  {totalStreak}
                </div>
                <div className="mt-1 text-sm text-white/80">
                  Combined streak across all habits.
                </div>
              </div>

              <div className="rounded-2xl bg-white/12 px-4 py-3 text-white backdrop-blur-sm">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
                  Summary
                </div>
                <div className="mt-1 text-sm text-white/90">
                  {habits.length} habit{habits.length === 1 ? "" : "s"} total
                </div>
                <div className="mt-1 text-sm text-white/80">
                  Tap the circle to mark today complete.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start flex-1 overflow-hidden">
            <div className="xl:flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <button
                  data-testid="create-habit-button"
                  onClick={openCreate}
                  type="button"
                  aria-label="Create habit"
                  className="
                  fixed bottom-6 left-1/2 -translate-x-1/2
                  w-14 h-14 rounded-full bg-primary text-white shadow-lg
                  flex items-center justify-center
                  hover:opacity-95 active:opacity-90 transition

                  xl:static xl:translate-x-0
                  xl:w-auto xl:h-auto xl:px-4 xl:py-2
                  xl:rounded-full xl:shadow-sm
                  xl:flex xl:gap-2 xl:items-center
                "
                >
                  <AddIcon className="xl:hidden" width="24" height="24" />

                  <span className="hidden xl:inline text-sm font-medium">
                    Add
                  </span>

                  <AddIcon className="hidden xl:block" width="18" height="18" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <HabitList
                  habits={habits}
                  today={today}
                  onToggle={toggle}
                  onEdit={openEdit}
                  onDelete={confirmDelete}
                />
              </div>

            </div>
          </div>
        </div>

        <HabitForm
          open={formOpen}
          initial={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSave={saveDraft}
        />
      </div>
    </ProtectedRoute>
  );
}