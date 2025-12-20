/**
 * Theme-related E2E tests.
 *
 * Demonstrates using the fixture system to test different theme configurations.
 */

import { test, expect } from './fixtures/test-fixtures';

test.describe('Theme Display', () => {
  test('should display dark theme correctly', async ({ useReportVariant, page }) => {
    await useReportVariant('darkTheme');

    const html = page.locator('html');
    await expect(html).toHaveClass(/theme-dark/);
  });

  test('should display light theme correctly', async ({ useReportVariant, page }) => {
    await useReportVariant('lightTheme');

    const html = page.locator('html');
    await expect(html).toHaveClass(/theme-light/);
  });

  test('should show theme toggle when enabled', async ({ useReportWith, page }) => {
    await useReportWith('mixed', 'themeToggle');

    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('should hide theme toggle when disabled', async ({ useReportWith, page }) => {
    await useReportWith('mixed', 'darkTheme', { enableThemeToggle: false });

    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).not.toBeVisible();
  });
});

test.describe('Theme Switching', () => {
  test('should switch between all available themes', async ({ useReportVariant, page }) => {
    await useReportVariant('themeToggle');

    const html = page.locator('html');
    const themes = ['light', 'dark', 'github', 'monokai', 'dracula', 'nord'];

    for (const theme of themes) {
      // Open theme menu
      await page.getByTestId('theme-toggle').click();

      // Select theme
      await page.getByTestId(`theme-option-${theme}`).click();

      // Verify theme class
      await expect(html).toHaveClass(new RegExp(`theme-${theme}`));
    }
  });
});
