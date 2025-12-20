/**
 * Reusable mock test result datasets for E2E testing.
 * Each factory function returns a fresh dataset to avoid test pollution.
 */

import * as path from 'path';

export type TestDataVariant = keyof typeof testDataFactories;

/**
 * Base test result builder with sensible defaults
 */
function createTestResult(
  overrides: Partial<{
    title: string;
    fullName: string;
    ancestorTitles: string[];
    status: 'passed' | 'failed' | 'pending' | 'todo';
    duration: number;
    failureMessages: string[];
  }>,
) {
  return {
    title: overrides.title ?? 'test',
    fullName: overrides.fullName ?? overrides.title ?? 'test',
    ancestorTitles: overrides.ancestorTitles ?? ['Suite'],
    status: overrides.status ?? 'passed',
    duration: overrides.duration ?? 100,
    failureMessages: overrides.failureMessages ?? [],
  };
}

/**
 * Base suite result builder
 */
function createSuiteResult(
  overrides: Partial<{
    testFilePath: string;
    numFailingTests: number;
    numPassingTests: number;
    numPendingTests: number;
    startOffset: number;
    endOffset: number;
    failureMessage: string | null;
    testResults: ReturnType<typeof createTestResult>[];
  }>,
) {
  const now = Date.now();
  return {
    testFilePath: overrides.testFilePath ?? path.join(process.cwd(), 'tests/example.test.js'),
    numFailingTests: overrides.numFailingTests ?? 0,
    numPassingTests: overrides.numPassingTests ?? 0,
    numPendingTests: overrides.numPendingTests ?? 0,
    perfStats: {
      start: now - (overrides.startOffset ?? 1000),
      end: now - (overrides.endOffset ?? 500),
    },
    failureMessage: overrides.failureMessage ?? null,
    testResults: overrides.testResults ?? [],
  };
}

/**
 * Test data factory functions - each returns a fresh mock AggregatedResult
 */
export const testDataFactories = {
  /**
   * Mixed results - the "standard" test data with passes, failures, pending, and todo
   */
  mixed: () => {
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
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/math.test.js'),
          numPassingTests: 3,
          startOffset: 4000,
          endOffset: 3500,
          testResults: [
            createTestResult({
              title: 'should complete basic calculation',
              ancestorTitles: ['MathSuite'],
              duration: 150,
            }),
            createTestResult({
              title: 'should handle zero division',
              ancestorTitles: ['MathSuite'],
              duration: 50,
            }),
            createTestResult({
              title: 'should format currency correctly',
              ancestorTitles: ['FormattingSuite'],
              duration: 80,
            }),
          ],
        }),
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/user.test.js'),
          numFailingTests: 2,
          numPassingTests: 1,
          startOffset: 3000,
          endOffset: 2000,
          failureMessage: 'Some tests failed',
          testResults: [
            createTestResult({
              title: 'should fetch user data',
              ancestorTitles: ['UserSuite'],
              duration: 450,
            }),
            createTestResult({
              title: 'should update profile',
              ancestorTitles: ['UserSuite'],
              status: 'failed',
              duration: 300,
              failureMessages: [
                'Error: Expecting { status: 200 } but received { status: 500 }\n    at Object.<anonymous> (tests/unit/user.test.js:15:24)',
              ],
            }),
            createTestResult({
              title: 'should delete account',
              ancestorTitles: ['UserSuite'],
              status: 'failed',
              duration: 120,
              failureMessages: [
                'Error: Access denied\n    at Object.<anonymous> (tests/unit/user.test.js:22:12)',
              ],
            }),
          ],
        }),
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/auth.test.js'),
          numPassingTests: 2,
          numPendingTests: 1,
          startOffset: 1500,
          endOffset: 1000,
          testResults: [
            createTestResult({
              title: 'should login successfully',
              ancestorTitles: ['AuthSuite'],
              duration: 200,
            }),
            createTestResult({
              title: 'should logout successfully',
              ancestorTitles: ['AuthSuite'],
              duration: 100,
            }),
            createTestResult({
              title: 'should reset password (skipped)',
              ancestorTitles: ['AuthSuite'],
              status: 'pending',
              duration: 0,
            }),
          ],
        }),
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/validation.test.js'),
          numFailingTests: 1,
          numPassingTests: 1,
          startOffset: 800,
          endOffset: 200,
          testResults: [
            createTestResult({
              title: 'should validate input',
              ancestorTitles: ['ValidationSuite'],
              duration: 45,
            }),
            createTestResult({
              title: 'should reject invalid email',
              ancestorTitles: ['ValidationSuite'],
              status: 'failed',
              duration: 30,
              failureMessages: ['Expected "invalid-email" to be invalid'],
            }),
            createTestResult({
              title: 'should check password strength',
              ancestorTitles: ['ValidationSuite'],
              status: 'todo',
              duration: 0,
            }),
          ],
        }),
      ],
    };
  },

  /**
   * All tests passing - for testing success states
   */
  allPassing: () => {
    const now = Date.now();
    return {
      numTotalTestSuites: 2,
      numPassedTestSuites: 2,
      numFailedTestSuites: 0,
      numPendingTestSuites: 0,
      numTotalTests: 5,
      numPassedTests: 5,
      numFailedTests: 0,
      numPendingTests: 0,
      numTodoTests: 0,
      success: true,
      startTime: now - 2000,
      testResults: [
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/success-a.test.js'),
          numPassingTests: 3,
          testResults: [
            createTestResult({ title: 'test one', ancestorTitles: ['SuiteA'], duration: 50 }),
            createTestResult({ title: 'test two', ancestorTitles: ['SuiteA'], duration: 75 }),
            createTestResult({ title: 'test three', ancestorTitles: ['SuiteA'], duration: 30 }),
          ],
        }),
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/success-b.test.js'),
          numPassingTests: 2,
          testResults: [
            createTestResult({ title: 'test alpha', ancestorTitles: ['SuiteB'], duration: 100 }),
            createTestResult({ title: 'test beta', ancestorTitles: ['SuiteB'], duration: 120 }),
          ],
        }),
      ],
    };
  },

  /**
   * All tests failing - for testing failure states
   */
  allFailing: () => {
    const now = Date.now();
    return {
      numTotalTestSuites: 2,
      numPassedTestSuites: 0,
      numFailedTestSuites: 2,
      numPendingTestSuites: 0,
      numTotalTests: 4,
      numPassedTests: 0,
      numFailedTests: 4,
      numPendingTests: 0,
      numTodoTests: 0,
      success: false,
      startTime: now - 3000,
      testResults: [
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/fail-a.test.js'),
          numFailingTests: 2,
          failureMessage: 'All tests failed',
          testResults: [
            createTestResult({
              title: 'should work but doesnt',
              ancestorTitles: ['BrokenSuiteA'],
              status: 'failed',
              failureMessages: [
                'TypeError: Cannot read property "x" of undefined\n    at test.js:10:5',
              ],
            }),
            createTestResult({
              title: 'should also work but doesnt',
              ancestorTitles: ['BrokenSuiteA'],
              status: 'failed',
              failureMessages: ['AssertionError: expected true to be false'],
            }),
          ],
        }),
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/fail-b.test.js'),
          numFailingTests: 2,
          failureMessage: 'All tests failed',
          testResults: [
            createTestResult({
              title: 'network call fails',
              ancestorTitles: ['BrokenSuiteB'],
              status: 'failed',
              failureMessages: ['Error: Network timeout after 5000ms'],
            }),
            createTestResult({
              title: 'database call fails',
              ancestorTitles: ['BrokenSuiteB'],
              status: 'failed',
              failureMessages: ['Error: Connection refused'],
            }),
          ],
        }),
      ],
    };
  },

  /**
   * Empty results - edge case testing
   */
  empty: () => ({
    numTotalTestSuites: 0,
    numPassedTestSuites: 0,
    numFailedTestSuites: 0,
    numPendingTestSuites: 0,
    numTotalTests: 0,
    numPassedTests: 0,
    numFailedTests: 0,
    numPendingTests: 0,
    numTodoTests: 0,
    success: true,
    startTime: Date.now(),
    testResults: [],
  }),

  /**
   * Single test - minimal case
   */
  single: () => {
    const now = Date.now();
    return {
      numTotalTestSuites: 1,
      numPassedTestSuites: 1,
      numFailedTestSuites: 0,
      numPendingTestSuites: 0,
      numTotalTests: 1,
      numPassedTests: 1,
      numFailedTests: 0,
      numPendingTests: 0,
      numTodoTests: 0,
      success: true,
      startTime: now - 500,
      testResults: [
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/single.test.js'),
          numPassingTests: 1,
          testResults: [
            createTestResult({
              title: 'the only test',
              ancestorTitles: ['OnlySuite'],
              duration: 42,
            }),
          ],
        }),
      ],
    };
  },

  /**
   * Large suite - for performance and scroll testing
   */
  large: () => {
    const now = Date.now();
    const generateTests = (suiteIndex: number, count: number) =>
      Array.from({ length: count }, (_, i) =>
        createTestResult({
          title: `test case ${i + 1}`,
          ancestorTitles: [`LargeSuite${suiteIndex}`],
          status: i % 10 === 0 ? 'failed' : i % 15 === 0 ? 'pending' : 'passed',
          duration: Math.floor(Math.random() * 500) + 10,
          failureMessages: i % 10 === 0 ? [`Failure in test ${i + 1}`] : [],
        }),
      );

    const suiteCount = 10;
    const testsPerSuite = 20;
    const totalTests = suiteCount * testsPerSuite;
    const failedTests = Math.floor(totalTests / 10);
    const pendingTests = Math.floor(totalTests / 15);

    return {
      numTotalTestSuites: suiteCount,
      numPassedTestSuites: suiteCount - 2,
      numFailedTestSuites: 2,
      numPendingTestSuites: 0,
      numTotalTests: totalTests,
      numPassedTests: totalTests - failedTests - pendingTests,
      numFailedTests: failedTests,
      numPendingTests: pendingTests,
      numTodoTests: 0,
      success: false,
      startTime: now - 30000,
      testResults: Array.from({ length: suiteCount }, (_, i) =>
        createSuiteResult({
          testFilePath: path.join(process.cwd(), `tests/unit/large-${i + 1}.test.js`),
          numPassingTests: testsPerSuite - 2,
          numFailingTests: 2,
          startOffset: 30000 - i * 2000,
          endOffset: 28000 - i * 2000,
          testResults: generateTests(i + 1, testsPerSuite),
        }),
      ),
    };
  },

  /**
   * Deeply nested - for testing ancestor title display
   */
  deeplyNested: () => {
    const now = Date.now();
    return {
      numTotalTestSuites: 1,
      numPassedTestSuites: 1,
      numFailedTestSuites: 0,
      numPendingTestSuites: 0,
      numTotalTests: 3,
      numPassedTests: 3,
      numFailedTests: 0,
      numPendingTests: 0,
      numTodoTests: 0,
      success: true,
      startTime: now - 1000,
      testResults: [
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/nested.test.js'),
          numPassingTests: 3,
          testResults: [
            createTestResult({
              title: 'deeply nested test',
              ancestorTitles: ['RootSuite', 'Level1', 'Level2', 'Level3', 'Level4'],
              duration: 50,
            }),
            createTestResult({
              title: 'another nested test',
              ancestorTitles: ['RootSuite', 'Level1', 'Level2'],
              duration: 30,
            }),
            createTestResult({
              title: 'shallow test',
              ancestorTitles: ['RootSuite'],
              duration: 20,
            }),
          ],
        }),
      ],
    };
  },

  /**
   * Long failure messages - for testing error display
   */
  verboseErrors: () => {
    const now = Date.now();
    const longStackTrace = Array.from(
      { length: 20 },
      (_, i) => `    at function${i} (file${i}.js:${i * 10}:${i * 2})`,
    ).join('\n');

    return {
      numTotalTestSuites: 1,
      numPassedTestSuites: 0,
      numFailedTestSuites: 1,
      numPendingTestSuites: 0,
      numTotalTests: 2,
      numPassedTests: 0,
      numFailedTests: 2,
      numPendingTests: 0,
      numTodoTests: 0,
      success: false,
      startTime: now - 2000,
      testResults: [
        createSuiteResult({
          testFilePath: path.join(process.cwd(), 'tests/unit/verbose-errors.test.js'),
          numFailingTests: 2,
          failureMessage: 'Tests with verbose errors',
          testResults: [
            createTestResult({
              title: 'test with long stack trace',
              ancestorTitles: ['VerboseSuite'],
              status: 'failed',
              failureMessages: [`Error: Something went terribly wrong\n${longStackTrace}`],
            }),
            createTestResult({
              title: 'test with multiple errors',
              ancestorTitles: ['VerboseSuite'],
              status: 'failed',
              failureMessages: [
                'AssertionError: Expected value to match\n  Expected: { foo: "bar", count: 42 }\n  Received: { foo: "baz", count: 0 }',
                'Additional error: Cleanup failed',
                'Warning: Unhandled promise rejection',
              ],
            }),
          ],
        }),
      ],
    };
  },
};

/**
 * Get test data by variant name
 */
export function getTestData(variant: TestDataVariant) {
  return testDataFactories[variant]();
}
