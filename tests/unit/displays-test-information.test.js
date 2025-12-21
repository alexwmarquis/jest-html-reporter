const { generateHtmlReport } = require('../../dist/template');

const createMockReportData = () => ({
  summary: {
    totalSuites: 1,
    passedSuites: 1,
    failedSuites: 0,
    pendingSuites: 0,
    totalTests: 1,
    passedTests: 1,
    failedTests: 0,
    pendingTests: 0,
    todoTests: 2,
    flakyTests: 3,
    duration: 100,
    success: true,
    startTime: '2024-01-01T12:00:00.000Z',
    endTime: '2024-01-01T12:00:00.100Z',
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

const defaultOptions = {
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
};

test('includes test suites in generated report', () => {
  const html = generateHtmlReport(createMockReportData(), defaultOptions);

  expect(html).toContain('suite');
  expect(html).toContain('suite-header');
  expect(html).toContain('suite-body');
});

test('includes test items within suites', () => {
  const html = generateHtmlReport(createMockReportData(), defaultOptions);

  expect(html).toContain('test-item');
  expect(html).toContain('test-title');
});

test('shows test duration when enabled', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    showDuration: true,
  });

  expect(html).toContain('test-duration');
});

test('hides test duration when disabled', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    showDuration: false,
  });

  expect(html).not.toContain('data-testid="test-duration"');
  expect(html).not.toContain('data-testid="suite-duration"');
});

test('shows full file path when show file path is set to full', () => {
  const data = createMockReportData();
  data.testSuites[0].name = '/full/path/to/test.js';
  data.testSuites[0].path = '/full/path/to/test.js';

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    showFilePath: 'full',
  });

  expect(html).toContain('data-name="/full/path/to/test.js"');
});

test('shows filename only when show file path is set to filename', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    showFilePath: 'filename',
  });

  expect(html).toContain('example.test.js');
});

test('includes progress bar when enabled', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    showProgressBar: true,
  });

  expect(html).toContain('class="progress-bar-container"');
  expect(html).toContain('progress-bar-stats');
});

test('excludes progress bar when disabled', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    showProgressBar: false,
  });

  expect(html).not.toContain('<div class="progress-bar-container">');
});

test('includes environment information when enabled', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    includeEnvironment: true,
  });

  expect(html).toContain('<div class="environment-info"');
  expect(html).toContain('Node.js');
  expect(html).toContain('Platform');
  expect(html).toContain('CPU Cores');
  expect(html).toContain('Memory');
});

test('excludes environment information when disabled', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    includeEnvironment: false,
  });

  expect(html).not.toContain('<div class="environment-info"');
});

test('includes subtitle when provided', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    subtitle: 'My Subtitle',
  });

  expect(html).toContain('My Subtitle');
  expect(html).toContain('report-subtitle');
});

test('includes logo when provided', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    subtitle: 'Subtitle',
    logo: 'https://example.com/logo.png',
    logoHeight: 48,
  });

  expect(html).toContain('https://example.com/logo.png');
  expect(html).toContain('height: 48px');
});

test('does not render report header when logo and subtitle are not provided', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    logo: undefined,
    subtitle: undefined,
  });

  const bodyStart = html.indexOf('<body>');
  const bodyEnd = html.indexOf('</body>');
  const bodyContent = html.substring(bodyStart, bodyEnd);
  expect(bodyContent).not.toContain('report-header');
  expect(bodyContent).not.toContain('report-title-row');
});

test('renders header with title but no subtitle element when subtitle not provided', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    subtitle: undefined,
    logo: 'https://example.com/logo.png',
  });

  expect(html).toContain('report-header');
  expect(html).toContain('report-title');
  expect(html).not.toContain('data-testid="report-subtitle"');
});

test('collapses all test suites when collapse all is set to true', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    collapseAll: true,
  });

  expect(html).toContain('class="suite collapsed"');
});

test('collapses only passed test suites when collapse passed is set to true', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    collapsePassed: true,
  });

  expect(html).toContain('collapsed');
});

test('does not collapse suites by default', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    collapseAll: false,
    collapsePassed: false,
  });

  expect(html).toContain('<div class="suite"');
  expect(html).not.toContain('class="suite collapsed"');
});

test('renders todo test count in summary', () => {
  const data = createMockReportData();
  data.summary.todoTests = 2;

  const html = generateHtmlReport(data, defaultOptions);

  expect(html).toContain('2');
});

test('renders flaky test count in summary', () => {
  const data = createMockReportData();
  data.summary.flakyTests = 3;

  const html = generateHtmlReport(data, defaultOptions);

  expect(html).toContain('3');
});

test('handles tests with no ancestor titles', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].ancestorTitles = [];

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    dateFormat: 'locale',
  });

  expect(html).toContain('test one');
});

test('renders test with multiple ancestor titles', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].ancestorTitles = ['Top', 'Middle', 'Bottom'];

  const html = generateHtmlReport(data, defaultOptions);

  expect(html).toContain('test one');
});

test('handles test with failure details', () => {
  const data = createMockReportData();
  data.testSuites[0].tests.push({
    title: 'test with details',
    fullName: 'Suite test with details',
    ancestorTitles: ['Suite'],
    status: 'failed',
    duration: 10,
    failureMessages: ['Expected true to be false'],
    failureDetails: [
      {
        message: 'Detailed error message',
        stack: 'Error stack trace',
      },
    ],
    invocations: 1,
    isFlaky: false,
  });

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    showFailed: true,
  });

  expect(html).toContain('test with details');
  expect(html).toContain('Expected true to be false');
});

test('handles suite with failure message', () => {
  const data = createMockReportData();
  data.testSuites[0].failureMessage = 'Suite failed to load';

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    showFailed: true,
  });

  expect(html).toContain('<!DOCTYPE html>');
});

test('renders failed suite status', () => {
  const data = createMockReportData();
  data.testSuites[0].status = 'failed';

  const html = generateHtmlReport(data, defaultOptions);

  expect(html).toContain('data-status="failed"');
});

test('renders pending suite status', () => {
  const data = createMockReportData();
  data.testSuites[0].status = 'pending';

  const html = generateHtmlReport(data, defaultOptions);

  expect(html).toContain('data-status="pending"');
});

test('handles multiple test suites with mixed statuses', () => {
  const data = createMockReportData();
  data.testSuites.push({
    name: 'failing-suite.test.js',
    path: '/project/failing-suite.test.js',
    status: 'failed',
    duration: 200,
    tests: [
      {
        title: 'failed test',
        fullName: 'failed test',
        ancestorTitles: [],
        status: 'failed',
        duration: 100,
        failureMessages: ['Assertion failed'],
        failureDetails: [],
        invocations: 1,
        isFlaky: false,
      },
    ],
    failureMessage: null,
  });

  const html = generateHtmlReport(data, defaultOptions);

  expect(html).toContain('failing-suite.test.js');
  expect(html).toContain('failed test');
});

test('displays empty state message when no tests exist', () => {
  const data = {
    summary: {
      totalSuites: 0,
      passedSuites: 0,
      failedSuites: 0,
      pendingSuites: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      pendingTests: 0,
      todoTests: 0,
      duration: 0,
      success: true,
      startTime: '2024-01-01T12:00:00.000Z',
      endTime: '2024-01-01T12:00:00.000Z',
    },
    testSuites: [],
  };

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    dateFormat: 'locale',
  });

  expect(html).toContain('empty-state');
  expect(html).toContain('No test results found');
});
