import { test, expect } from './fixtures';
import { Header, Report } from './components';

let header: Header;
let report: Report;

test.beforeEach(async ({ page }) => {
  header = new Header(page);
  report = new Report(page);

  await report.open();
});

test('should display critical report elements', async () => {
  await expect(header.header).toBeVisible();
  await expect(header.headerLogo).toBeVisible();
  await expect(header.reportHeader).toBeVisible();
  await expect(header.reportTitle).toBeVisible();
  await expect(header.reportSubtitle).toBeVisible();
  await expect(header.reportTitleRow).toBeVisible();
  await expect(header.subnav).toBeVisible();
  await expect(header.subnavContainer).toBeVisible();
  await expect(header.metaInfo).toBeVisible();
});
