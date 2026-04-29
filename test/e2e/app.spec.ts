import { test, expect, type Page } from "@playwright/test";

const USERS_KEY = "habit-tracker-users";
const SESSION_KEY = "habit-tracker-session";
const HABITS_KEY = "habit-tracker-habits";

const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

function seedStorage(page: Page, {
  users = [],
  session = null,
  habits = [],
}: {
  users?: Array<{
    id: string;
    email: string;
    password: string;
    createdAt: string;
  }>;
  session?: { userId: string; email: string } | null;
  habits?: Array<{
    id: string;
    userId: string;
    name: string;
    description: string;
    frequency: "daily";
    createdAt: string;
    completions: string[];
  }>;
}) {
  return page.addInitScript(
    ({ users, session, habits, USERS_KEY, SESSION_KEY, HABITS_KEY }) => {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    },
    { users, session, habits, USERS_KEY, SESSION_KEY, HABITS_KEY }
  );
}

async function createHabit(page: Page, name: string, description = "") {
  await page.getByTestId("create-habit-button").click();
  await page.getByTestId("habit-name-input").fill(name);
  await page.getByTestId("habit-description-input").fill(description);
  await page.getByTestId("habit-save-button").click();
}

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await seedStorage(page, {
      users: [
        {
          id: "user-1",
          email: "alice@example.com",
          password: "secret123",
          createdAt: new Date().toISOString(),
        },
      ],
      session: { userId: "user-1", email: "alice@example.com" },
      habits: [],
    });

    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId("auth-login-submit")).toBeVisible();
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill("newuser@example.com");
    await page.getByTestId("auth-signup-password").fill("secret123");
    await page.getByTestId("auth-signup-submit").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await seedStorage(page, {
      users: [
        {
          id: "user-1",
          email: "alice@example.com",
          password: "secret123",
          createdAt: new Date().toISOString(),
        },
        {
          id: "user-2",
          email: "bob@example.com",
          password: "secret456",
          createdAt: new Date().toISOString(),
        },
      ],
      session: null,
      habits: [
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "8 glasses",
          frequency: "daily",
          createdAt: new Date().toISOString(),
          completions: [],
        },
        {
          id: "habit-2",
          userId: "user-2",
          name: "Read Books",
          description: "20 mins",
          frequency: "daily",
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ],
    });

    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill("alice@example.com");
    await page.getByTestId("auth-login-password").fill("secret123");
    await page.getByTestId("auth-login-submit").click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
    await expect(page.getByTestId("habit-card-read-books")).toHaveCount(0);
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await seedStorage(page, {
      users: [
        {
          id: "user-1",
          email: "alice@example.com",
          password: "secret123",
          createdAt: new Date().toISOString(),
        },
      ],
      session: { userId: "user-1", email: "alice@example.com" },
      habits: [],
    });

    await page.goto("/dashboard");
    await createHabit(page, "Drink Water", "Stay hydrated");

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("0 day streak");
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await seedStorage(page, {
      users: [
        {
          id: "user-1",
          email: "alice@example.com",
          password: "secret123",
          createdAt: new Date().toISOString(),
        },
      ],
      session: { userId: "user-1", email: "alice@example.com" },
      habits: [
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "8 glasses",
          frequency: "daily",
          createdAt: new Date().toISOString(),
          completions: [yesterday],
        },
      ],
    });

    await page.goto("/dashboard");
    await page.getByTestId("habit-complete-drink-water").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("2 day streak");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await seedStorage(page, {
      users: [
        {
          id: "user-1",
          email: "alice@example.com",
          password: "secret123",
          createdAt: new Date().toISOString(),
        },
      ],
      session: { userId: "user-1", email: "alice@example.com" },
      habits: [
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "8 glasses",
          frequency: "daily",
          createdAt: new Date().toISOString(),
          completions: [today],
        },
      ],
    });

    await page.goto("/dashboard");
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1 day streak");
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await seedStorage(page, {
      users: [
        {
          id: "user-1",
          email: "alice@example.com",
          password: "secret123",
          createdAt: new Date().toISOString(),
        },
      ],
      session: { userId: "user-1", email: "alice@example.com" },
      habits: [],
    });

    await page.goto("/dashboard");
    await page.getByLabel("Open account menu").click();
    await page.getByRole("button", { name: "Logout" }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId("auth-login-submit")).toBeVisible();
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({ page, context }) => {
    await seedStorage(page, {
      users: [
        {
          id: "user-1",
          email: "alice@example.com",
          password: "secret123",
          createdAt: new Date().toISOString(),
        },
      ],
      session: { userId: "user-1", email: "alice@example.com" },
      habits: [],
    });

    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    await context.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByText("Hello 👋")).toBeVisible();
    await context.setOffline(false);
  });
});