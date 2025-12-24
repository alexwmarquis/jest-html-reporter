import { test, expect } from './fixtures';
import { ReportPage } from './pages';

let reportPage: ReportPage;

test.beforeEach(async ({ page }) => {
  reportPage = new ReportPage(page);
  await reportPage.open();
});

test('should display the report page', async () => {
  await expect(reportPage.header).toBeVisible();
  await expect(reportPage.headerLogo).toBeVisible();
  await expect(reportPage.reportHeader).toBeVisible();
  await expect(reportPage.reportTitle).toBeVisible();
  await expect(reportPage.reportSubtitle).toBeVisible();
  await expect(reportPage.reportTitleRow).toBeVisible();
  await expect(reportPage.subnav).toBeVisible();
  await expect(reportPage.subnavContainer).toBeVisible();
  await expect(reportPage.metaInfo).toBeVisible();
});
