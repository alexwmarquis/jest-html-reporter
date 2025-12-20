/**
 * Edge case E2E tests.
 *
 * Tests unusual data scenarios using different test data variants.
 */

import { test, expect } from './fixtures/test-fixtures';

test.describe('Empty Report', () => {
  test('should display empty state when no tests exist', async ({ useReportVariant, page }) => {
    await useReportVariant('empty');

    // Should show 0 for all counts
    const allCount = page.getByTestId('filter-chip-all').locator('.count');
    await expect(allCount).toHaveText('0');
  });
});

test.describe('Single Test', () => {
  test('should display correctly with just one test', async ({ useReport, page }) => {
    await useReport({ data: 'single', config: 'standard' });

    const allCount = page.getByTestId('filter-chip-all').locator('.count');
    await expect(allCount).toHaveText('1');

    const suites = page.getByTestId('test-suite');
    await expect(suites).toHaveCount(1);

    const tests = page.getByTestId('test-item');
    await expect(tests).toHaveCount(1);
  });
});

test.describe('All Passing', () => {
  test('should show success state when all tests pass', async ({ useReportVariant, page }) => {
    await useReportVariant('allPassing');

    const failedCount = page.getByTestId('filter-chip-failed').locator('.count');
    await expect(failedCount).toHaveText('0');

    // No failed tests should be visible
    const failedTests = page.locator('[data-status="failed"]');
    await expect(failedTests).toHaveCount(0);
  });
});

test.describe('All Failing', () => {
  test('should show failure state when all tests fail', async ({ useReportVariant, page }) => {
    await useReportVariant('allFailing');

    const passedCount = page.getByTestId('filter-chip-passed').locator('.count');
    await expect(passedCount).toHaveText('0');

    // All visible tests should be failed
    const tests = page.getByTestId('test-item');
    const count = await tests.count();

    for (let i = 0; i < count; i++) {
      await expect(tests.nth(i)).toHaveAttribute('data-status', 'failed');
    }
  });
});

test.describe('Verbose Errors', () => {
  test('should display long error messages correctly', async ({ useReportVariant, page }) => {
    await useReportVariant('verboseErrors');

    // Find a failed test and check the error is displayed
    const failedTest = page.getByTestId('test-item').filter({ hasText: 'long stack trace' });
    await expect(failedTest).toBeVisible();

    // The error should contain the stack trace
    const errorContent = failedTest.locator('.error-block');
    await expect(errorContent.first()).toContainText('function');
  });
});

test.describe('Deeply Nested Suites', () => {
  test('should display nested ancestor titles', async ({ useReportVariant, page }) => {
    await useReportVariant('deeplyNested');

    // Should show the deeply nested test
    const nestedTest = page.getByTestId('test-item').filter({ hasText: 'deeply nested test' });
    await expect(nestedTest).toBeVisible();
  });
});

test.describe('Large Report Performance', () => {
  test('should load large report without timeout', async ({ useReportVariant, page }) => {
    // This test verifies the report can handle 200 tests
    await useReportVariant('large');

    // Verify the report loaded
    const allCount = page.getByTestId('filter-chip-all').locator('.count');
    await expect(allCount).toHaveText('200');
  });

  test('should filter large report quickly', async ({ useReportVariant, page }) => {
    await useReportVariant('large');

    // Click filter and measure responsiveness
    const start = Date.now();
    await page.getByTestId('filter-chip-failed').click();
    const elapsed = Date.now() - start;

    // Should complete within a reasonable time (1 second)
    expect(elapsed).toBeLessThan(1000);

    // Verify filter worked
    const visibleTests = page.getByTestId('test-item').filter({ visible: true });
    const count = await visibleTests.count();
    expect(count).toBeGreaterThan(0);
  });
});
