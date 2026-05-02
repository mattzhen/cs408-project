import { test, expect } from '@playwright/test';



test.describe('Item details page - authenticated', () => {

  test.beforeEach(async ({ request, page }) => {
    await request.post('/test/reset');
    await page.goto('http://localhost:3000/login');
    await page.locator('#username').fill('testuser1');
    await page.locator('#password').fill('testpassword');
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);
  });

  test('should display item details page', async ({ page }) => {
    await page.goto('/item-details/1');
    await expect(page).toHaveTitle(/Viewing item details/);
    await expect(page.locator('dd').filter({ hasText: /^Avocado$/ })).toBeVisible();
  });

  test('should mark item obtained', async ({ page }) => {
    await page.goto('/item-details/2');
    await page.click('button:has-text("Mark Obtained")');

    await page.waitForURL(/groceries/);
    const obtainedCell = await page.locator('tr', { hasText: 'Loaf' }).locator('td').nth(3).innerText();
    expect(obtainedCell).toBe('Yes');
  });

  test('should not display other user item', async ({ page }) => {
    await page.goto('/item-details/4');
    await expect(page).toHaveTitle(/Viewing item details/);
    await expect(page.locator('dd').filter({ hasText: /^Bananas$/ })).toBeHidden();
  });

  test('delete item removes it from grocery list', async ({ page }) => {
    await page.goto('/item-details/1');
    await page.click('button:has-text("Delete Item")');
    await page.waitForURL(/groceries/);

    const row = page.locator('tr', { hasText: 'Avocado' });
    await expect(row).toBeHidden();
  });

});

test.describe('Item details page - unauthenticated', () => {

  test('should redirect to login', async ({ page }) => {
    await page.goto('/item-details/1');
    await expect(page).toHaveTitle(/Log in/);
  });

});
