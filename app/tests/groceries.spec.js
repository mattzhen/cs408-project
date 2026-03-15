import { test, expect } from '@playwright/test';



test.describe('View List page', () => {

  test('should display groceries page', async ({ page }) => {
    await page.goto('/groceries');
    await expect(page).toHaveTitle(/My Groceries/);
  });



});
