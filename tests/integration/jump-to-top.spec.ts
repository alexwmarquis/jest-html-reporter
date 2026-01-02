import { test, expect } from './fixtures';
import { Report } from './pages';

let report: Report;

test.beforeEach(async ({ page }) => {
  report = new Report(page);
  await report.open();
});

test('should be hidden on initial load', async () => {
  await expect(report.jumpToTop).toBeHidden();
});

test('should become visible after scrolling down', async ({ page }) => {
  await page.evaluate(() => {
    document.body.style.minHeight = '2000px';
  });

  await page.evaluate(() => {
    window.scrollTo(0, 400);
    window.dispatchEvent(new Event('scroll'));
  });

  await page.waitForTimeout(100);

  await expect(report.jumpToTop).toBeVisible();
});

test('should scroll to top when clicked', async ({ page }) => {
  await page.evaluate(() => {
    document.body.style.minHeight = '2000px';
  });

  await page.evaluate(() => {
    window.scrollTo(0, 400);
    window.dispatchEvent(new Event('scroll'));
  });

  await page.waitForTimeout(100);

  await expect(report.jumpToTop).toBeVisible();
  await report.jumpToTop.click();

  await expect
    .poll(
      async () => {
        return page.evaluate(() => window.scrollY);
      },
      { timeout: 1000 },
    )
    .toBe(0);

  await expect(report.jumpToTop).not.toBeVisible();
});
