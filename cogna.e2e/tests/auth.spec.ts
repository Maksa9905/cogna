import { test, expect } from "@playwright/test";

const LOCALE = "en";
const LOGIN_URL = `/${LOCALE}/auth/login`;
const SIGNUP_URL = `/${LOCALE}/auth/signup`;
const HOME_URL = `/${LOCALE}`;

const REGISTRATION_OTP = "555000";
const TEST_PASSWORD = "TestPass123";

test.describe("Registration and authorization", () => {
  test.describe.serial("Full flow", () => {
    test("registration: full flow with OTP confirmation and redirect to home", async ({
      page,
    }) => {
      const email = `e2e-reg-${Date.now()}@example.com`;

      await page.goto(SIGNUP_URL);

      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").first().fill(TEST_PASSWORD);
      await page.getByLabel("Confirm password").fill(TEST_PASSWORD);
      await page.getByRole("checkbox").check();
      await page.locator("form.signup-form").getByRole("button", { name: "Sign up" }).click();

      await expect(
        page.getByRole("heading", { name: /Confirmation/i })
      ).toBeVisible({ timeout: 15_000 });

      await page.getByLabel("Confirmation code").fill(REGISTRATION_OTP);
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page).toHaveURL(new RegExp(`^.*${HOME_URL}.*$`), {
        timeout: 15_000,
      });
      await expect(
        page.getByText("Добро пожаловать в Cogna!")
      ).toBeVisible();
    });

    test("login: successful authorization and redirect to home", async ({ page }) => {
      const email = `e2e-login-${Date.now()}@example.com`;

      await page.goto(SIGNUP_URL);
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").first().fill(TEST_PASSWORD);
      await page.getByLabel("Confirm password").fill(TEST_PASSWORD);
      await page.getByRole("checkbox").check();
      await page.locator("form.signup-form").getByRole("button", { name: "Sign up" }).click();

      await expect(
        page.getByRole("heading", { name: /Confirmation/i })
      ).toBeVisible({ timeout: 15_000 });
      await page.getByLabel("Confirmation code").fill(REGISTRATION_OTP);
      await page.getByRole("button", { name: "Confirm" }).click();

      await expect(page).toHaveURL(new RegExp(`^.*${HOME_URL}.*$`), {
        timeout: 15_000,
      });

      await page.getByRole("button", { name: /Sign out|Log out|Выйти/i }).click();
      await expect(page).toHaveURL(/\/(ru|en|de)\/auth\/login/, {
        timeout: 10_000,
      });

      await page.getByLabel("Email").fill(email);
      await page.locator("input[type='password']").fill(TEST_PASSWORD);
      await page.getByRole("button", { name: "Sign in to Cogna" }).click();

      await expect(page).toHaveURL(new RegExp(`^.*${HOME_URL}.*$`), {
        timeout: 15_000,
      });
      await expect(
        page.getByText("Добро пожаловать в Cogna!")
      ).toBeVisible();
    });
  });

  test.describe("Login page", () => {
    test("displays login form", async ({ page }) => {
      await page.goto(LOGIN_URL);

      await expect(
        page.locator("input[type='email'], input[name='email']").first()
      ).toBeVisible({ timeout: 15_000 });
      await expect(
        page.getByRole("button", { name: "Sign in to Cogna" })
      ).toBeVisible();
    });

    test("validation: empty fields show errors", async ({ page }) => {
      await page.goto(LOGIN_URL);

      await page.getByRole("button", { name: "Sign in to Cogna" }).click();

      await expect(
        page.getByText("Password is required")
      ).toBeVisible({ timeout: 5_000 });

      await expect(
        page.getByText("Email is required")
      ).toBeVisible({ timeout: 5_000 });
    });

    test("invalid credentials show error", async ({ page }) => {
      await page.goto(LOGIN_URL);

      await page.getByLabel("Email").fill("nonexistent@example.com");
      await page.locator("input[type='password']").fill("WrongPassword123");
      await page.getByRole("button", { name: "Sign in to Cogna" }).click();

      await expect(
        page.locator("span[role='alert']").getByText("User not found")
      ).toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe("Signup page", () => {
    test("displays signup form", async ({ page }) => {
      await page.goto(SIGNUP_URL);

      await expect(
        page.getByRole("heading", { name: /Create an account/i })
      ).toBeVisible({ timeout: 15_000 });
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password").first()).toBeVisible();
      await expect(page.getByLabel("Confirm password")).toBeVisible();
      await expect(
        page.locator("form.signup-form").getByRole("button", { name: "Sign up" })
      ).toBeVisible();
    });

    test("validation: terms agreement required", async ({
      page,
    }) => {
      await page.goto(SIGNUP_URL);

      await page.getByLabel("Email").fill("test@example.com");
      await page.getByLabel("Password").first().fill(TEST_PASSWORD);
      await page.getByLabel("Confirm password").fill(TEST_PASSWORD);
      await page.locator("form.signup-form").getByRole("button", { name: "Sign up" }).click();

      await expect(
        page.getByText("You must agree to the terms")
      ).toBeVisible({ timeout: 5_000 });
    });

    test("validation: password mismatch", async ({ page }) => {
      await page.goto(SIGNUP_URL);

      await page.getByLabel("Email").fill("test@example.com");
      await page.getByLabel("Password").first().fill(TEST_PASSWORD);
      await page.getByLabel("Confirm password").fill("DifferentPass123");
      await page.getByRole("checkbox").check();
      await page.locator("form.signup-form").getByRole("button", { name: "Sign up" }).click();

      await expect(
        page.getByText(/Passwords do not match|do not match/i)
      ).toBeVisible({ timeout: 5_000 });
    });
  });

  test.describe("Navigation", () => {
    test("redirect from root leads to auth page", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/(ru|en|de)\/auth\/login/);
    });

    test("navigate from login to signup", async ({ page }) => {
      await page.goto(LOGIN_URL);

      await page.getByRole("button", { name: "Sign up" }).click();
      await expect(page).toHaveURL(/\/(ru|en|de)\/auth\/signup/);
    });
  });
});
