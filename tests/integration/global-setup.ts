import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
// @ts-ignore
import JestHtmlReporter = require('../../dist/index');

setup('generate sample report', async () => {
  const outputPath = path.resolve(__dirname, 'test-report.html');
  const jsonPath = path.resolve(__dirname, 'test-report.json');

  const createMockResults = () => {
    const now = Date.now();
    return {
      numTotalTestSuites: 4,
      numPassedTestSuites: 2,
      numFailedTestSuites: 1,
      numPendingTestSuites: 1,
      numTotalTests: 12,
      numPassedTests: 7,
      numFailedTests: 3,
      numPendingTests: 1,
      numTodoTests: 1,
      success: false,
      startTime: now - 5000,
      testResults: [
        {
          testFilePath: path.join(process.cwd(), 'tests/unit/success.test.js'),
          numFailingTests: 0,
          numPassingTests: 3,
          numPendingTests: 0,
          perfStats: { start: now - 4000, end: now - 3500 },
          failureMessage: null,
          testResults: [
            {
              title: 'should complete basic calculation',
              fullName: 'MathSuite should complete basic calculation',
              ancestorTitles: ['MathSuite'],
              status: 'passed',
              duration: 150,
              failureMessages: [],
            },
            {
              title: 'should handle zero division',
              fullName: 'MathSuite should handle zero division',
              ancestorTitles: ['MathSuite'],
              status: 'passed',
              duration: 50,
              failureMessages: [],
            },
            {
              title: 'should format currency correctly',
              fullName: 'FormattingSuite should format currency correctly',
              ancestorTitles: ['FormattingSuite'],
              status: 'passed',
              duration: 80,
              failureMessages: [],
            },
          ],
        },
        {
          testFilePath: path.join(process.cwd(), 'tests/unit/failure.test.js'),
          numFailingTests: 2,
          numPassingTests: 1,
          numPendingTests: 0,
          perfStats: { start: now - 3000, end: now - 2000 },
          failureMessage: 'Some suites failed',
          testResults: [
            {
              title: 'should fetch user data',
              fullName: 'UserSuite should fetch user data',
              ancestorTitles: ['UserSuite'],
              status: 'passed',
              duration: 450,
              failureMessages: [],
            },
            {
              title: 'should update profile',
              fullName: 'UserSuite should update profile',
              ancestorTitles: ['UserSuite'],
              status: 'failed',
              duration: 300,
              failureMessages: [
                'Error: Expecting { status: 200 } but received { status: 500 }\n    at Object.<anonymous> (tests/unit/failure.test.js:15:24)',
              ],
            },
            {
              title: 'should delete account',
              fullName: 'UserSuite should delete account',
              ancestorTitles: ['UserSuite'],
              status: 'failed',
              duration: 120,
              failureMessages: [
                'Error: Access denied\n    at Object.<anonymous> (tests/unit/failure.test.js:22:12)',
              ],
            },
          ],
        },
        {
          testFilePath: path.join(process.cwd(), 'tests/unit/pending.test.js'),
          numFailingTests: 0,
          numPassingTests: 2,
          numPendingTests: 1,
          perfStats: { start: now - 1500, end: now - 1000 },
          failureMessage: null,
          testResults: [
            {
              title: 'should login successfully',
              fullName: 'AuthSuite should login successfully',
              ancestorTitles: ['AuthSuite'],
              status: 'passed',
              duration: 200,
              failureMessages: [],
            },
            {
              title: 'should logout successfully',
              fullName: 'AuthSuite should logout successfully',
              ancestorTitles: ['AuthSuite'],
              status: 'passed',
              duration: 100,
              failureMessages: [],
            },
            {
              title: 'should reset password (skipped)',
              fullName: 'AuthSuite should reset password (skipped)',
              ancestorTitles: ['AuthSuite'],
              status: 'pending',
              duration: 0,
              failureMessages: [],
            },
          ],
        },
        {
          testFilePath: path.join(process.cwd(), 'tests/unit/mixed.test.js'),
          numFailingTests: 1,
          numPassingTests: 1,
          numPendingTests: 0,
          perfStats: { start: now - 800, end: now - 200 },
          failureMessage: null,
          testResults: [
            {
              title: 'should validate input',
              fullName: 'ValidationSuite should validate input',
              ancestorTitles: ['ValidationSuite'],
              status: 'passed',
              duration: 45,
              failureMessages: [],
            },
            {
              title: 'should reject invalid email',
              fullName: 'ValidationSuite should reject invalid email',
              ancestorTitles: ['ValidationSuite'],
              status: 'failed',
              duration: 30,
              failureMessages: ['Expected "invalid-email" to be invalid'],
            },
            {
              title: 'should check password strength',
              fullName: 'ValidationSuite should check password strength',
              ancestorTitles: ['ValidationSuite'],
              status: 'todo',
              duration: 0,
              failureMessages: [],
            },
          ],
        },
      ],
    };
  };

  const reporter = new JestHtmlReporter(
    { rootDir: process.cwd() },
    {
      outputPath,
      pageTitle: 'E2E Test Report',
      subtitle: 'Generated for Playwright E2E testing',
      includeEnvironment: true,
      enableThemeToggle: true,
      outputJson: true,
    },
  );

  console.log('Generating sample report for E2E tests...');
  // @ts-ignore
  reporter.onRunComplete(new Set(), createMockResults());

  expect(fs.existsSync(outputPath)).toBe(true);
  expect(fs.existsSync(jsonPath)).toBe(true);
  console.log('Sample report generated at', outputPath);
});
