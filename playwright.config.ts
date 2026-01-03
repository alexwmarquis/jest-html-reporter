import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import process from 'node:process';
import path from 'node:path';

const config: PlaywrightTestConfig = {
  testDir: './tests/integration',
  timeout: 30 * 1000,
  fullyParallel: true,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'on-failure' }]],
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: `file://${path.join(__dirname, 'jest-report.html')}`,
    video: 'on-first-retry',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: true,
    channel: 'chrome',
  },
  projects: [
    {
      name: 'global-setup',
      testMatch: 'global-setup.ts',
      teardown: 'global-teardown',
    },
    {
      name: 'global-teardown',
      testMatch: 'global-teardown.ts',
    },
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },

      grepInvert: /@mobile/,
      dependencies: ['global-setup'],
      teardown: 'global-teardown',
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'], channel: 'chrome' },
      grep: /@responsive|@mobile/,
      dependencies: ['global-setup'],
      teardown: 'global-teardown',
    },
  ],
};

export default config;
