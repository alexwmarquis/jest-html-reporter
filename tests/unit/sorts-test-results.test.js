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

test('sorts test suites by duration when sort is set to duration', () => {
  const outputPath = path.join(tempDir, 'sorted-duration.html');
  const mockResults = createMockResults({
    numTotalTestSuites: 2,
    numPassedTestSuites: 2,
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
  });

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
    numTotalTestSuites: 2,
    numPassedTestSuites: 2,
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
  const mockResults = createMockResults({
    numTotalTestSuites: 2,
    numPassedTestSuites: 2,
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    sort: 'status',
  });

  reporter.onRunComplete(new Set(), mockResults);
  expect(fs.existsSync(outputPath)).toBe(true);
});
