import { test as teardown, expect } from '@playwright/test';

teardown('should be able to execute a test that runs after all tests', async () => {
  expect(true).toBe(true);
});
