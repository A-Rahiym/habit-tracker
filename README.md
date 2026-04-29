## Project Overview
A mobile-first Habit Tracker Progressive Web App that lets users sign up,
log in, create habits, mark them complete daily, track streaks, and install
the app on their device. All data is stored locally in localStorage — no
backend or database involved.

Stack: Next.js App Router, React, TypeScript, Tailwind CSS, localStorage,
Playwright, Vitest, React Testing Library. Hosted on Netlify.

## Setup Instructions
- Prerequisites: Node.js 18+, npm
- Clone the repo

```bash
npm install
```

## Run Instructions
- Development:

```bash
npm run dev
```

- Production build:

```bash
npm run build
npm run start
```

- Note: service worker only registers in production, not in development

## Test Instructions
- All tests:

```bash
npm test
```

- Unit only:

```bash
npm run test:unit
```

- Integration only:

```bash
npm run test:integration
```

- E2E only:

```bash
npm run test:e2e
```

- Note: requires dev server running on localhost:3000

## Local Persistence Structure
localStorage uses three keys:
- `habit-tracker-users`: array of {id, email, password, createdAt}
- `habit-tracker-session`: {userId, email} or null
- `habit-tracker-habits`: array of {id, userId, name, description, frequency, createdAt, completions}
completions is an array of YYYY-MM-DD strings — one per day completed.
Habits are filtered by userId so each user only sees their own data.

## PWA Support
- `public/manifest.json` defines name, icons, theme color, display mode
- `public/sw.js` is the service worker, registered only in production
- Navigation requests: network-first, falls back to cached shell offline
- Static assets (JS, CSS, images): cache-first
- `public/icons/icon-192.png` and `public/icons/icon-512.png` are cached on first request through the static-asset path

## Trade-offs and Limitations
- Passwords stored as plain text in localStorage — no hashing
- No server-side auth — data is readable via DevTools
- localStorage is device-specific — no cross-device sync
- ~5MB storage limit
- Offline support not testable in development — SW only active in production

## Test File Map
| Test File | Type | Behavior Verified |
| --- | --- | --- |
| `test/unit/slug.test.ts` | Unit | getHabitSlug slug generation |
| `test/unit/validator.test.ts` | Unit | validateHabitName rules |
| `test/unit/streaks.test.ts` | Unit | calculateCurrentStreak logic |
| `test/unit/habit.test.ts` | Unit | toggleHabitCompletion immutability and correctness |
| `test/integration/auth-flow.test.tsx` | Integration | Signup, login, duplicate and invalid credential errors |
| `test/integration/habit-form.test.tsx` | Integration | Create, edit, delete confirmation, toggle completion, streak update |
| `test/e2e/app.spec.ts` | E2E | Not currently checked in; Playwright dependency is installed but no e2e spec is present in the repo |
