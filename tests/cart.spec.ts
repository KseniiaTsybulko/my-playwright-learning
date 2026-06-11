import { test, expect, Locator } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { users } from "../test-data/users";
import { CartPage } from "../pages/CartPage";

test.describe("Cart tests", () => {
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

    test("Add products to cart", async ({ page }) => {
      await page.getByRole("button", { name: "Add to cart" }).nth(1).click();
      await page.getByRole("button", { name: "Add to cart" }).nth(2).click();
      await expect(
        page.locator(".shopping_cart_badge"),
        "Cart badge should show 2 after adding two products"
      ).toHaveText("2");
    });

    test("Remove product from cart", async ({ page }) => {
      await page.getByRole("button", { name: "Add to cart" }).nth(1).click();
      await page.getByRole("button", { name: "Remove" }).click();
      await expect(
        page.locator(".shopping_cart_badge"),
        "Cart badge should not be visible after removing product"
      ).not.toBeVisible();
    });



    test("Cart page shows the name of the selected product", async ({ page }) => {
      let productName = await page.
      locator('[data-test="inventory-item-name"]').first().textContent();
      await page.getByRole("button", { name: "Add to cart" }).nth(0).click();
      await page.locator('[data-test="shopping-cart-link"]').click();
      await expect(
        page.locator(".inventory_item_name"),
        "Cart badge should show the title of the products"
      ).toHaveText(productName!);
    });
});