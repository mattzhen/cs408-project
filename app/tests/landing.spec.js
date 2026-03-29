import { test, expect } from '@playwright/test';



test.describe('Landing Page', () => {

  test('should display landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/My Grocery List/);
    await expect(page.getByAltText("Stock image of grocery bags")).toBeVisible();
    await expect(page.getByText(/Welcome to My Grocery List/)).toBeVisible();
    await expect(page.getByText(/To get started/)).toBeVisible();

  });

  test('should correctly navigate pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', {name: /create account/i}).click();
    await expect(page).toHaveTitle(/Create Account/);

    await page.goto('/');
    await page.getByRole('link', {name: /login/i}).click();
    await expect(page).toHaveTitle(/Log in/);
  });

});
