import { test, expect } from './fixtures';
import { Report } from './pages';

let report: Report;

test.beforeEach(async ({ page }) => {
  report = new Report(page);
  await report.open();
});

test('should display a passed percentage', async () => {
  await expect(report.progressBarPassedPercentage).toHaveText('100% passed');
});
