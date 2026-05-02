import { test, expect } from '@playwright/test';



test.describe('Login page', () => {

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Log in/);
  });

  test('should login', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('testuser1');
    await page.locator('#password').fill('testpassword');
    await page.click('button[type="submit"]');
    await expect(page).toHaveTitle(/my groceries/i);
  });

  test('should not login', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('testuser1');
    await page.locator('#password').fill('badpassword');
    await page.click('button[type="submit"]');
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test('rejects SQL injection for username', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#username', "' OR 1=1 --");
    await page.fill('#password', 'anything');
    await page.click('button[type=submit]');

    await expect(page.locator('.alert-danger')).toBeVisible();
  });

  test('password injection does not bypass login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#username', 'testuser');
    await page.fill('#password', "' OR 1=1 --");
    await page.click('button[type=submit]');

    await expect(page.locator('.alert-danger')).toBeVisible();
  });

});
