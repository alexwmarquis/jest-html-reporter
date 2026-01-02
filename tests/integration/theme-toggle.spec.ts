import { test, expect } from './fixtures';
import { Header, Theme, ThemeToggle } from './components';

let header: Header;
let themeToggle: ThemeToggle;

test.beforeEach(async ({ page }) => {
  header = new Header(page);
  themeToggle = new ThemeToggle(page);
  await page.goto('');
});

test('should be able to toggle theme menu visibility', async () => {
  await expect(themeToggle.themeMenu).not.toBeVisible();
  await themeToggle.themeToggle.click();
  await expect(themeToggle.themeMenu).toBeVisible();
  await themeToggle.themeToggle.click();
  await expect(themeToggle.themeMenu).not.toBeVisible();
});

test('should be able to switch between all available themes', async () => {
  const themes = Object.values(Theme);

  for (const theme of themes) {
    await themeToggle.selectTheme(theme);
    expect(await themeToggle.getActiveTheme()).toBe(theme);
  }
});

test('should persist theme preference in local storage', async ({ page }) => {
  await themeToggle.selectTheme(Theme.NORD);
  expect(await themeToggle.getActiveTheme()).toBe(Theme.NORD);

  await page.reload();
  expect(await themeToggle.getActiveTheme()).toBe(Theme.NORD);
});

test('should be able to close theme menu by clicking outside of menu', async () => {
  await themeToggle.themeToggle.click();
  await expect(themeToggle.themeMenu).toBeVisible();

  await header.header.click();
  await expect(themeToggle.themeMenu).not.toBeVisible();
});
