import { test, expect } from './fixtures';
import { ReportPage } from './pages';

let reportPage: ReportPage;

test.beforeEach(async ({ page }) => {
  reportPage = new ReportPage(page);
  await reportPage.open();
});

test('should be able to search for a test', async () => {
  const visibleTests = reportPage.testItem.filter({ visible: true });
  const initialCount = await visibleTests.count();

  await reportPage.searchInput.fill('tests');

  await expect(visibleTests).not.toHaveCount(initialCount);
  expect(await visibleTests.count()).toBeLessThan(initialCount);
});
