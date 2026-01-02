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

test('sorts individual tests within a suite', () => {
  const outputPath = path.join(tempDir, 'sorted-tests.html');
  const mockResults = createMockResults({
    testResults: [
      {
        testFilePath: '/project/suite.test.js',
        numFailingTests: 1,
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
          {
            title: 'alpha test',
            fullName: 'alpha test',
            ancestorTitles: [],
            status: 'failed',
            duration: 50,
            failureMessages: ['failed'],
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

  const content = fs.readFileSync(outputPath, 'utf8');
  const alphaIndex = content.indexOf('alpha test');
  const zebraIndex = content.indexOf('zebra test');
  expect(alphaIndex).toBeLessThan(zebraIndex);

  const reporter2 = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath: path.join(tempDir, 'sorted-tests-status.html'),
    sort: 'status',
  });
  reporter2.onRunComplete(new Set(), mockResults);
  const content2 = fs.readFileSync(path.join(tempDir, 'sorted-tests-status.html'), 'utf8');
  const alphaIndex2 = content2.indexOf('alpha test');
  const zebraIndex2 = content2.indexOf('zebra test');
  expect(alphaIndex2).toBeLessThan(zebraIndex2);

  const reporter3 = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath: path.join(tempDir, 'sorted-tests-duration.html'),
    sort: 'duration',
  });
  reporter3.onRunComplete(new Set(), mockResults);
  const content3 = fs.readFileSync(path.join(tempDir, 'sorted-tests-duration.html'), 'utf8');
  const alphaIndex3 = content3.indexOf('alpha test');
  const zebraIndex3 = content3.indexOf('zebra test');
  expect(alphaIndex3).toBeLessThan(zebraIndex3);
});

test('handles invalid sort option gracefully', () => {
  const outputPath = path.join(tempDir, 'invalid-sort.html');
  const mockResults = createMockResults();

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    sort: 'invalid',
  });

  reporter.onRunComplete(new Set(), mockResults);
  expect(fs.existsSync(outputPath)).toBe(true);
});
