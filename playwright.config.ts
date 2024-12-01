// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'playwright-tests',
  snapshotPathTemplate: 'playwright-tests/snapshots/{testFilePath}-{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.2,
      threshold: 0.2,
    },
  },
  use: {
    baseURL: 'http://localhost:5173', // Set the base URL of your running server
  },
});
