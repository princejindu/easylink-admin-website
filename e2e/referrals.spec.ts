import { test, expect, type BrowserContext } from "@playwright/test";

const ADMIN_EMAIL = "admin@easylink.app";
const ADMIN_PASSWORD = "AdminPass123!";
const API_BASE = "http://localhost:3000/api/v1";

async function getAdminSession(): Promise<{ token: string; admin: Record<string, unknown> }> {
  const res = await fetch(`${API_BASE}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const json = await res.json();
  return json.data;
}

async function injectAuth(context: BrowserContext): Promise<string> {
  const { token, admin } = await getAdminSession();
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

async function getRate(token: string): Promise<number> {
  const res = await fetch(`${API_BASE}/admin/referrals/commission-rate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  return json.data.commissionPercent as number;
}

async function setRate(token: string, commissionPercent: number): Promise<void> {
  await fetch(`${API_BASE}/admin/referrals/commission-rate`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ commissionPercent }),
  });
}

test.describe("Referrals", () => {
  let authToken: string;

  test.beforeEach(async ({ context }) => {
    authToken = await injectAuth(context);
  });

  test("commission rate card rejects values above 50", async ({ page }) => {
    await page.goto("/dashboard/referrals");
    const input = page.locator("#commission-percent");
    await input.waitFor({ timeout: 15000 });
    await input.fill("50.5");
    await expect(page.getByText("Rate must be between 0 and 50")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
    await expect(page.getByText("Applies to new purchases only.")).toBeVisible();
  });

  test("commission rate saves after confirmation", async ({ page }) => {
    const original = await getRate(authToken);
    const next = original === 7.5 ? 8 : 7.5;
    try {
      await page.goto("/dashboard/referrals");
      const input = page.locator("#commission-percent");
      await input.waitFor({ timeout: 15000 });
      await input.fill(String(next));
      page.once("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText(`Commission rate set to ${next}%`)).toBeVisible({ timeout: 10000 });
      expect(await getRate(authToken)).toBe(next);
    } finally {
      await setRate(authToken, original);
    }
  });

  test("wallets tab is reachable from the URL", async ({ page }) => {
    await page.goto("/dashboard/referrals?tab=wallets");
    await expect(page.getByRole("tab", { name: "Wallets" })).toHaveAttribute("aria-selected", "true", {
      timeout: 15000,
    });
    await expect(page.getByText("Search filters the current page only.")).toBeVisible();
  });
});
