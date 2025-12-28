import { test, expect } from './fixtures';
import { ReportPage } from './pages';

let reportPage: ReportPage;

test.beforeEach(async ({ page }) => {
  reportPage = new ReportPage(page);
  await reportPage.open();
});

test('should display a passed percentage', async () => {
  await expect(reportPage.progressBarPassedPercentage).toHaveText('100% passed');
});
