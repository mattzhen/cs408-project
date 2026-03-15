import { test, expect } from '@playwright/test';



test.describe('Login page', () => {

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Log in/);
  });



});
