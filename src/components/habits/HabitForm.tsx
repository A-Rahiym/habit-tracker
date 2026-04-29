"use client";

import { useEffect, useMemo, useState } from "react";
import type { Habit } from "@/src/types/habit";

type Draft = Pick<Habit, "name" | "description" | "frequency">;

export function HabitForm({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Habit | null;
  onClose: () => void;
  onSave: (draft: Draft) => void;
}) {
  const defaults = useMemo<Draft>(
    () => ({
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      frequency: initial?.frequency ?? "daily",
    }),
    [initial]
  );

  const [name, setName] = useState(defaults.name);
  const [description, setDescription] = useState(defaults.description);
  const [frequency, setFrequency] = useState<Draft["frequency"]>(
    defaults.frequency
  );

  useEffect(() => {
    setName(defaults.name);
    setDescription(defaults.description);
    setFrequency(defaults.frequency);
  }, [defaults]);

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim(),
      description: description.trim(),
      frequency,
    });
    setName("");
    setDescription("");
    setFrequency("daily");

  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center md:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        data-testid="habit-form"
        className="w-full md:max-w-md rounded-2xl bg-surface border border-border shadow-lg p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg text-text-primary">
            {initial ? "Edit Habit" : "New Habit"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-auto px-3 py-2 rounded-full border border-border bg-surface text-text-primary hover:bg-muted-surface transition"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="habit-name-input" className="text-sm font-medium text-text-primary">
              Habit Name
            </label>
            <input
              data-testid="habit-name-input"
              id="habit-name-input"
              className="w-full rounded-full bg-muted-surface border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/25"
              placeholder="Habit name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="habit-description-input" className="text-sm font-medium text-text-primary">
              Description (optional)
            </label>
            <input
              data-testid="habit-description-input"
              className="w-full rounded-full bg-muted-surface border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/25"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="habit-frequency-select" className="text-sm font-medium text-text-primary">
              Frequency
            </label>
            <select
              data-testid="habit-frequency-select"
              className="w-full rounded-full bg-muted-surface border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-primary/25"
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as Draft["frequency"])
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button
            data-testid="habit-save-button"
            className="w-full rounded-full bg-primary text-white font-semibold py-3 hover:opacity-95 active:opacity-90 transition"
            type="submit"
            disabled={!name.trim()}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

