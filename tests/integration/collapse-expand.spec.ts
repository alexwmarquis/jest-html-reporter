/**
 * Collapse/Expand behavior E2E tests.
 *
 * Tests different collapse configurations using the fixture system.
 */

import { test, expect } from './fixtures/test-fixtures';

test.describe('Collapse Passed Tests', () => {
  test('passed suites should be collapsed when collapsePassed is true', async ({
    useReportWith,
    page,
  }) => {
    await useReportWith('mixed', 'collapsedPassed');

    // Find all test suites
    const suites = page.getByTestId('test-suite');
    const count = await suites.count();

    for (let i = 0; i < count; i++) {
      const suite = suites.nth(i);
      const suiteBody = suite.getByTestId('suite-body');
      const hasFailures = await suite.locator('[data-status="failed"]').count();

      if (hasFailures === 0) {
        // Passed-only suites should be collapsed
        await expect(suite).toHaveClass(/collapsed/);
        await expect(suiteBody).not.toBeVisible();
      } else {
        // Suites with failures should be expanded
        await expect(suiteBody).toBeVisible();
      }
    }
  });
});

test.describe('Collapse All Tests', () => {
  test('all suites should be collapsed when collapseAll is true', async ({
    useReportWith,
    page,
  }) => {
    await useReportWith('mixed', 'collapsedAll');

    const suites = page.getByTestId('test-suite');
    const count = await suites.count();

    for (let i = 0; i < count; i++) {
      const suite = suites.nth(i);
      await expect(suite).toHaveClass(/collapsed/);
      await expect(suite.getByTestId('suite-body')).not.toBeVisible();
    }
  });

  test('clicking collapsed suite should expand it', async ({ useReportWith, page }) => {
    await useReportWith('mixed', 'collapsedAll');

    const firstSuite = page.getByTestId('test-suite').first();
    const suiteBody = firstSuite.getByTestId('suite-body');

    // Initially collapsed
    await expect(suiteBody).not.toBeVisible();

    // Click to expand
    await firstSuite.getByTestId('suite-header').click();
    await expect(suiteBody).toBeVisible();
    await expect(firstSuite).not.toHaveClass(/collapsed/);
  });
});

test.describe('Default Expand Behavior', () => {
  test('all suites should be expanded by default', async ({ useReportVariant, page }) => {
    await useReportVariant('standard');

    const suites = page.getByTestId('test-suite');
    const count = await suites.count();

    for (let i = 0; i < count; i++) {
      const suite = suites.nth(i);
      await expect(suite).not.toHaveClass(/collapsed/);
      await expect(suite.getByTestId('suite-body')).toBeVisible();
    }
  });
});
