import { test, expect } from './fixtures';
import { Filters, TestList } from './components';

let filters: Filters;
let testList: TestList;

test.beforeEach(async ({ page }) => {
  filters = new Filters(page);
  testList = new TestList(page);
  await page.goto('');
});

test('should be able to filter tests by status', async () => {
  await filters.filterChipFailed.click();

  const visibleTests = testList.testItem.filter({ visible: true });

  await expect(visibleTests).toHaveCount(0);
});
