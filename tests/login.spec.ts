import { test, expect, Locator } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { users } from "../test-data/users";

test.describe("SauceDemo", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    
  });

  test.describe("Login Tests", () => {
    test("login shows dashboard", async ({ page }) => {
      await loginPage.login(users.standard.username, users.standard.password);
      await expect(page).toHaveURL(/inventory/);
  });

    test("login locked user", async ({ page }) => {
      await loginPage.login(users.locked.username, users.locked.password);
      await expect(
        page.locator('[data-test="error"]'),
      ).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });

    test("Login with wrong password", async ({ page }) => {
      await loginPage.login("standard_user", "wrong_password");
      await expect(
        page.locator('[data-test="error"]'),
        'Error message should be displayed for wrong credentials'
      ).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test("Empty form validation", async ({ page }) => {
      await loginPage.login("", "");
      await expect(
        page.locator('[data-test="error"]')
      ).toHaveText('Epic sadface: Username is required');
    });
  });

});