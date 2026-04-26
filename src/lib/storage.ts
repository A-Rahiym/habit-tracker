import { STORAGE_KEY } from "./constants";
import { Habit } from "../types/habit";
import  {User , Session} from "../types/auth";





function safeGet<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
        return JSON.parse(item) as T;
    } catch (e) {
        console.error(`Error parsing item from localStorage with key ${key}:`, e);
        return null;
    }
}

function safeSet<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error setting item in localStorage with key ${key}:`, e);
    }
}



export function getUsers(): User[] {
    return safeGet<User[]>(STORAGE_KEY.USERS) || [];
}

export function addUser (User: User): void {
    const users = getUsers();
    const UserExists = users.some(u => u.email === User.email);
    if (UserExists) {
        throw new Error('User with this email already exists');
    }
    safeSet<User[]>(STORAGE_KEY.USERS, [...users, User]);
}





export function getSession(): Session | null {
    return safeGet<Session>(STORAGE_KEY.SESSIONS);
}

export function saveSession(session: Session): void {
    safeSet<Session>(STORAGE_KEY.SESSIONS, session);
}

export function clearSession(): void {
    localStorage.removeItem(STORAGE_KEY.SESSIONS);
}





export function getHabits(): Habit[] | null {
    return safeGet<Habit[]>(STORAGE_KEY.HABITS);
}

export function saveHabits(habits: Habit[]): void {
    safeSet<Habit[]>(STORAGE_KEY.HABITS, habits);
}

export function addHabit(habit: Habit): void {
    const habits = getHabits() || [];
    saveHabits([...habits, habit]);
}

export function updateHabit(updatedHabit: Habit): void {
    const habits = getHabits() || [];
    const newHabits = habits.map(h => h.id === updatedHabit.id ? updatedHabit : h);
    saveHabits(newHabits);
}

export function deleteHabit(habitId: string): void {
    const habits = getHabits() || [];
    const newHabits = habits.filter(h => h.id !== habitId);
    saveHabits(newHabits);
}



export function seedHabits(userId: string) {
  const existing = getHabits() || [];

  const userHabits = existing.filter(h => h.userId === userId);
  if (userHabits.length > 0) return;

  const today = new Date().toISOString().slice(0, 10);

  const mock = [
    {
      id: crypto.randomUUID(),
      userId,
      name: 'Drink Water',
      description: '',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [today],
    },
    {
      id: crypto.randomUUID(),
      userId,
      name: 'Read Book',
      description: '',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    },
  ];

  saveHabits([...existing, ...mock]); 
}