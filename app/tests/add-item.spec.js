import { test, expect } from '@playwright/test';



test.describe('Add item page - authenticated', () => {

  test.beforeEach(async ({ request, page }) => {
    await request.post('/test/reset');
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'testuser1');
    await page.fill('#password', 'testpassword');
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);
  });
  
  test('should display add item page', async ({ page }) => {
    await page.goto('/add-item');
    await expect(page).toHaveTitle(/Add to list/);
  });



});

test.describe('Add item page - unauthenticated', () => {

  test('should redirect to login', async ({ page }) => {
    await page.goto('/add-item');
    await expect(page).toHaveTitle(/Log in/);
  });

});