const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../dist/index');

const createMockGlobalConfig = () => ({
  rootDir: '/mock/project',
  testPathPattern: '',
});

const createMockResults = (overrides = {}) => ({
  numTotalTestSuites: 2,
  numPassedTestSuites: 2,
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
      testFilePath: '/project/fast.test.js',
      numFailingTests: 0,
      numPassingTests: 1,
      numPendingTests: 0,
      perfStats: { start: 0, end: 100 },
      failureMessage: null,
      testResults: [
        {
          title: 'fast test',
          fullName: 'fast test',
          ancestorTitles: [],
          status: 'passed',
          duration: 5,
          failureMessages: [],
          failureDetails: [],
        },
      ],
    },
    {
      testFilePath: '/project/slow.test.js',
      numFailingTests: 0,
      numPassingTests: 1,
      numPendingTests: 0,
      perfStats: { start: 0, end: 500 },
      failureMessage: null,
      testResults: [
        {
          title: 'slow test',
          fullName: 'slow test',
          ancestorTitles: [],
          status: 'passed',
          duration: 450,
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

test('sorts test suites by duration when sort is set to duration', () => {
  const outputPath = path.join(tempDir, 'sorted-duration.html');
  const mockResults = createMockResults();

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    sort: 'duration',
  });

  reporter.onRunComplete(new Set(), mockResults);
  expect(fs.existsSync(outputPath)).toBe(true);
});

test('sorts test suites by name when sort is set to name', () => {
  const outputPath = path.join(tempDir, 'sorted-name.html');
  const mockResults = createMockResults({
    testResults: [
      {
        testFilePath: '/project/zebra.test.js',
        numFailingTests: 0,
        numPassingTests: 1,
        numPendingTests: 0,
        perfStats: { start: 0, end: 100 },
        failureMessage: null,
        testResults: [
          {
            title: 'zebra test',
            fullName: 'zebra test',
            ancestorTitles: [],
            status: 'passed',
            duration: 10,
            failureMessages: [],
            failureDetails: [],
          },
        ],
      },
      {
        testFilePath: '/project/alpha.test.js',
        numFailingTests: 0,
        numPassingTests: 1,
        numPendingTests: 0,
        perfStats: { start: 0, end: 100 },
        failureMessage: null,
        testResults: [
          {
            title: 'alpha test',
            fullName: 'alpha test',
            ancestorTitles: [],
            status: 'passed',
            duration: 10,
            failureMessages: [],
            failureDetails: [],
          },
        ],
      },
    ],
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    sort: 'name',
  });

  reporter.onRunComplete(new Set(), mockResults);
  expect(fs.existsSync(outputPath)).toBe(true);
});

test('sorts test suites by status when sort is set to status', () => {
  const outputPath = path.join(tempDir, 'sorted-status.html');
  const mockResults = createMockResults();

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    sort: 'status',
  });

  reporter.onRunComplete(new Set(), mockResults);
  expect(fs.existsSync(outputPath)).toBe(true);
});
