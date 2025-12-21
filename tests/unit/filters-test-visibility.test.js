const { generateHtmlReport } = require('../../dist/template');

const createMockReportData = () => ({
  summary: {
    totalSuites: 1,
    passedSuites: 0,
    failedSuites: 1,
    pendingSuites: 0,
    totalTests: 3,
    passedTests: 1,
    failedTests: 1,
    pendingTests: 1,
    todoTests: 0,
    duration: 100,
    success: false,
    startTime: '2024-01-01T12:00:00.000Z',
    endTime: '2024-01-01T12:00:00.100Z',
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

const defaultOptions = {
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
};

test('hides passed tests when show passed is set to false', () => {
  const data = createMockReportData();

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    showPassed: false,
    showFailed: true,
  });

  expect(html).not.toContain('passing test');
});

test('hides failed tests when show failed is set to false', () => {
  const data = createMockReportData();

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    showPassed: true,
    showFailed: false,
  });

  expect(html).not.toContain('failing test');
});

test('hides pending tests when show pending is set to false', () => {
  const data = createMockReportData();

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    showPending: false,
  });

  expect(html).not.toContain('pending test');
});

test('includes filter chips for all test statuses', () => {
  const html = generateHtmlReport(createMockReportData(), defaultOptions);

  expect(html).toContain('filter-chip');
  expect(html).toContain('data-filter="all"');
  expect(html).toContain('data-filter="passed"');
  expect(html).toContain('data-filter="failed"');
  expect(html).toContain('data-filter="pending"');
});

test('includes search box for filtering tests', () => {
  const html = generateHtmlReport(createMockReportData(), defaultOptions);

  expect(html).toContain('search-input');
  expect(html).toContain('Filter tests');
});
