import { Habit } from "../types/habit";
import  {User , Session} from "../types/auth";

const STORAGE_KEY = {
    USERS:'habit-tracker-users',
    SESSIONS:'habit-tracker-sessions',
    HABITS:'habit-tracker-habits',
}



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

export function addHabit(habit: Habit): void {
    const habits = getHabits() || [];
    safeSet<Habit[]>(STORAGE_KEY.HABITS, [...habits, habit]);
}

export function updateHabit(updatedHabit: Habit): void {
    const habits = getHabits() || [];
    const newHabits = habits.map(h => h.id === updatedHabit.id ? updatedHabit : h);
    safeSet<Habit[]>(STORAGE_KEY.HABITS, newHabits);
}

export function deleteHabit(habitId: string): void {
    const habits = getHabits() || [];
    const newHabits = habits.filter(h => h.id !== habitId);
    safeSet<Habit[]>(STORAGE_KEY.HABITS, newHabits);
}

