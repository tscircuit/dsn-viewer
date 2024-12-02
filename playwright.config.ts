// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright-tests',
  snapshotPathTemplate: '{testDir}/snapshots/{testFilePath}-snapshots/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.2,
      threshold: 0.2,
    },
  },
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'bun run preview:test',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  reporter: [['html'], ['list']],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
});