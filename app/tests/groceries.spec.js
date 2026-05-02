import { test, expect } from '@playwright/test';



test.describe('View List page', () => {

  test.beforeEach(async ({ request }) => {
    await request.post('/test/reset');
  });

  test('should redirect to login', async ({ page }) => {
    await page.goto('/groceries');
    await expect(page).toHaveTitle(/Log in/);
  });

  test('displays grocery list for logged in user', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.locator('#username').fill('testuser1');
    await page.locator('#password').fill('testpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('table')).toBeVisible();
  
    await expect(page.locator('text=Avocado')).toBeVisible();
    await expect(page.locator('text=Loaf of Whole Wheat Bread')).toBeVisible();
    await expect(page.locator('text=Orange Juice')).toBeVisible();
  
    await expect(page.locator('text=Bananas')).toBeHidden();
    await expect(page.locator('text=Spinach')).toBeHidden();
  });
  
  test('displays accurate price along with null warning', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('testuser2');
    await page.locator('#password').fill('testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('/groceries');
    
    await expect(page.locator('#nullWarning')).toBeVisible();
    
    await expect(page.locator('#totalCost')).toContainText('$5.00');
  });

  test('delete obtained items removes obtained items from list', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('testuser1');
    await page.locator('#password').fill('testpassword');
    await page.click('button[type="submit"]');

    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Delete Obtained Items")');
    await page.waitForURL(/groceries/);

    await expect(page.locator('tr', { hasText: 'Avocado' })).toBeHidden();
    await expect(page.locator('tr', { hasText: 'Orange Juice' })).toBeHidden();
    await expect(page.locator('tr', { hasText: 'Loaf of Whole Wheat Bread' })).toBeVisible();
  });

});
