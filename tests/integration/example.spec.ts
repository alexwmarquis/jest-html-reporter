import { test, expect } from '@playwright/test';
import * as path from 'path';

const reportPath = 'file://' + path.resolve(__dirname, 'test-report.html');

test.beforeEach(async ({ page }) => {
  await page.goto(reportPath);
});

test('should display the correct page title and subtitle', async ({ page }) => {
  await expect(page).toHaveTitle(/E2E Test Report/);
  const subtitle = page.getByTestId('report-subtitle');
  await expect(subtitle).toHaveText('Generated for Playwright E2E testing');
});

test('should show correct summary counts', async ({ page }) => {
  const allCount = page.getByTestId('filter-chip-all').locator('.count');
  const passedCount = page.getByTestId('filter-chip-passed').locator('.count');
  const failedCount = page.getByTestId('filter-chip-failed').locator('.count');
  const skippedCount = page.getByTestId('filter-chip-skipped').locator('.count');

  await expect(allCount).toHaveText('12');
  await expect(passedCount).toHaveText('7');
  await expect(failedCount).toHaveText('3');
  await expect(skippedCount).toHaveText('2'); // pending (1) + todo (1)
});

test('should filter tests when clicking on filter chips', async ({ page }) => {
  // Click on "Failed" filter
  await page.getByTestId('filter-chip-failed').click();

  // Check that only failed tests are visible
  // We use :visible because the other tests are hidden with display: none
  const visibleTests = page.getByTestId('test-item').filter({ visible: true });
  const count = await visibleTests.count();
  // In our mock, we have 3 failed tests
  expect(count).toBe(3);

  // Click on "Passed" filter
  await page.getByTestId('filter-chip-passed').click();
  const passedVisibleCount = await page.getByTestId('test-item').filter({ visible: true }).count();
  expect(passedVisibleCount).toBe(7);
});

test('should search and filter tests', async ({ page }) => {
  const searchInput = page.getByTestId('search-input');
  await searchInput.fill('user data');

  // There is 1 test with "user data" in the title in our mock
  const visibleTests = page.getByTestId('test-item').filter({ visible: true });
  await expect(visibleTests).toHaveCount(1);

  await searchInput.fill('calculation');
  await expect(visibleTests).toHaveCount(1);
});

test('should toggle themes', async ({ page }) => {
  const html = page.locator('html');
  await expect(html).toHaveClass(/theme-dark/);

  // Open theme menu
  await page.getByTestId('theme-toggle').click();
  const themeMenu = page.getByTestId('theme-menu');
  await expect(themeMenu).toBeVisible();

  // Select light theme
  await page.getByTestId('theme-option-light').click();
  await expect(html).toHaveClass(/theme-light/);
  await expect(html).not.toHaveClass(/theme-dark/);

  // Select github theme
  await page.getByTestId('theme-toggle').click();
  await page.getByTestId('theme-option-github').click();
  await expect(html).toHaveClass(/theme-github/);
});

test('should expand/collapse suites', async ({ page }) => {
  const firstSuite = page.getByTestId('test-suite').first();
  const suiteBody = firstSuite.getByTestId('suite-body');

  // Initially expanded in our report (default)
  await expect(suiteBody).toBeVisible();

  // Click header to collapse
  await firstSuite.getByTestId('suite-header').click();
  await expect(suiteBody).not.toBeVisible();
  await expect(firstSuite).toHaveClass(/collapsed/);

  // Click again to expand
  await firstSuite.getByTestId('suite-header').click();
  await expect(suiteBody).toBeVisible();
  await expect(firstSuite).not.toHaveClass(/collapsed/);
});

test('should show environment info', async ({ page }) => {
  const envInfo = page.getByTestId('environment-info');
  await expect(envInfo).toBeVisible();

  const envGrid = envInfo.getByTestId('environment-grid');
  await expect(envGrid).toBeVisible();

  // Test collapsing env info
  await envInfo.getByTestId('environment-header').click();
  await expect(envGrid).not.toBeVisible();
  await expect(envInfo).toHaveClass(/collapsed/);
});
