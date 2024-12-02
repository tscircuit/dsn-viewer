import { test, expect } from '@playwright/test';

test.describe('DSN Viewer Example Button Test', () => {
  test('Click "Open Example" and take a snapshot', async ({ page }) => {
    // Navigate to the DSN viewer website
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Click the "Open Example" button
    const openExampleButton = await page.getByRole('button', { name: /open example/i });
    await openExampleButton.click();
    
    // Wait for any dynamic content to load
    // Instead of a fixed timeout, wait for specific UI changes
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await expect(page).toHaveScreenshot('snapshot-after-click.png');
  });
});