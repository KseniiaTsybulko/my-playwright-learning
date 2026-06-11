import { type Locator, type Page } from "@playwright/test";
export class CartPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async clickCartLink() {
    await this.cartLink.click();
  }

  async getCartBadgeText() {
    return await this.cartBadge.textContent();
  }
}   