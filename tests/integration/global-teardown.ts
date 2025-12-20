/**
 * Global teardown for Playwright E2E tests.
 * Cleans up generated reports after all tests complete.
 */

import { test as teardown } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { cleanupGeneratedReports } from './fixtures';

teardown('cleanup generated reports', async () => {
  console.log('Cleaning up generated reports...');

  // Clean up dynamically generated reports
  cleanupGeneratedReports();

  // Clean up legacy report location
  const legacyPath = path.resolve(__dirname, 'test-report.html');
  const legacyJsonPath = path.resolve(__dirname, 'test-report.json');

  if (fs.existsSync(legacyPath)) {
    fs.unlinkSync(legacyPath);
  }
  if (fs.existsSync(legacyJsonPath)) {
    fs.unlinkSync(legacyJsonPath);
  }

  console.log('Cleanup complete');
});
