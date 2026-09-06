import { test, expect } from "@playwright/test";

const apiUrl = "http://localhost:8001";

async function emptyCart(request) {
  const response = await request.get(`${apiUrl}/api/cart/`);
  const cart = await response.json();

  for (const item of cart.items ?? []) {
    await request.post(`${apiUrl}/api/cart/remove/`, {
      data: { item_id: item.id },
    });
  }
}

test.beforeEach(async ({ request }) => {
  await emptyCart(request);
});

test("displays the product list", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Product List" }),
  ).toBeVisible();

  await expect(
    page.locator('a[href^="/product/"]').first(),
  ).toBeVisible();
});

test("opens a product and adds it to the cart", async ({ page }) => {
  await page.goto("/");

  await page.locator('a[href^="/product/"]').first().click();

  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();

  await page.getByRole("button", { name: "Add to Cart" }).click();

  await expect(page.getByRole("link", { name: /Cart/ })).toContainText("1");
});

test("increases the cart quantity", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href^="/product/"]').first().click();
  await page.getByRole("button", { name: "Add to Cart" }).click();

  await expect(page.getByRole("link", { name: /Cart/ })).toContainText("1");

  await page.getByRole("link", { name: /Cart/ }).click();

  await expect(
    page.getByRole("heading", { name: "Your Cart", exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "+" }).click();

  await expect(
    page.getByRole("button", { name: "+" }).locator("xpath=preceding-sibling::span"),
  ).toHaveText("2");
});

test("removes an item from the cart", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href^="/product/"]').first().click();
  await page.getByRole("button", { name: "Add to Cart" }).click();

  await page.getByRole("link", { name: /Cart/ }).click();
  await page.getByRole("button", { name: "Remove" }).click();

  await expect(page.getByText("Your cart is empty.")).toBeVisible();
});

test("places an order through checkout", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href^="/product/"]').first().click();
  await page.getByRole("button", { name: "Add to Cart" }).click();

  await page.getByRole("link", { name: /Cart/ }).click();
  await page.getByRole("link", { name: /Proceed to checkout/ }).click();

  await page.locator('input[name="name"]').fill("Test Customer");
  await page.locator('textarea[name="address"]').fill("123 Test Street");
  await page.locator('input[name="phone"]').fill("5551234567");

  await page.getByRole("button", { name: "Place Order" }).click();

  await expect(page.getByText("Order placed successfully!")).toBeVisible();
});