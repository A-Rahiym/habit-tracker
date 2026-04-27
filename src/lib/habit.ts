import type { Habit } from "../types/habit";

export function toggleHabitCompletion(
    habit: Habit,
    date: string
): Habit{
    const hasDate = habit.completions.includes(date);
    let newCompletions : string[] = [];

    if (hasDate) {

        newCompletions = habit.completions.filter(d => d !== date);
    } else{
        newCompletions = [...habit.completions, date]
    }

    newCompletions = Array.from(new Set(newCompletions))

    return{
        ...habit,
        completions: newCompletions,
    }

}