"use client";
import Image from "next/image";

export function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text-primary px-4"
    data-testid="splash-screen"
    >
      <div className="text-center space-y-3">
        <Image
          src="/logo.png"
          alt="Habit Tracker Logo"
          width={64}
          height={64}
          className="mx-auto"
        />
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

