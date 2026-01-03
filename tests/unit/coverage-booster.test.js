const { generateReportHeader, generateProgressBar } = require('../../src/template/header');
const { buildTestTree } = require('../../src/template/suites/tree/build-tree');
const { generateTreeHtml } = require('../../src/template/suites/tree/render-tree');
const { hasVisibleTestsInTree } = require('../../src/template/suites/tree/predicates');
const { parseStackFrame } = require('../../src/template/errors/parse');
const { generateStackFrameHtml } = require('../../src/template/errors/render');
const JestHtmlReporter = require('../../src/index');
const { createMockGlobalConfig, createMockResults } = require('./test-utils');
const path = require('path');

test('should render report header correctly with or without logo and subtitle', () => {
  const header1 = generateReportHeader('Title', 'Meta', undefined, 'logo.png');
  expect(header1).toContain('header-logo');
  expect(header1).not.toContain('report-subtitle');

  const header2 = generateReportHeader('Title', 'Meta', 'Subtitle', undefined);
  expect(header2).not.toContain('header-logo');
  expect(header2).toContain('report-subtitle');
});

test('should handle zero total tests in the progress bar', () => {
  const summary = {
    passedTests: 0,
    failedTests: 0,
    pendingTests: 0,
    todoTests: 0,
    totalTests: 0,
  };
  const html = generateProgressBar(summary);
  expect(html).toContain('0% passed');
});

test('should set group status to pending when all tests are pending or skipped', () => {
  const tests = [
    {
      title: 'pending test',
      status: 'pending',
      ancestorTitles: ['Suite'],
      failureMessages: [],
      failureDetails: [],
    },
    {
      title: 'skipped test',
      status: 'skipped',
      ancestorTitles: ['Suite'],
      failureMessages: [],
      failureDetails: [],
    },
    {
      title: 'todo test',
      status: 'todo',
      ancestorTitles: ['Suite'],
      failureMessages: [],
      failureDetails: [],
    },
  ];
  const tree = buildTestTree(tests);
  expect(tree[0].status).toBe('pending');
});

test('should return empty string when rendering an unknown node type in the test tree', () => {
  const unknownNode = { type: 'unknown' };
  const html = generateTreeHtml([unknownNode], {});
  expect(html).toBe('');
});

test('should correctly identify visible tests for all pending statuses', () => {
  const options = { showPassed: false, showFailed: false, showPending: true };

  const pendingNode = { type: 'test', test: { status: 'pending' } };
  const skippedNode = { type: 'test', test: { status: 'skipped' } };
  const todoNode = { type: 'test', test: { status: 'todo' } };

  expect(hasVisibleTestsInTree(pendingNode, options)).toBe(true);
  expect(hasVisibleTestsInTree(skippedNode, options)).toBe(true);
  expect(hasVisibleTestsInTree(todoNode, options)).toBe(true);
});

test('should handle default configuration and status-based sorting correctly', () => {
  const mockResults = createMockResults({
    testResults: [
      {
        testFilePath: 'a.test.js',
        numFailingTests: 1,
        numPassingTests: 0,
        perfStats: { start: 0, end: 100 },
        testResults: [
          {
            title: 'test a',
            status: 'failed',
            ancestorTitles: [],
            failureMessages: ['fail'],
            failureDetails: [],
            duration: 10,
          },
        ],
      },
      {
        testFilePath: 'b.test.js',
        numFailingTests: 0,
        numPassingTests: 1,
        perfStats: { start: 0, end: 100 },
        testResults: [
          {
            title: 'test b',
            status: 'passed',
            ancestorTitles: [],
            failureMessages: [],
            failureDetails: [],
            duration: 10,
          },
        ],
      },
    ],
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    sort: 'status',
  });

  reporter.onRunComplete(new Set(), mockResults);

  const data = {
    testSuites: [
      {
        name: 'b',
        status: 'passed',
        duration: 1,
        tests: [
          { title: 'tb1', status: 'passed', duration: 1 },
          { title: 'tb2', status: 'passed', duration: 1 },
        ],
      },
      {
        name: 'a',
        status: 'passed',
        duration: 1,
        tests: [
          { title: 'ta1', status: 'passed', duration: 1 },
          { title: 'ta2', status: 'passed', duration: 1 },
        ],
      },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/dot-notation
  reporter['sortResults'](data, 'invalid');
  expect(data.testSuites).toHaveLength(2);
});

test('should handle various configuration options like logo embedding and custom fonts', () => {
  const mockConfig = createMockGlobalConfig();
  const mockResults = createMockResults();

  const reporterLogo = new JestHtmlReporter(mockConfig, {
    logo: 'logo.png',
    embedAssets: true,
    outputPath: path.join(__dirname, 'output/logo-test.html'),
  });
  reporterLogo.onRunComplete(new Set(), mockResults);

  const reporterJs = new JestHtmlReporter(mockConfig, {
    customJsPath: 'non-existent.js',
    fonts: false,
    outputPath: path.join(__dirname, 'output/js-test.html'),
  });
  reporterJs.onRunComplete(new Set(), mockResults);

  const reporterFonts = new JestHtmlReporter(mockConfig, {
    fonts: { sans: 'Arial' },
    outputPath: path.join(__dirname, 'output/fonts-test.html'),
  });
  reporterFonts.onRunComplete(new Set(), mockResults);

  const reporterDefault = new JestHtmlReporter(mockConfig);
  expect(reporterDefault).toBeDefined();
});

test('should use fallback icons and statuses when test data is incomplete', () => {
  const options = {
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: true,
    collapsePassed: false,
    collapseAll: false,
  };

  const nodeWithUnknownStatus = {
    type: 'test',
    test: {
      status: 'unknown',
      title: 'unknown test',
      isFlaky: false,
      failureMessages: [],
      duration: 10,
    },
  };
  const html1 = generateTreeHtml([nodeWithUnknownStatus], options);
  expect(html1).toContain('bi-circle');

  const describeNodeNoStatus = {
    type: 'describe',
    name: 'Group',
    children: [
      {
        type: 'test',
        test: {
          status: 'passed',
          title: 'test',
          isFlaky: false,
          failureMessages: [],
          duration: 10,
        },
      },
    ],
  };
  const html2 = generateTreeHtml([describeNodeNoStatus], options);
  expect(html2).toContain('data-status="passed"');
});

test('should display suite-level failure messages when individual test errors are missing', () => {
  const { generateSuiteHtml } = require('../../src/template/suites/suite');
  const suite = {
    name: 'suite.test.js',
    path: 'suite.test.js',
    status: 'failed',
    duration: 100,
    tests: [
      {
        status: 'failed',
        title: 'test',
        failureMessages: [],
        ancestorTitles: [],
        duration: 10,
        isFlaky: false,
        fullName: 'test',
        failureDetails: [],
        invocations: 1,
      },
    ],
    failureMessage: 'Suite error',
  };
  const options = {
    showFilePath: 'filename',
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: true,
    collapsePassed: false,
    collapseAll: false,
    expandLevel: -1,
  };

  const html = generateSuiteHtml(suite, 0, options);
  expect(html).toContain('Suite error');
  expect(html).toContain('error-block');
});

test('should return raw string when a stack frame cannot be parsed', () => {
  const result = parseStackFrame('not a stack frame');
  expect(result.raw).toBe('not a stack frame');
});

test('should render stack frames correctly even when column or function name is missing', () => {
  const frame = {
    filePath: 'test.js',
    lineNumber: 10,
    isNodeModule: false,
  };
  const html = generateStackFrameHtml(frame);
  expect(html).toContain('test.js');
  expect(html).not.toContain('stack-function');
});
