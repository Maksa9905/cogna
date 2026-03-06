import { test, expect } from "@playwright/test";

test.describe("Страница логина", () => {
  test("открывается и отображает форму входа", async ({ page }) => {
    await page.goto("/ru/auth/login");
    await expect(page.locator("input[type='email'], input[name='email']").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("редирект с корня ведёт на страницу авторизации", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(ru|en|de)\/auth\/login/);
  });
});
