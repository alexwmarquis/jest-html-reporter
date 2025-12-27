import { test, expect } from './fixtures';
import { ReportPage } from './pages';

let reportPage: ReportPage;

test.beforeEach(async ({ page }) => {
  reportPage = new ReportPage(page);
  await reportPage.open();
});

test('should be able to filter tests by status', async () => {
  await reportPage.filterChipFailed.click();

  const visibleTests = reportPage.testItem.filter({ visible: true });

  await expect(visibleTests).toHaveCount(0);
});
