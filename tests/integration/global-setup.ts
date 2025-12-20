import { test, expect } from '@playwright/test';

test('should be able to execute a test that runs before all tests', async () => {
  expect(true).toBe(true);
});
