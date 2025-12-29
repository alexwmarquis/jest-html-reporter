const { generateHtmlReport } = require('../../src/template');

const createMockReportData = (overrides = {}) => {
  return {
    summary: {
      totalSuites: 1,
      passedSuites: 1,
      failedSuites: 0,
      pendingSuites: 0,
      totalTests: 1,
      passedTests: 1,
      failedTests: 0,
      pendingTests: 0,
      todoTests: 0,
      flakyTests: 0,
      duration: 100,
      success: true,
      startTime: '2024-01-01T12:00:00.000Z',
      endTime: '2024-01-01T12:00:00.100Z',
      wasInterrupted: false,
      ...overrides.summary,
    },
    testSuites: overrides.testSuites ?? [
      {
        name: 'tests/unit/example.test.js',
        path: '/mock/project/tests/unit/example.test.js',
        status: 'passed',
        duration: 100,
        tests: [
          {
            title: 'test one',
            fullName: 'Suite test one',
            ancestorTitles: ['Suite'],
            status: 'passed',
            duration: 10,
            failureMessages: [],
            failureDetails: [],
            invocations: 1,
            isFlaky: false,
          },
        ],
        failureMessage: null,
      },
    ],
  };
};

const createMockGlobalConfig = () => ({
  rootDir: '/mock/project',
  testPathPattern: '',
});

const createMockResults = (overrides = {}) => ({
  numTotalTestSuites: 1,
  numPassedTestSuites: 1,
  numFailedTestSuites: 0,
  numPendingTestSuites: 0,
  numTotalTests: 1,
  numPassedTests: 1,
  numFailedTests: 0,
  numPendingTests: 0,
  numTodoTests: 0,
  success: true,
  wasInterrupted: false,
  startTime: Date.now() - 1000,
  testResults: [
    {
      testFilePath: '/mock/project/tests/unit/example.test.js',
      numFailingTests: 0,
      numPassingTests: 1,
      numPendingTests: 0,
      perfStats: { start: Date.now() - 500, end: Date.now() - 100 },
      failureMessage: null,
      testResults: [
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
    },
  ],
  ...overrides,
});

const defaultOptions = {
  pageTitle: 'Test Report',
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
  minify: true,
  dateFormat: 'locale',
  embedAssets: true,
  logoHeight: 32,
};

const renderReport = (data = createMockReportData(), options = {}) => {
  return generateHtmlReport(data, { ...defaultOptions, ...options });
};

module.exports = {
  createMockReportData,
  createMockGlobalConfig,
  createMockResults,
  defaultOptions,
  renderReport,
  generateHtmlReport,
};
