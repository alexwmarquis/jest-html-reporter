/**
 * Global setup for Playwright E2E tests.
 *
 * This file is now minimal - it just pre-generates the standard report
 * for backward compatibility with existing tests.
 *
 * For new tests, use the fixture system instead:
 * - Import { test } from './fixtures/test-fixtures'
 * - Use useReport(), useReportVariant(), or useReportWith()
 *
 * See: ./fixtures/README.md for full documentation
 */

import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { generateReport, cleanupGeneratedReports } from './fixtures';

setup('generate sample reports', async () => {
  console.log('Generating sample reports for E2E tests...');

  // Clean up any stale reports from previous runs
  cleanupGeneratedReports();

  // Generate the standard report for backward compatibility
  const standardReport = generateReport({
    data: 'mixed',
    config: 'standard',
  });

  // Also create a symlink/copy at the legacy location for existing tests
  const legacyPath = path.resolve(__dirname, 'test-report.html');
  const legacyJsonPath = path.resolve(__dirname, 'test-report.json');

  // Copy instead of symlink for cross-platform compatibility
  fs.copyFileSync(standardReport.htmlPath, legacyPath);
  if (standardReport.jsonPath) {
    fs.copyFileSync(standardReport.jsonPath, legacyJsonPath);
  }

  expect(fs.existsSync(legacyPath)).toBe(true);
  console.log('Sample reports generated successfully');
  console.log('  Standard report:', standardReport.htmlPath);
  console.log('  Legacy path:', legacyPath);
});
