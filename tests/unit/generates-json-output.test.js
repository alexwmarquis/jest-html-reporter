const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../dist/index');

const createMockGlobalConfig = () => ({
  rootDir: '/mock/project',
  testPathPattern: '',
});

const createMockResults = (overrides = {}) => ({
  numTotalTestSuites: 1,
  numPassedTestSuites: 1,
  numFailedTestSuites: 0,
  numPendingTestSuites: 0,
  numTotalTests: 2,
  numPassedTests: 2,
  numFailedTests: 0,
  numPendingTests: 0,
  numTodoTests: 0,
  success: true,
  startTime: Date.now() - 1000,
  testResults: [
    {
      testFilePath: '/mock/project/tests/unit/example.test.js',
      numFailingTests: 0,
      numPassingTests: 2,
      numPendingTests: 0,
      perfStats: { start: Date.now() - 500, end: Date.now() - 200 },
      failureMessage: null,
      testResults: [
        {
          title: 'test one',
          fullName: 'test one',
          ancestorTitles: [],
          status: 'passed',
          duration: 10,
          failureMessages: [],
          failureDetails: [],
        },
        {
          title: 'test two',
          fullName: 'test two',
          ancestorTitles: [],
          status: 'passed',
          duration: 5,
          failureMessages: [],
          failureDetails: [],
        },
      ],
    },
  ],
  ...overrides,
});

let tempDir;

beforeAll(() => {
  tempDir = path.join(__dirname, '../.test-output');
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
  expect(jsonContent.summary).toBeDefined();
  expect(jsonContent.testSuites).toBeDefined();
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
  expect(jsonContent.summary.flakyTests).toBe(1);
  expect(jsonContent.testSuites[0].tests[0].isFlaky).toBe(true);
  expect(jsonContent.testSuites[0].tests[0].invocations).toBe(3);
});

test('handles tests with missing performance stats', () => {
  const outputPath = path.join(tempDir, 'no-perf.html');
  const jsonPath = path.join(tempDir, 'no-perf.json');

  const mockResults = createMockResults({
    testResults: [
      {
        testFilePath: '/project/test.js',
        numFailingTests: 0,
        numPassingTests: 1,
        numPendingTests: 0,
        perfStats: null,
        failureMessage: null,
        testResults: [
          {
            title: 'test without perfStats',
            fullName: 'test without perfStats',
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

  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  expect(jsonContent.testSuites[0].duration).toBe(0);
  expect(jsonContent.testSuites[0].tests[0].duration).toBe(0);
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
        failureMessage: `
  ● Test Suite › failing test

    expect(received).toBe(expected)

    Expected: true
    Received: false

      at Object.<anonymous> (failing.test.js:10:20)
        `,
        testResults: [
          {
            title: 'failing test',
            fullName: 'Test Suite failing test',
            ancestorTitles: ['Test Suite'],
            status: 'failed',
            duration: 10,
            failureMessages: ['Expected true to be false'],
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
  expect(jsonContent.testSuites[0].tests[0].failureMessages.length).toBeGreaterThan(0);
});
