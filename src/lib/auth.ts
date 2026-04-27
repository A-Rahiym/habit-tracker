import type { User } from "@/src/types/auth";
import {
  addUser,
  clearSession,
  getSession,
  getUsers,
  saveSession,
} from "@/src/lib/storage";

type SignupInput = {
  email: string;
  password: string;
};

export async function signup(input: SignupInput): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) throw new Error("Missing credentials");

  const user: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  addUser(user);
  saveSession({ userId: user.id, email: user.email });
  return user;
}

export async function login(email: string, password: string): Promise<User> {
  const e = email.trim().toLowerCase();
  const p = password;
  if (!e || !p) throw new Error("Missing credentials");

  const user = getUsers().find((u) => u.email.toLowerCase() === e);
  if (!user || user.password !== p) {
    throw new Error("Invalid email or password");
  }

  saveSession({ userId: user.id, email: user.email });
  return user;
}

export async function logout(): Promise<void> {
  clearSession();
}

export async function getCurrentUser(): Promise<User | null> {
  const session = getSession();
  if (!session) return null;
  const user = getUsers().find((u) => u.id === session.userId);
  return user || null;
}