import { test as setup, expect } from '@playwright/test';

setup('should be able to execute a test that runs before all tests', async () => {
  expect(true).toBe(true);
});
