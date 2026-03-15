import { test, expect } from '@playwright/test';



test.describe('Item details page', () => {

  test('should display item details page', async ({ page }) => {
    await page.goto('/item-details');
    await expect(page).toHaveTitle(/Viewing item details/);
  });



});
