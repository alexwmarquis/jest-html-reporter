import { test, expect } from './fixtures';
import { Report, Theme } from './pages';

let report: Report;

test.beforeEach(async ({ page }) => {
  report = new Report(page);
  await report.open();
});

test('should be able to toggle theme menu visibility', async () => {
  await expect(report.themeMenu).not.toBeVisible();
  await report.themeToggle.click();
  await expect(report.themeMenu).toBeVisible();
  await report.themeToggle.click();
  await expect(report.themeMenu).not.toBeVisible();
});

test('should be able to switch between all available themes', async () => {
  const themes = Object.values(Theme);

  for (const theme of themes) {
    await report.selectTheme(theme);
    expect(await report.getActiveTheme()).toBe(theme);
  }
});

test('should persist theme preference in local storage', async ({ page }) => {
  await report.selectTheme(Theme.NORD);
  expect(await report.getActiveTheme()).toBe(Theme.NORD);

  await page.reload();
  expect(await report.getActiveTheme()).toBe(Theme.NORD);
});

test('should be able to close theme menu by clicking outside of menu', async () => {
  await report.themeToggle.click();
  await expect(report.themeMenu).toBeVisible();

  await report.header.click();
  await expect(report.themeMenu).not.toBeVisible();
});
