import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {LoginForm} from '@/src/components/auth/LoginForm';
import {SignupForm} from '@/src/components/auth/SignupForm';


vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe('auth flow', () => {
  it('submits the signup form and creates a session', () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@mail.com' }
    });

    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: '123456' }
    });

    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(localStorage.getItem('habit-tracker-session')).not.toBeNull();
  });

  it('shows an error for duplicate signup email', () => {
    render(<SignupForm />);

    // simulate duplicate
    localStorage.setItem('habit-tracker-users', JSON.stringify([
      { id: '1', email: 'test@mail.com', password: '123', createdAt: '' }
    ]));

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@mail.com' }
    });

    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: '123' }
    });

    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
  });

  it('submits the login form and stores the active session', () => {
    render(<LoginForm />);

    localStorage.setItem('habit-tracker-users', JSON.stringify([
      { id: '1', email: 'test@mail.com', password: '123', createdAt: '' }
    ]));

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'test@mail.com' }
    });

    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: '123' }
    });

    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(localStorage.getItem('habit-tracker-session')).not.toBeNull();
  });

  it('shows an error for invalid login credentials', () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
  });
});