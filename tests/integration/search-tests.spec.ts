import { faker } from '@faker-js/faker';
import { test, expect } from './fixtures';
import { Filters, TestList, Report } from './components';

let filters: Filters;
let testList: TestList;
let report: Report;

test.beforeEach(async ({ page }) => {
  filters = new Filters(page);
  testList = new TestList(page);
  report = new Report(page);

  await report.open();
});

test('should be able to search for tests', async () => {
  const visibleTests = testList.testItem.filter({ visible: true });
  const initialCount = await visibleTests.count();

  await filters.searchInput.fill('tests');

  await expect(visibleTests).not.toHaveCount(initialCount);
  expect(await visibleTests.count()).toBeLessThan(initialCount);
  expect(await visibleTests.count()).toBeGreaterThan(0);
});

test('should display no tests when the search term does not match any', async () => {
  await filters.searchInput.fill(faker.string.uuid());

  const visibleTests = testList.testItem.filter({ visible: true });

  await expect(visibleTests).toHaveCount(0);
});
