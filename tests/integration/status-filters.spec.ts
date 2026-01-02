import { test, expect } from './fixtures';
import { Report } from './pages';

let report: Report;

test.beforeEach(async ({ page }) => {
  report = new Report(page);
  await report.open();
});

test('should be able to filter tests by status', async () => {
  await report.filterChipFailed.click();

  const visibleTests = report.testItem.filter({ visible: true });

  await expect(visibleTests).toHaveCount(0);
});
