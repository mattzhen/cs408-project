import { test, expect } from '@playwright/test';



test.describe('Add item page - authenticated', () => {

  test.beforeEach(async ({ request, page }) => {
    await request.post('/test/reset');
    await page.goto('http://localhost:3000/login');
    await page.locator('#username').fill('testuser1');
    await page.locator('#password').fill('testpassword');
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);
    await page.goto('/add-item');
  });
  
  test('should display add item page', async ({ page }) => {
    await page.goto('/add-item');
    await expect(page).toHaveTitle(/Add to list/);
  });

  test('add item appears in grocery list', async ({ page }) => {
    await page.fill('#item_name', 'Bananas');
    await page.fill('#quantity', '3');
    await page.fill('#section', 'Fresh Fruit');
    await page.click('button:has-text("Add Item")');

    await page.waitForURL(/groceries/);

    const row = await page.locator('tr', { hasText: 'Bananas' });
    await expect(row).toBeVisible();
  });

  // Required fields
  test('should not submit without item name', async ({ page }) => {
    await page.locator('#quantity').fill('2');
    await page.locator('#section').fill('Dairy');
    await page.locator('button[type="submit"]').click();
    const message = await page.getByLabel('Item Name').evaluate(el => el.validationMessage);
    expect(message).not.toBe('');
  });

  test('should not submit without quantity', async ({ page }) => {
    await page.locator('#item_name').fill('Milk');
    await page.locator('#section').fill('Dairy');
    await page.locator('button[type="submit"]').click();
    const message = await page.getByLabel('Quantity').evaluate(el => el.validationMessage);
    expect(message).not.toBe('');
  });

  test('should not submit without section', async ({ page }) => {
    await page.locator('#item_name').fill('Milk');
    await page.locator('#quantity').fill('2');
    await page.locator('button[type="submit"]').click();
    const message = await page.getByLabel('Section').evaluate(el => el.validationMessage);
    expect(message).not.toBe('');
  });

  // Negative values
  test('should not allow negative quantity', async ({ page }) => {
    await page.locator('#item_name').fill('Milk');
    await page.locator('#quantity').fill('-1');
    await page.locator('#section').fill('Dairy');
    await page.locator('button[type="submit"]').click();
    const message = await page.getByLabel('Quantity').evaluate(el => el.validationMessage);
    expect(message).not.toBe('');
  });

  test('should not allow negative cost', async ({ page }) => {
    await page.locator('#item_name').fill('Milk');
    await page.locator('#quantity').fill('1');
    await page.locator('#section').fill('Dairy');
    await page.locator('#cost').fill('-5');
    await page.locator('button[type="submit"]').click();
    const message = await page.locator('#cost').evaluate(el => el.validationMessage);
    expect(message).not.toBe('');
  });

  // Limit to two decimals
  test('should not accept cost with more than two decimal places', async ({ page }) => {
    await page.locator('#item_name').fill('Milk');
    await page.locator('#quantity').fill('1');
    await page.locator('#section').fill('Dairy');
    await page.locator('#cost').fill('3.999');
    await page.locator('button[type="submit"]').click();
    const message = await page.locator('#cost').evaluate(el => el.validationMessage);
    expect(message).not.toBe('');
  });

});

test.describe('Add item page - unauthenticated', () => {

  test('should redirect to login', async ({ page }) => {
    await page.goto('/add-item');
    await expect(page).toHaveTitle(/Log in/);
  });

});