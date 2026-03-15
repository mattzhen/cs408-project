import { test, expect } from '@playwright/test';



test.describe('Create account page', () => {

  test('should display create page', async ({ page }) => {
    await page.goto('/create-account');
    await expect(page).toHaveTitle(/Create Account/);
  });



});
