import { test, expect } from '@playwright/test';



test.describe('Landing Page', () => {

  test('should display landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/My Grocery List/);
  });



});
