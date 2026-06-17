import { test, expect } from '@playwright/test';

test.describe('Core Navigation Flows', () => {
  test('should load the home page and render video cards', async ({ page }) => {
    await page.goto('/');
    
    // Wait for videos to load (either real API or our mock if we run against MSW,
    // but in E2E we usually hit the real mocked local server, wait for the app to finish loading skeletons)
    await expect(page.locator('a[href^="/watch?v="]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to search results', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder('Search');
    await searchInput.fill('Playwright test');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/\/results\?search_query=Playwright(%20|\+)test/);
  });
  
  test('should navigate to the library page via sidebar', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }
    await page.goto('/');
    
    // The sidebar might be collapsed or full depending on viewport.
    // Assuming Desktop viewport here from playwright config.
    const libraryLink = page.getByRole('link', { name: /History/i }).first();
    await libraryLink.click();
    
    await expect(page).toHaveURL(/\/library/);
    await expect(page.locator('h1').filter({ hasText: 'Library' })).toBeVisible();
  });
});
