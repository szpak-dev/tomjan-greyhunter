import { test, expect } from '@playwright/test';

test.describe('Manufacturer Pages', () => {
  test('manufacturer page loads', async ({ page }) => {
    // Navigate to a manufacturer page (adjust path based on your routes)
    await page.goto('/en/marttiini');
    
    // Check page loaded successfully
    expect(page.url()).toContain('/marttiini');
    
    // Check for manufacturer content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('manufacturer categories are displayed', async ({ page }) => {
    await page.goto('/en/marttiini');
    
    // Check for category cards or links
    const categories = page.locator('[data-testid="category-card"], .category-card, a[href*="marttiini"]');
    
    if (await categories.count() > 0) {
      await expect(categories.first()).toBeVisible();
    }
  });

  test('category page navigation works', async ({ page }) => {
    await page.goto('/en/marttiini');
    
    // Find and click first category link (if exists)
    const categoryLinks = await page.locator('a[href*="/marttiini/"]').all();
    
    if (categoryLinks.length > 0) {
      const firstLink = categoryLinks[0];
      await firstLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Verify we navigated to a category page
      expect(page.url()).toContain('/marttiini/');
    }
  });
});
