export function calculateCurrentStreak(
    completions: string[],
    today?: string
): number {
    if (!completions.length) return 0;

    const uniqueDates = Array.from(new Set(completions));

    const sorted = uniqueDates.sort();
    const currentDay = today ?? new Date().toISOString().slice(0, 10);
    if (!sorted.includes(currentDay)) return 0;
    let streak = 0

    let pointer = new Date(currentDay);

    while (true) {
        const dateStr = pointer.toISOString().slice(0, 10);
        if (sorted.includes(dateStr)) {
            streak++;
            pointer.setDate(pointer.getDate() - 1);
        } else {
            break;
        }

    }
    return streak
}