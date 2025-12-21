const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../dist/index');
const { generateHtmlReport } = require('../../dist/template');

const createMockGlobalConfig = () => ({
  rootDir: '/mock/project',
  testPathPattern: '',
});

const createMockResults = (overrides = {}) => ({
  numTotalTestSuites: 2,
  numPassedTestSuites: 1,
  numFailedTestSuites: 1,
  numPendingTestSuites: 0,
  numTotalTests: 5,
  numPassedTests: 3,
  numFailedTests: 1,
  numPendingTests: 1,
  numTodoTests: 0,
  success: false,
  startTime: Date.now() - 1000,
  testResults: [
    {
      testFilePath: '/mock/project/tests/unit/passing.test.js',
      numFailingTests: 0,
      numPassingTests: 2,
      numPendingTests: 0,
      perfStats: { start: Date.now() - 500, end: Date.now() - 200 },
      failureMessage: null,
      testResults: [
        {
          title: 'should pass first test',
          fullName: 'Suite should pass first test',
          ancestorTitles: ['Suite'],
          status: 'passed',
          duration: 10,
          failureMessages: [],
          failureDetails: [],
        },
        {
          title: 'should pass second test',
          fullName: 'Suite should pass second test',
          ancestorTitles: ['Suite'],
          status: 'passed',
          duration: 5,
          failureMessages: [],
          failureDetails: [],
        },
      ],
    },
    {
      testFilePath: '/mock/project/tests/unit/failing.test.js',
      numFailingTests: 1,
      numPassingTests: 1,
      numPendingTests: 1,
      perfStats: { start: Date.now() - 400, end: Date.now() - 100 },
      failureMessage: null,
      testResults: [
        {
          title: 'should pass this one',
          fullName: 'Failing Suite should pass this one',
          ancestorTitles: ['Failing Suite'],
          status: 'passed',
          duration: 8,
          failureMessages: [],
          failureDetails: [],
        },
        {
          title: 'should fail this test',
          fullName: 'Failing Suite should fail this test',
          ancestorTitles: ['Failing Suite'],
          status: 'failed',
          duration: 15,
          failureMessages: ['Expected true to be false'],
          failureDetails: [{ message: 'Expected true to be false' }],
        },
        {
          title: 'pending test',
          fullName: 'Failing Suite pending test',
          ancestorTitles: ['Failing Suite'],
          status: 'pending',
          duration: 0,
          failureMessages: [],
          failureDetails: [],
        },
      ],
    },
  ],
  ...overrides,
});

const createMockReportData = () => ({
  summary: {
    totalSuites: 2,
    passedSuites: 1,
    failedSuites: 1,
    pendingSuites: 0,
    totalTests: 5,
    passedTests: 3,
    failedTests: 1,
    pendingTests: 1,
    todoTests: 0,
    duration: 1000,
    success: false,
    startTime: '2024-01-01T12:00:00.000Z',
    endTime: '2024-01-01T12:00:01.000Z',
  },
  testSuites: [
    {
      name: 'tests/unit/example.test.js',
      path: '/mock/project/tests/unit/example.test.js',
      status: 'passed',
      duration: 300,
      tests: [
        {
          title: 'test one',
          fullName: 'Suite test one',
          ancestorTitles: ['Suite'],
          status: 'passed',
          duration: 10,
          failureMessages: [],
          failureDetails: [],
        },
      ],
      failureMessage: null,
    },
  ],
});

let tempDir;

beforeAll(() => {
  tempDir = path.join(__dirname, '../.test-output');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
});

test('creates html report file when tests complete', () => {
  const outputPath = path.join(tempDir, 'basic-report.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    pageTitle: 'Test Report',
  });

  reporter.onRunComplete(new Set(), createMockResults());

  expect(fs.existsSync(outputPath)).toBe(true);
  const content = fs.readFileSync(outputPath, 'utf8');
  expect(content).toContain('<!DOCTYPE html>');
  expect(content).toContain('Test Report');
});

test('creates output directory if it does not exist', () => {
  const nestedPath = path.join(tempDir, 'deep/nested/path/report.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath: nestedPath,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  expect(fs.existsSync(nestedPath)).toBe(true);
});

test('generates valid html document structure', () => {
  const html = generateHtmlReport(createMockReportData(), {
    pageTitle: 'Test Report',
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: true,
    showFilePath: 'filename',
    showProgressBar: true,
    theme: 'dark',
    enableThemeToggle: false,
    sort: 'default',
    collapsePassed: false,
    collapseAll: false,
    expandLevel: -1,
    includeEnvironment: false,
    dateFormat: 'locale',
    embedAssets: true,
    logoHeight: 32,
  });

  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('<html lang="en"');
  expect(html).toContain('</html>');
  expect(html).toContain('<head>');
  expect(html).toContain('</head>');
  expect(html).toContain('<body>');
  expect(html).toContain('</body>');
});

test('includes page title in both head and body', () => {
  const html = generateHtmlReport(createMockReportData(), {
    pageTitle: 'My Custom Title',
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: true,
    showFilePath: 'filename',
    showProgressBar: false,
    theme: 'dark',
    enableThemeToggle: false,
    sort: 'default',
    collapsePassed: false,
    collapseAll: false,
    expandLevel: -1,
    includeEnvironment: false,
    dateFormat: 'locale',
    embedAssets: true,
    logoHeight: 32,
  });

  expect(html).toContain('<title>My Custom Title</title>');
});

test('includes bootstrap icons cdn link', () => {
  const html = generateHtmlReport(createMockReportData(), {
    pageTitle: 'Test',
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: true,
    showFilePath: 'filename',
    showProgressBar: false,
    theme: 'dark',
    enableThemeToggle: false,
    sort: 'default',
    collapsePassed: false,
    collapseAll: false,
    expandLevel: -1,
    includeEnvironment: false,
    dateFormat: 'locale',
    embedAssets: true,
    logoHeight: 32,
  });

  expect(html).toContain('bootstrap-icons');
});

test('can be parsed as valid html', () => {
  const html = generateHtmlReport(createMockReportData(), {
    pageTitle: 'Integration Test',
    subtitle: 'Testing all features',
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: true,
    showFilePath: 'full',
    showProgressBar: true,
    theme: 'github',
    enableThemeToggle: true,
    customColors: { colorAccent: '#ff0000' },
    sort: 'default',
    collapsePassed: false,
    collapseAll: false,
    expandLevel: -1,
    includeEnvironment: true,
    dateFormat: 'relative',
    embedAssets: true,
    logoHeight: 32,
  });

  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('theme-github');
  expect(html).toContain('progress-bar');
  expect(html).toContain('environment-info');
  expect(html).toContain('theme-toggle');
  expect(html).toContain('--color-accent: #ff0000');
});
