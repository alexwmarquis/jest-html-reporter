import { test, expect } from './fixtures';
import { Report } from './pages';

let report: Report;

test.beforeEach(async ({ page }) => {
  report = new Report(page);
  await report.open();
});

test('should display critical report elements', async () => {
  await expect(report.header).toBeVisible();
  await expect(report.headerLogo).toBeVisible();
  await expect(report.reportHeader).toBeVisible();
  await expect(report.reportTitle).toBeVisible();
  await expect(report.reportSubtitle).toBeVisible();
  await expect(report.reportTitleRow).toBeVisible();
  await expect(report.subnav).toBeVisible();
  await expect(report.subnavContainer).toBeVisible();
  await expect(report.metaInfo).toBeVisible();
});
