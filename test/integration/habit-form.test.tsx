import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// ─── mock next/navigation ─────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/dashboard',
}));

// ─── mock ProtectedRoute — just render children directly ──────────────────────
vi.mock('@/src/components/shared/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ─── mock getCurrentUser to return a stable test user ────────────────────────
vi.mock('@/src/lib/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({
    id: 'user-1',
    email: 'test@example.com',
  }),
  logout: vi.fn(),
}));

// ─── mock seedHabits so it never auto-populates test storage ─────────────────
vi.mock('@/src/lib/storage', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/src/lib/storage')>();
  return {
    ...actual,
    seedHabits: vi.fn(), // no-op — tests control storage directly
  };
});

import DashboardPage from '../../src/app/dashboard/page';
import {
  getHabits,
  saveHabits,
  setSession,
} from '../../src/lib/storage';
import { STORAGE_KEY } from '../../src/lib/constants';

// ─── helpers ──────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split('T')[0];

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY.USERS);
  localStorage.removeItem(STORAGE_KEY.SESSIONS);
  localStorage.removeItem(STORAGE_KEY.HABITS);
}

function seedSession(userId = 'user-1', email = 'test@example.com') {
  setSession({ userId, email });
}

function seedHabit(overrides = {}) {
  const habit = {
    id: 'habit-abc',
    userId: 'user-1',
    name: 'Drink Water',
    description: 'Stay hydrated',
    frequency: 'daily' as const,
    createdAt: new Date().toISOString(),
    completions: [] as string[],
    ...overrides,
  };
  saveHabits([habit]);
  return habit;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('habit form', () => {
  beforeEach(() => {
    clearStorage();
    seedSession();
    // Reset window.confirm to auto-confirm by default
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    // Wait for dashboard to boot and render
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    // Open the create habit form
    await user.click(screen.getByTestId('create-habit-button'));

    // Form must be visible
    await waitFor(() => {
      expect(screen.getByTestId('habit-form')).toBeInTheDocument();
    });

    // The save button is disabled when name is empty — verify and attempt submit
    const saveButton = screen.getByTestId('habit-save-button');
    expect(saveButton).toBeDisabled();

    // No habit should have been saved
    expect(getHabits() ?? []).toHaveLength(0);
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('create-habit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-form')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.type(
      screen.getByTestId('habit-description-input'),
      'Stay hydrated every day'
    );

    await user.click(screen.getByTestId('habit-save-button'));

    // The habit card must appear using its slug-based test id
    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    });

    // The habit must be persisted in localStorage via storage lib
    const habits = getHabits() ?? [];
    expect(habits.some((h: any) => h.name === 'Drink Water')).toBe(true);
    const created = habits.find((h: any) => h.name === 'Drink Water');
    expect(created.frequency).toBe('daily');
    expect(created.userId).toBe('user-1');
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup();

    // Pre-seed a habit with known immutable values
    const original = seedHabit({
      id: 'habit-fixed-id',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: [TODAY],
    });

    render(<DashboardPage />);


    await waitFor(() => {
      expect(screen.getByTestId('habit-edit-drink-water')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('habit-edit-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-form')).toBeInTheDocument();
    });

    // Clear the name and type a new one
    const nameInput = screen.getByTestId('habit-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Hydrate');

    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-hydrate')).toBeInTheDocument();
    });

    // Verify immutable fields were not changed
    const habits = getHabits() ?? [];
    const updated = habits.find((h: any) => h.name === 'Hydrate');
    expect(updated).toBeDefined();
    expect(updated.id).toBe(original.id);
    expect(updated.userId).toBe(original.userId);
    expect(updated.createdAt).toBe(original.createdAt);
    expect(updated.completions).toEqual(original.completions);
    expect(updated.frequency).toBe('daily');
  });



it('deletes a habit only after explicit confirmation', async () => {
  const user = userEvent.setup();
  seedHabit();

  render(<DashboardPage />);

  await waitFor(() => {
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
  });

  // STEP 1: click trash icon (opens confirm UI)
  await user.click(screen.getByTestId('habit-delete-drink-water'));

  // STEP 2: confirm UI appears (this replaces delete button)
  await waitFor(() => {
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
  });

  // STEP 3: cancel first? (if you want cancel flow)
  // or directly confirm delete:

  await user.click(screen.getByTestId('confirm-delete-button'));

  // STEP 4: wait for removal
  await waitFor(() => {
    expect(
      screen.queryByTestId('habit-card-drink-water')
    ).not.toBeInTheDocument();
  });

  // STEP 5: storage check
  expect(getHabits() ?? []).toHaveLength(0);
});


  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup();
    seedHabit({ completions: [] });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toBeInTheDocument();
    });

    // Streak should start at 0
    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0');

    // Mark as complete for today
    await user.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('1');
    });

    // Verify completion was persisted
    const habits = getHabits() ?? [];
    expect(habits[0].completions).toContain(TODAY);

    // Toggle again to unmark
    await user.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0');
    });

    // Completion must be removed from storage
    const habitsAfter = getHabits() ?? [];
    expect(habitsAfter[0].completions).not.toContain(TODAY);
  });
});