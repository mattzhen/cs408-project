import { test, expect } from '@playwright/test';



test.describe('View List page', () => {

  test.beforeEach(async ({ request }) => {
    await request.post('/test/reset');
  });

  test('should display groceries page', async ({ page }) => {
    await page.goto('/groceries');
    await expect(page).toHaveTitle(/My Groceries/);
  });

  test('displays grocery list for logged in user', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'testuser1');
    await page.fill('#password', 'testpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('table')).toBeVisible();
  
    await expect(page.locator('text=Avocado')).toBeVisible();
    await expect(page.locator('text=Loaf of Whole Wheat Bread')).toBeVisible();
  
    await expect(page.locator('text=Bananas')).not.toBeVisible();
    await expect(page.locator('text=Spinach')).not.toBeVisible();
  });
  
  test('displays accurate price along with null warning', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'testuser2');
    await page.fill('#password', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('/groceries');
    
    await expect(page.locator('#nullWarning')).toBeVisible();
    
    await expect(page.locator('#totalCost')).toContainText('$5.00');
  });

});
