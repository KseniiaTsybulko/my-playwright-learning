import { test, expect, Locator } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { users } from "../test-data/users";
import { CartPage } from "../pages/CartPage";

test.describe("Checkout Tests", () => {
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;
  let cartPage: CartPage;


  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    checkoutPage = new CheckoutPage(page);
    cartPage = new CartPage(page);
  });

  
    test("First name, last name, and postal code are entered", async ({ page }) => {

      await page.locator('[data-test="shopping-cart-link"]').click();
      await page.locator('[data-test="checkout"]').click();

      const firstNameInput = page.locator('[data-test="firstName"]');
      await firstNameInput.fill('Bob');
      const lastNameInput = page.locator('[data-test="lastName"]');
      await lastNameInput.fill('One');
      const postalCodeInput = page.locator('[data-test="postalCode"]');
      await postalCodeInput.fill('12345');

      await expect(
       (await firstNameInput.inputValue()).length,
       "First name input should be filled with the provided value"
      ).toBeGreaterThan(0);
      await expect(
        (await lastNameInput.inputValue()).length,
        "Last name input should be filled with the provided value"
      ).toBeGreaterThan(0);
      await expect(
        (await postalCodeInput.inputValue()).length,
        "Postal code input should be filled with the provided value"
      ).toBeGreaterThan(0);
    });


    test("Overview page shows the selected product", async ({ page }) => {
      const productName = await page
        .locator('[data-test="inventory-item-name"]')
        .first()
        .textContent();

      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

      await page.locator('.shopping_cart_link').click();
      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Bob');
      await page.locator('[data-test="lastName"]').fill('One');
      await page.locator('[data-test="postalCode"]').fill('12345');

      await page.locator('[data-test="continue"]').click();

      await expect(
        page.locator('[data-test="inventory-item-name"]')
      ).toHaveText(productName!);
    });


    test("Finish button is clicked", async ({ page }) => {
      await page.locator('[data-test="shopping-cart-link"]').click();
      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Bob');
      await page.locator('[data-test="lastName"]').fill('One');
      await page.locator('[data-test="postalCode"]').fill('12345');

      await page.locator('[data-test="continue"]').click();
      await page.locator('[data-test="finish"]').click();

      await expect(
        page.locator('[data-test="complete-header"]')
      ).toHaveText('Thank you for your order!');
    });


    test("Checkout process", async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="shopping-cart-link"]').click();
      await page.locator('[data-test="checkout"]').click();

      await page.locator('[data-test="firstName"]').fill('Bob');
      await page.locator('[data-test="lastName"]').fill('One');
      await page.locator('[data-test="postalCode"]').fill('12345');
      await page.locator('[data-test="continue"]').click();
      await page.locator('[data-test="finish"]').click();

      await expect(
        page.locator('[data-test="complete-header"]')
      ).toHaveText('Thank you for your order!');
    });
});