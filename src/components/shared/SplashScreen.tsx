"use client";

export function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary px-4"
    data-testid="splash-screen"
    >
      <div className="text-center space-y-3">

        <div className="text-2xl font-semibold tracking-tight">
          Habit Tracker
        </div>
        <div className="text-sm text-text-secondary">
          Loading…
        </div>
      </div>
    </div>
  );
}

