import { test, expect } from './fixtures';
import { ReportPage, Theme } from './pages';

let reportPage: ReportPage;

test.beforeEach(async ({ page }) => {
  reportPage = new ReportPage(page);
  await reportPage.open();
});

test('should be able to toggle theme menu visibility', async () => {
  await expect(reportPage.themeMenu).not.toBeVisible();
  await reportPage.themeToggle.click();
  await expect(reportPage.themeMenu).toBeVisible();
  await reportPage.themeToggle.click();
  await expect(reportPage.themeMenu).not.toBeVisible();
});

test('should be able to switch between all available themes', async () => {
  const themes = Object.values(Theme);

  for (const theme of themes) {
    await reportPage.selectTheme(theme);
    expect(await reportPage.getActiveTheme()).toBe(theme);
  }
});

test('should persist theme preference in local storage', async ({ page }) => {
  await reportPage.selectTheme(Theme.NORD);
  expect(await reportPage.getActiveTheme()).toBe(Theme.NORD);

  await page.reload();
  expect(await reportPage.getActiveTheme()).toBe(Theme.NORD);
});

test('should be able to close theme menu by clicking outside of menu', async () => {
  await reportPage.themeToggle.click();
  await expect(reportPage.themeMenu).toBeVisible();

  await reportPage.header.click();
  await expect(reportPage.themeMenu).not.toBeVisible();
});
