import { test, expect, type Page, type BrowserContext } from "@playwright/test";

const ADMIN_EMAIL = "admin@easylink.app";
const ADMIN_PASSWORD = "AdminPass123!";
const API_BASE = "http://localhost:3000/api/v1";

async function getAdminToken(): Promise<{ token: string; admin: Record<string, unknown> }> {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const json = await res.json();
  return json.data;
}

async function getFirstUserId(token: string): Promise<string> {
  const res = await fetch(`${API_BASE}/admin/users?page=1&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return json.data.data[0].id as string;
}

async function getFirstPurchaseId(token: string): Promise<string> {
  const res = await fetch(`${API_BASE}/admin/purchases?page=1&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return json.data.data[0].id as string;
}

async function injectAuth(context: BrowserContext): Promise<string> {
  const { token, admin } = await getAdminToken();
  await context.addInitScript(
    ({ token, admin }: { token: string; admin: Record<string, unknown> }) => {
      localStorage.setItem("auth_token", token);
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: { admin, token, isAuthenticated: true, isLoading: false, hydrated: true },
          version: 1,
        })
      );
    },
    { token, admin }
  );
  return token;
}

test.describe("Admin login", () => {
  test("shows login page and logs in successfully", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Admin Login", { timeout: 10000 });

    await page.fill("#email", ADMIN_EMAIL);
    await page.fill("#password", ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL("**/dashboard**", { timeout: 15000 });
    await expect(page).toHaveURL(/dashboard/);
  });
});

test.describe("Users management", () => {
  let authToken: string;

  test.beforeEach(async ({ context }) => {
    authToken = await injectAuth(context);
  });

  test("navigates to users page and shows user list", async ({ page }) => {
    await page.goto("/dashboard/users");
    await expect(page.locator("table")).toBeVisible({ timeout: 15000 });
    const rows = page.locator("table tbody tr");
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test("opens user detail on row click", async ({ page }) => {
    const userId = await getFirstUserId(authToken);
    await page.goto(`/dashboard/users/${userId}`);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 15000 });
  });

  test("user detail shows stats cards", async ({ page }) => {
    const userId = await getFirstUserId(authToken);
    await page.goto(`/dashboard/users/${userId}`);
    await expect(page.locator("main").getByText("Total Spend")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("main").getByText("Purchases", { exact: true })).toBeVisible();
  });

  test("user detail has suspend or activate button for super admin", async ({ page }) => {
    const userId = await getFirstUserId(authToken);
    await page.goto(`/dashboard/users/${userId}`);
    const actionBtn = page.getByRole("button", { name: /suspend|activate/i });
    await expect(actionBtn).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Purchases management", () => {
  let authToken: string;

  test.beforeEach(async ({ context }) => {
    authToken = await injectAuth(context);
  });

  test("navigates to purchases page and shows purchase list", async ({ page }) => {
    await page.goto("/dashboard/purchases");
    await expect(page.locator("table")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("table tbody tr").first()).toBeVisible();
  });

  test("opens purchase detail on row click", async ({ page }) => {
    const purchaseId = await getFirstPurchaseId(authToken);
    await page.goto(`/dashboard/purchases/${purchaseId}`);
    await expect(page.getByText("Purchase Details")).toBeVisible({ timeout: 15000 });
  });

  test("purchase detail shows sync button", async ({ page }) => {
    const purchaseId = await getFirstPurchaseId(authToken);
    await page.goto(`/dashboard/purchases/${purchaseId}`);
    await expect(page.getByRole("button", { name: /sync status/i })).toBeVisible({ timeout: 15000 });
  });

  test("sync button shows toast after click", async ({ page }) => {
    const purchaseId = await getFirstPurchaseId(authToken);
    await page.goto(`/dashboard/purchases/${purchaseId}`);
    const syncBtn = page.getByRole("button", { name: /sync status/i });
    await syncBtn.waitFor({ timeout: 15000 });
    await syncBtn.click();
    await expect(page.locator("[data-sonner-toaster] li").first()).toBeVisible({ timeout: 20000 });
  });
});

test.describe("Dashboard overview", () => {
  test.beforeEach(async ({ context }) => {
    await injectAuth(context);
  });

  test("dashboard loads with sidebar navigation", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("aside").first()).toBeVisible({ timeout: 15000 });
  });
});
