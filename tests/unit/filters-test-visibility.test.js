const { createMockReportData, renderReport } = require('./test-utils');

const createMixedStatusData = () =>
  createMockReportData({
    summary: {
      totalTests: 3,
      passedTests: 1,
      failedTests: 1,
      pendingTests: 1,
      failedSuites: 1,
      passedSuites: 0,
      success: false,
    },
    testSuites: [
      {
        name: 'test.js',
        path: '/project/test.js',
        status: 'failed',
        duration: 100,
        tests: [
          {
            title: 'passing test',
            fullName: 'passing test',
            ancestorTitles: [],
            status: 'passed',
            duration: 10,
            failureMessages: [],
            failureDetails: [],
            invocations: 1,
            isFlaky: false,
          },
          {
            title: 'failing test',
            fullName: 'failing test',
            ancestorTitles: [],
            status: 'failed',
            duration: 20,
            failureMessages: ['Error'],
            failureDetails: [],
            invocations: 1,
            isFlaky: false,
          },
          {
            title: 'pending test',
            fullName: 'pending test',
            ancestorTitles: [],
            status: 'pending',
            duration: 0,
            failureMessages: [],
            failureDetails: [],
            invocations: 1,
            isFlaky: false,
          },
        ],
        failureMessage: null,
      },
    ],
  });

test('hides passed tests when show passed is set to false', () => {
  const html = renderReport(createMixedStatusData(), { showPassed: false });

  expect(html).not.toContain('passing test');
});

test('hides failed tests when show failed is set to false', () => {
  const html = renderReport(createMixedStatusData(), { showFailed: false });

  expect(html).not.toContain('failing test');
});

test('hides pending tests when show pending is set to false', () => {
  const html = renderReport(createMixedStatusData(), { showPending: false });

  expect(html).not.toContain('pending test');
});

test('hides skipped and todo tests when show pending is set to false', () => {
  const data = createMockReportData({
    testSuites: [
      {
        name: 'skipped.js',
        status: 'pending',
        tests: [
          {
            title: 'skipped test',
            status: 'skipped',
            ancestorTitles: [],
            failureMessages: [],
            failureDetails: [],
          },
          {
            title: 'todo test',
            status: 'todo',
            ancestorTitles: [],
            failureMessages: [],
            failureDetails: [],
          },
        ],
      },
    ],
  });

  const html = renderReport(data, { showPending: false });

  expect(html).not.toContain('skipped test');
  expect(html).not.toContain('todo test');
});

test('shows skipped and todo tests when show pending is set to true', () => {
  const data = createMockReportData({
    testSuites: [
      {
        name: 'skipped.js',
        status: 'pending',
        tests: [
          {
            title: 'skipped test',
            status: 'skipped',
            ancestorTitles: [],
            failureMessages: [],
            failureDetails: [],
          },
          {
            title: 'todo test',
            status: 'todo',
            ancestorTitles: [],
            failureMessages: [],
            failureDetails: [],
          },
        ],
      },
    ],
  });

  const html = renderReport(data, { showPending: true });

  expect(html).toContain('skipped test');
  expect(html).toContain('todo test');
});

test('hides describe groups with no visible tests', () => {
  const data = createMockReportData({
    testSuites: [
      {
        name: 'nested.js',
        tests: [
          {
            title: 'passed test',
            status: 'passed',
            ancestorTitles: ['Visible Group'],
            failureMessages: [],
            failureDetails: [],
          },
          {
            title: 'hidden test',
            status: 'passed',
            ancestorTitles: ['Hidden Group'],
            failureMessages: [],
            failureDetails: [],
          },
        ],
      },
    ],
  });

  const html = renderReport(data, { showPassed: false });

  expect(html).not.toContain('Visible Group');
  expect(html).not.toContain('Hidden Group');
  expect(html).not.toContain('passed test');
  expect(html).not.toContain('hidden test');
});

test('includes filter chips for all test statuses', () => {
  const html = renderReport(createMixedStatusData());

  expect(html).toContain('data-testid="filter-chip-all"');
  expect(html).toContain('data-testid="filter-chip-passed"');
  expect(html).toContain('data-testid="filter-chip-failed"');
  expect(html).toContain('data-testid="filter-chip-skipped"');
});

test('includes search box for filtering tests', () => {
  const html = renderReport();

  expect(html).toContain('data-testid="search-input"');
  expect(html).toContain('Filter tests');
});
