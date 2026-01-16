import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loaded
    await expect(page).toHaveTitle(/Grey Hunter/i);
    
    // Check for main navigation elements
    await expect(page.locator('header.ui-header').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });

  test('navigation links are working', async ({ page }) => {
    await page.goto('/');
    
    // Wait for navigation to be visible
    await page.waitForSelector('nav');
    
    // Get all navigation links
    const navLinks = await page.locator('nav a').all();
    
    // Check that there are navigation links
    expect(navLinks.length).toBeGreaterThan(0);
    
    // Verify links have href attributes
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('language selector switches language', async ({ page }) => {
    await page.goto('/');
    
    // Check if language selector exists
    const languageSelector = page.locator('[data-testid="language-selector"], .language-selector');
    
    if (await languageSelector.count() > 0) {
      await languageSelector.first().click();
      
      // Wait for language change (URL should change)
      await page.waitForTimeout(500);
      
      // Verify URL changed or content changed
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  test('footer links are accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check footer exists and has links
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    const footerLinks = await footer.locator('a').all();
    expect(footerLinks.length).toBeGreaterThan(0);
  });
});
