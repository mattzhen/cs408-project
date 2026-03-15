import { test, expect } from '@playwright/test';



test.describe('Add item page', () => {

  test('should display add item page', async ({ page }) => {
    await page.goto('/add-item');
    await expect(page).toHaveTitle(/Add to list/);
  });



});
