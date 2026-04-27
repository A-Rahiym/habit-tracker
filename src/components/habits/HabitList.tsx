"use client";

import type { Habit } from "@/src/types/habit";
import { HabitCard } from "@/src/components/habits/HabitCard";

export function HabitList({
  habits,
  today,
  onToggle,
  onEdit,
  onDelete,
}: {
  habits: Habit[];
  today: string;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="text-center mt-16 text-text-secondary"
      >
        No habits yet.
      </div>
    );
  }

  return (
    <>
      <div className="font-semibold text-2xl m-3">Habits</div>
      <div className="space-y-2">
        {habits.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            today={today}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}

