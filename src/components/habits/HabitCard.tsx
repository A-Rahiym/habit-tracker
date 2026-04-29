"use client";

import { useState } from "react";
import type { Habit } from "@/src/types/habit";
import { getHabitSlug } from "@/src/lib/slug";
import { calculateCurrentStreak } from "@/src/lib/streaks";

export function HabitCard({
  habit,
  today,
  onToggle,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  today: string;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}) {
  const slug = getHabitSlug(habit.name);
  const completedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);
  const frequencyLabel =
    habit.frequency === "daily"
      ? "Daily"
      : habit.frequency === "weekly"
        ? "Weekly"
        : "Monthly";

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={[
        "rounded-2xl bg-surface border px-4 py-3 shadow-sm transition",
       completedToday
          ? "bg-muted-surface border-primary/30 opacity-60"
          : "bg-surface border-border",
      ].join(" ")}
    >
     
      <div className="flex items-center gap-3">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit)}
          className={[
            "shrink-0 rounded-full w-10 h-10 flex items-center justify-center border transition",
            completedToday
              ? "bg-primary border-primary text-white"
              : "bg-surface border-border text-text-secondary",
          ].join(" ")}
          type="button"
          aria-label={completedToday ? "Mark incomplete" : "Mark complete"}
        >
          {completedToday ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <span className="sr-only">Not completed</span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate text-text-primary">
            {habit.name}
          </div>
          <div className="text-sm text-text-secondary flex items-center gap-1.5 flex-wrap">
            <span data-testid={`habit-streak-${slug}`}>
              {streak} day streak
            </span>
            <span className="opacity-50">•</span>
            <span>{frequencyLabel}</span>
          </div>
        </div>

        {/* Edit + Delete buttons — hidden while confirming */}
        {!confirmingDelete && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              data-testid={`habit-edit-${slug}`}
              onClick={() => onEdit(habit)}
              className="w-9 h-9 inline-flex items-center justify-center rounded-full text-text-secondary hover:bg-muted-surface transition"
              type="button"
              aria-label="Edit habit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              data-testid={`habit-delete-${slug}`}
              onClick={() => setConfirmingDelete(true)}
              className="w-9 h-9 inline-flex items-center justify-center rounded-full text-danger hover:bg-muted-surface transition"
              type="button"
              aria-label="Delete habit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>


      {confirmingDelete && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
          <span className="text-sm text-danger italic">
            Confirm delete?
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              data-testid="confirm-delete-button"
              type="button"
              onClick={() => {
                onDelete(habit);
                setConfirmingDelete(false);
              }}
              className="px-4 py-1 rounded-full border border-danger text-danger text-sm font-medium hover:opacity-90 transition"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="px-4 py-1 rounded-full border border-border text-sm hover:bg-muted-surface transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}