import { test, expect } from '@playwright/test';



test.describe('Create account page', () => {

  test.beforeEach(async ({ request }) => {
    await request.post('/test/reset');
  });

  test('should display create page', async ({ page }) => {
    await page.goto('/create-account');
    await expect(page).toHaveTitle(/Create Account/);
  });

  test('should show success message on valid account creation', async ({ page }) => {
    await page.goto('/create-account');
    await page.locator('#username').fill('testuser3');
    await page.locator('#password').fill('password');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Account created successfully!')).toBeVisible();
  });

  test('should show error message for existing user', async ({ page }) => {
    await page.goto('/create-account');
    await page.locator('#username').fill('testuser1');
    await page.locator('#password').fill('password');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Username is already taken.')).toBeVisible();
  });

});
