## Project Overview
A mobile-first Habit Tracker Progressive Web App that lets users sign up,
log in, create habits, mark them complete daily, track streaks, and install
the app on their device. All data is stored locally in localStorage — no
backend or database involved.

Stack: Next.js App Router, React, TypeScript, Tailwind CSS, localStorage,
Playwright, Vitest, React Testing Library. Hosted on Netlify.

## Setup Instructions
Prerequisites: Node.js 18+, npm

```bash
git clone <repo-url>
cd habit-tracker
npm install
```

## Run Instructions

Development:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm run start
```

Note: the service worker only registers in production or when
NEXT_PUBLIC_E2E=true is set. It does not run during normal development
to avoid stale cache issues.

## Test Instructions

All tests:
```bash
npm test
```

Unit tests only (also generates coverage report):
```bash
npm run test:unit
```

Integration tests only:
```bash
npm run test:integration
```

E2E tests only (Playwright starts the server automatically):
```bash
npm run test:e2e
```

## Local Persistence Structure
localStorage uses three keys:

- `habit-tracker-users` — array of `{id, email, password, createdAt}`
- `habit-tracker-session` — `{userId, email}` or `null`
- `habit-tracker-habits` — array of `{id, userId, name, description, frequency, createdAt, completions}`

`completions` is an array of YYYY-MM-DD strings, one per completed day.
Habits are filtered by `userId` so each user only sees their own data.

## PWA Support
- `public/manifest.json` defines name, icons, theme color, and display mode
- `public/sw.js` is the service worker — registered in production and during E2E tests
- All app routes (`/`, `/login`, `/signup`, `/dashboard`) and the manifest
  are precached at SW install time
- Navigation requests use network-first strategy, falling back to the
  cached route or `/` when offline
- Static assets (JS, CSS, images, fonts) use cache-first strategy
- Icons at `public/icons/icon-192.png` and `public/icons/icon-512.png`

## Trade-offs and Limitations
- Passwords are stored as plain text in localStorage — no hashing
- No server-side auth — data is readable via DevTools
- localStorage is device-specific — no cross-device sync
- localStorage has a ~5MB limit
- Service worker is disabled in development to prevent stale cache issues
- No real-time updates — all state is read from localStorage on each action

## How Implementation Maps to Requirements
| Requirement | Implementation |
|---|---|
| Sign up / log in / log out | `src/components/auth/SignupForm.tsx`, `LoginForm.tsx`, auth functions in `src/lib/auth.ts` |
| Create / edit / delete habits | `src/app/dashboard/page.tsx` + `src/components/habits/HabitCard.tsx` |
| Mark complete / unmark | `toggleHabitCompletion` in `src/lib/habits.ts` |
| Streak tracking | `calculateCurrentStreak` in `src/lib/streaks.ts` |
| localStorage persistence | `src/lib/storage.ts` with keys defined in `src/lib/constants.ts` |
| Protected dashboard route | `src/components/shared/ProtectedRoute.tsx` |
| Splash screen with redirect | `src/app/page.tsx` |
| PWA installable | `public/manifest.json` + `public/sw.js` |
| Mobile-first layout | Tailwind CSS with base mobile styles, `md:` and `xl:` breakpoints |

## Test File Map
| Test File | Type | Behavior Verified |
|---|---|---|
| `tests/unit/slug.test.ts` | Unit | `getHabitSlug` converts habit names to URL-safe slugs |
| `tests/unit/validators.test.ts` | Unit | `validateHabitName` enforces required and max-length rules |
| `tests/unit/streaks.test.ts` | Unit | `calculateCurrentStreak` counts consecutive completion days correctly |
| `tests/unit/habits.test.ts` | Unit | `toggleHabitCompletion` adds/removes dates without mutation or duplicates |
| `tests/integration/auth-flow.test.tsx` | Integration | Signup creates session, login validates credentials, duplicate and invalid error messages |
| `tests/integration/habit-form.test.tsx` | Integration | Create, edit, delete with confirmation gate, toggle completion, streak display update |
| `tests/e2e/app.spec.ts` | E2E | Splash redirect, auth routing guards, signup, login with user isolation, habit CRUD, persistence after reload, logout, offline PWA shell 