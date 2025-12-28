import { faker } from '@faker-js/faker';
import { test, expect } from './fixtures';
import { ReportPage } from './pages';

let reportPage: ReportPage;

test.beforeEach(async ({ page }) => {
  reportPage = new ReportPage(page);
  await reportPage.open();
});

test('should be able to search for tests', async () => {
  const visibleTests = reportPage.testItem.filter({ visible: true });
  const initialCount = await visibleTests.count();

  await reportPage.searchInput.fill('tests');

  await expect(visibleTests).not.toHaveCount(initialCount);
  expect(await visibleTests.count()).toBeLessThan(initialCount);
  expect(await visibleTests.count()).toBeGreaterThan(0);
});

test('should display no tests when the search term does not match any', async () => {
  await reportPage.searchInput.fill(faker.string.uuid());

  const visibleTests = reportPage.testItem.filter({ visible: true });

  await expect(visibleTests).toHaveCount(0);
});
