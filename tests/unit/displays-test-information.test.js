const { createMockReportData, renderReport } = require('./test-utils');

test('includes test suites in generated report', () => {
  const html = renderReport();

  expect(html).toContain('data-testid="test-suite"');
  expect(html).toContain('data-testid="suite-header"');
  expect(html).toContain('data-testid="suite-body"');
});

test('includes test items within suites', () => {
  const html = renderReport();

  expect(html).toContain('data-testid="test-item"');
  expect(html).toContain('data-testid="test-title"');
});

test('shows test duration when enabled', () => {
  const html = renderReport(undefined, { showDuration: true });

  expect(html).toContain('data-testid="test-duration"');
});

test('hides test duration when disabled', () => {
  const html = renderReport(undefined, { showDuration: false });

  expect(html).not.toContain('data-testid="test-duration"');
  expect(html).not.toContain('data-testid="suite-duration"');
});

test('shows full file path when show file path is set to full', () => {
  const data = createMockReportData();
  data.testSuites[0].name = '/full/path/to/test.js';
  data.testSuites[0].path = '/full/path/to/test.js';

  const html = renderReport(data, { showFilePath: 'full' });

  expect(html).toContain('data-name="/full/path/to/test.js"');
});

test('shows filename only when show file path is set to filename', () => {
  const html = renderReport(undefined, { showFilePath: 'filename' });

  expect(html).toContain('example.test.js');
});

test('includes progress bar when enabled', () => {
  const html = renderReport(undefined, { showProgressBar: true });

  expect(html).toContain('data-testid="progress-bar"');
  expect(html).toContain('data-testid="progress-bar-stats"');
});

test('excludes progress bar when disabled', () => {
  const html = renderReport(undefined, { showProgressBar: false });

  expect(html).not.toContain('data-testid="progress-bar"');
});

test('includes environment information when enabled', () => {
  const html = renderReport(undefined, { includeEnvironment: true });

  expect(html).toContain('data-testid="environment-info"');
  expect(html).toContain('Node.js');
  expect(html).toContain('Platform');
  expect(html).toContain('CPU Cores');
  expect(html).toContain('Memory');
});

test('excludes environment information when disabled', () => {
  const html = renderReport(undefined, { includeEnvironment: false });

  expect(html).not.toContain('data-testid="environment-info"');
});

test('includes subtitle when provided', () => {
  const html = renderReport(undefined, { subtitle: 'My Subtitle' });

  expect(html).toContain('My Subtitle');
  expect(html).toContain('data-testid="report-subtitle"');
});

test('includes logo when provided', () => {
  const html = renderReport(undefined, {
    subtitle: 'Subtitle',
    logo: 'https://example.com/logo.png',
    logoHeight: 48,
  });

  expect(html).toContain('https://example.com/logo.png');
  expect(html).toContain('height: 48px');
  expect(html).toContain('data-testid="header-logo"');
});

test('renders report header with title and timestamp when logo and subtitle are not provided', () => {
  const html = renderReport(undefined, {
    logo: undefined,
    subtitle: undefined,
  });

  expect(html).toContain('data-testid="report-header"');
  expect(html).toContain('data-testid="report-title"');
  expect(html).toContain('data-testid="meta-info"');
  expect(html).not.toContain('data-testid="report-title-row"');
});

test('renders header with title but no subtitle element when subtitle not provided', () => {
  const html = renderReport(undefined, {
    subtitle: undefined,
    logo: 'https://example.com/logo.png',
  });

  expect(html).toContain('data-testid="report-header"');
  expect(html).toContain('data-testid="report-title"');
  expect(html).not.toContain('data-testid="report-subtitle"');
});

test('collapses all test suites when collapse all is set to true', () => {
  const html = renderReport(undefined, { collapseAll: true });

  expect(html).toContain('data-collapsed="true"');
});

test('collapses only passed test suites when collapse passed is set to true', () => {
  const html = renderReport(undefined, { collapsePassed: true });

  expect(html).toContain('data-collapsed="true"');
});

test('does not collapse suites by default', () => {
  const html = renderReport(undefined, {
    collapseAll: false,
    collapsePassed: false,
  });

  expect(html).toContain('data-testid="test-suite"');
  expect(html).toContain('data-collapsed="false"');
});

test('renders todo test count in summary', () => {
  const data = createMockReportData({ summary: { todoTests: 2 } });

  const html = renderReport(data);

  expect(html).toContain('2');
});

test('renders flaky test count in summary', () => {
  const data = createMockReportData({ summary: { flakyTests: 3 } });

  const html = renderReport(data);

  expect(html).toContain('3');
});

test('handles tests with no ancestor titles', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].ancestorTitles = [];

  const html = renderReport(data);

  expect(html).toContain('test one');
});

test('renders test with multiple ancestor titles', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].ancestorTitles = ['Top', 'Middle', 'Bottom'];

  const html = renderReport(data);

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

  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('test with details');
  expect(html).toContain('Expected true to be false');
  expect(html).toContain('data-testid="error-container"');
});

test('handles suite with failure message', () => {
  const data = createMockReportData();
  data.testSuites[0].failureMessage = 'Suite failed to load';

  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('<!DOCTYPE html>');
});

test('renders failed suite status', () => {
  const data = createMockReportData();
  data.testSuites[0].status = 'failed';

  const html = renderReport(data);

  expect(html).toContain('data-status="failed"');
});

test('renders pending suite status', () => {
  const data = createMockReportData();
  data.testSuites[0].status = 'pending';

  const html = renderReport(data);

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

  const html = renderReport(data);

  expect(html).toContain('failing-suite.test.js');
  expect(html).toContain('failed test');
});

test('displays empty state message when no tests exist', () => {
  const data = createMockReportData({
    summary: {
      totalSuites: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      pendingTests: 0,
      todoTests: 0,
      duration: 0,
    },
    testSuites: [],
  });

  const html = renderReport(data);

  expect(html).toContain('data-testid="empty-state"');
  expect(html).toContain('No test results found');
});
