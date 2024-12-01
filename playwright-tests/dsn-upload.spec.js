import { test, expect } from '@playwright/test';

test.describe('DSN Viewer Example Button Test', () => {
  test('Click "Open Example" and take a snapshot', async ({ page }) => {
    // Navigate to the DSN viewer website
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Click the "Open Example" button
    const openExampleButton = await page.locator('button:has-text("open example")');
    await openExampleButton.click();

    // Wait for the page to update after clicking the button
    await page.waitForTimeout(10000); // Adjust this if needed for dynamic content loading

    // Take a snapshot of the current state
    await expect(page).toHaveScreenshot('snapshot-after-click.png');

    // // Optionally, assert a specific element to confirm the example loaded
    // const exampleLoadedElement = await page.locator('text=Example Loaded'); // Replace with actual content
    // await expect(exampleLoadedElement).toBeVisible();
  });
});
