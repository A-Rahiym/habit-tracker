"use client";

export function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary px-4"
    data-testid="splash-screen"
    >
      <div className="text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
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

