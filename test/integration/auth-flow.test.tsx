import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';


vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
}));

import { SignupForm } from '@/src/components/auth/SignupForm';
import { LoginForm } from '@/src/components/auth/LoginForm';

import {
  getUsers,
  addUser,
  getSession,
} from '@/src/lib/storage';
import { STORAGE_KEY } from '@/src/lib/constants';

// ─── helpers ──────────────────────────────────────────────────────────────────

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY.USERS);
  localStorage.removeItem(STORAGE_KEY.SESSIONS);
  localStorage.removeItem(STORAGE_KEY.HABITS);
}

function seedUser(email: string, password: string) {
  addUser({
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  });
}



describe('auth flow', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    // A session must have been written to localStorage
    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
      expect(session.userId).toBeTruthy();
    });

    // The user must exist in the users store
    const users = getUsers();
    expect(users.some((u: any) => u.email === 'test@example.com')).toBe(true);
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();

    // Pre-seed a user with the same email
    seedUser('duplicate@example.com', 'password123');

    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'duplicate@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });

    // No new session should have been created
    expect(getSession()).toBeNull();
  });

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();

    // Seed a valid user
    seedUser('login@example.com', 'mypassword');

    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'mypassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.email).toBe('login@example.com');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();

    // Seed a user with a different password
    seedUser('real@example.com', 'correctpassword');

    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'real@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    // Session must not be created
    expect(getSession()).toBeNull();
  });
});