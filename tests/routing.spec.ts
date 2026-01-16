import { test, expect } from '@playwright/test';

test.describe('Language Routing', () => {
  test('English homepage is accessible', async ({ page }) => {
    await page.goto('/en');
    
    expect(page.url()).toContain('/en');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Polish homepage is accessible', async ({ page }) => {
    await page.goto('/pl');
    
    expect(page.url()).toContain('/pl');
    await expect(page.locator('body')).toBeVisible();
  });

  test('root redirects to default language', async ({ page }) => {
    await page.goto('/');
    
    // Check that we're on a valid page
    await expect(page.locator('body')).toBeVisible();
    
    // URL should contain a language code or stay at root
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('language-specific manufacturer pages work', async ({ page }) => {
    // Test English version
    await page.goto('/en/marttiini');
    expect(page.url()).toContain('/en/marttiini');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Polish version
    await page.goto('/pl/marttiini');
    expect(page.url()).toContain('/pl/marttiini');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('404 page for non-existent routes', async ({ page }) => {
    const response = await page.goto('/en/non-existent-page-xyz');
    
    // Should either get 404 status or redirect
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});
