import { test, expect } from './fixtures';
import { Summary, Report } from './components';

let summary: Summary;
let report: Report;

test.beforeEach(async ({ page }) => {
  summary = new Summary(page);
  report = new Report(page);

  await report.open();
});

test('should display a passed percentage', async () => {
  await expect(summary.progressBarPassedPercentage).toHaveText('100% passed');
});
