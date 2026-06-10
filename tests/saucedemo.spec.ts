import { test, expect, Locator } from "@playwright/test";;

test.describe("SauceDemo", () => {
  let usernameInput: Locator, passwordInput: Locator, loginButton: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
  });

  test.beforeEach(async ({ page }) => {
      usernameInput = page.getByPlaceholder("Username");
      passwordInput = page.getByPlaceholder("Password");
      loginButton = page.getByRole("button", { name: "Login" });
  });

  test.describe("SauceDemo Login Tests", () => {
    test("login shows dashboard", async ({ page }) => {
      await usernameInput.fill("standard_user");
      await passwordInput.fill("secret_sauce");
      await loginButton.click();
      await expect(page).toHaveURL(/inventory/);
  });

    test("login locked user", async ({ page }) => {
      await usernameInput.fill("locked_out_user");
      await passwordInput.fill("secret_sauce");
      await loginButton.click();
      await expect(
        page.locator('[data-test="error"]'),
      ).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });

    test("Login with wrong password", async ({ page }) => {
      await usernameInput.fill("standard_user");
      await passwordInput.fill("wrong_password");
      await loginButton.click();
      await expect(
        page.locator('[data-test="error"]'),
        'Error message should be displayed for wrong credentials'
      ).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test("Empty form validation", async ({ page }) => {
      await loginButton.click();
      await expect(
        page.locator('[data-test="error"]')
      ).toHaveText('Epic sadface: Username is required');
    });
  });

  test.describe("SauceDemo Cart Tests", () => {
    test.beforeEach(async () => {
      await usernameInput.fill("standard_user");
      await passwordInput.fill("secret_sauce");
      await loginButton.click();
    })

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
  });


  test.describe("SauceDemo Broken Tests", () => {
    test("login should redirect to inventory", async ({ page }) => {
      await page.goto("https://www.saucedemo.com");
      await page.getByPlaceholder("Username").fill("standard_user");   // ← is this the real placeholder?
      await page.getByPlaceholder("Password").fill("secret_sauce");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).toHaveURL(/inventory/);
    });
  


    test("error message on wrong password", async ({ page }) => {
      await page.goto("https://www.saucedemo.com");
      await page.getByPlaceholder("Username").fill("standard_user");
      await page.getByPlaceholder("Password").fill("wrong_password");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(
        page.locator('[data-test="error"]'),
        'Error message should be displayed for wrong credentials'
      ).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });
  


    test("cart badge appears after adding product", async ({ page }) => {
      await page.goto("https://www.saucedemo.com");
      await page.getByPlaceholder("Username").fill("standard_user");
      await page.getByPlaceholder("Password").fill("secret_sauce");
      await page.getByRole("button", { name: "Login" }).click();
      await page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();   // ← something missing here
      await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
    });
  });

  test.describe("SauceDemo Checkout Tests", () => {
    test.beforeEach(async () => {
      await usernameInput.fill("standard_user");
      await passwordInput.fill("secret_sauce");
      await loginButton.click();
    })

    test("Checkout process", async ({ page }) => {
      await page.getByRole("button", { name: "Add to cart" }).nth(4).click();
      await page.getByRole("button", { name: "Add to cart" }).nth(3).click();

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
  })
    

  
})