const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../src/index');
const { createMockGlobalConfig, createMockResults } = require('./test-utils');

let tempDir;

beforeAll(() => {
  tempDir = path.join(__dirname, '/output');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
});

test('generates json file when output json option is enabled', () => {
  const outputPath = path.join(tempDir, 'report-with-json.html');
  const jsonPath = path.join(tempDir, 'report-with-json.json');

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    outputJson: true,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  expect(fs.existsSync(jsonPath)).toBe(true);
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  expect(jsonContent).toHaveProperty('summary');
  expect(jsonContent).toHaveProperty('testSuites');
});

test('includes flaky test count in json output', () => {
  const outputPath = path.join(tempDir, 'flaky-json.html');
  const jsonPath = path.join(tempDir, 'flaky-json.json');

  const mockResults = createMockResults({
    testResults: [
      {
        testFilePath: '/project/flaky.test.js',
        numFailingTests: 0,
        numPassingTests: 1,
        numPendingTests: 0,
        perfStats: { start: 0, end: 100 },
        failureMessage: null,
        testResults: [
          {
            title: 'flaky test',
            fullName: 'flaky test',
            ancestorTitles: [],
            status: 'passed',
            duration: 10,
            failureMessages: [],
            failureDetails: [],
            invocations: 3,
          },
        ],
      },
    ],
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    outputJson: true,
  });

  reporter.onRunComplete(new Set(), mockResults);

  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  expect(jsonContent.summary).toHaveProperty('flakyTests');
});

test('handles tests with missing performance stats', () => {
  const outputPath = path.join(tempDir, 'no-perf.html');
  const jsonPath = path.join(tempDir, 'no-perf.json');

  const mockResults = createMockResults({
    testResults: [
      {
        testFilePath: '/project/no-perf.test.js',
        numFailingTests: 0,
        numPassingTests: 1,
        numPendingTests: 0,
        perfStats: undefined,
        failureMessage: null,
        testResults: [
          {
            title: 'test without perf',
            fullName: 'test without perf',
            ancestorTitles: [],
            status: 'passed',
            duration: null,
            failureMessages: [],
            failureDetails: [],
          },
        ],
      },
    ],
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    outputJson: true,
  });

  reporter.onRunComplete(new Set(), mockResults);

  expect(fs.existsSync(jsonPath)).toBe(true);
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  expect(jsonContent.testSuites[0].duration).toBeDefined();
});

test('parses failure messages into structured format', () => {
  const outputPath = path.join(tempDir, 'failure-details.html');
  const jsonPath = path.join(tempDir, 'failure-details.json');

  const mockResults = createMockResults({
    success: false,
    numFailedTests: 1,
    numPassedTests: 0,
    testResults: [
      {
        testFilePath: '/project/failing.test.js',
        numFailingTests: 1,
        numPassingTests: 0,
        numPendingTests: 0,
        perfStats: { start: 0, end: 100 },
        failureMessage: 'Suite level failure',
        testResults: [
          {
            title: 'failing test',
            fullName: 'failing test',
            ancestorTitles: [],
            status: 'failed',
            duration: 50,
            failureMessages: [
              'Error: Expected value to be true\n    at Object.<anonymous> (/project/test.js:10:5)',
            ],
            failureDetails: [
              {
                message: 'Expected value to be true',
                stack: 'Error: Expected value to be true\n    at Object.<anonymous>',
              },
            ],
          },
        ],
      },
    ],
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    outputJson: true,
  });

  reporter.onRunComplete(new Set(), mockResults);

  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  expect(jsonContent.testSuites[0].tests[0].failureMessages).toBeDefined();
  expect(jsonContent.testSuites[0].tests[0].failureMessages.length).toBeGreaterThan(0);
});

test('extracts test failure messages from suite failure message', () => {
  const outputPath = path.join(tempDir, 'failure-parsing.html');
  const jsonPath = path.join(tempDir, 'failure-parsing.json');

  const mockResults = createMockResults({
    testResults: [
      {
        testFilePath: '/project/failing.test.js',
        numFailingTests: 1,
        numPassingTests: 0,
        numPendingTests: 0,
        perfStats: { start: 0, end: 100 },
        failureMessage: ' ● failing test\n\n    Specific error for this test\n',
        testResults: [
          {
            title: 'failing test',
            fullName: 'failing test',
            ancestorTitles: [],
            status: 'failed',
            duration: 50,
            failureMessages: [],
            failureDetails: [],
          },
        ],
      },
    ],
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    outputJson: true,
  });

  reporter.onRunComplete(new Set(), mockResults);

  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  expect(jsonContent.testSuites[0].tests[0].failureMessages[0]).toContain(
    'Specific error for this test',
  );
});
