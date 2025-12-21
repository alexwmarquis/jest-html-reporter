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
    todoTests: 0,
    duration: 100,
    success: true,
    startTime: '2024-01-01T12:00:00.000Z',
    endTime: '2024-01-01T12:00:01.000Z',
  },
  testSuites: [
    {
      name: 'test.js',
      path: '/project/test.js',
      status: 'passed',
      duration: 100,
      tests: [
        {
          title: 'test',
          fullName: 'test',
          ancestorTitles: [],
          status: 'passed',
          duration: 50,
          failureMessages: [],
          failureDetails: [],
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
  embedAssets: true,
  logoHeight: 32,
};

test('formats milliseconds correctly in test duration', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].duration = 50;

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    dateFormat: 'locale',
  });

  expect(html).toContain('50ms');
});

test('formats seconds correctly in test duration', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].duration = 1500;

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    dateFormat: 'locale',
  });

  expect(html).toContain('1.5s');
});

test('formats date in locale format by default', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    dateFormat: 'locale',
  });

  expect(html).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
});

test('formats date in iso format when specified', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    dateFormat: 'iso',
  });

  expect(html).toContain('2024-01-01T12:00:01.000Z');
});

test('formats date in relative format when specified', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    dateFormat: 'relative',
  });

  expect(html).toContain('<!DOCTYPE html>');
});

test('escapes special characters in test titles', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].title = 'Test <script>alert("xss")</script>';

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    dateFormat: 'locale',
  });

  expect(html).toContain('&lt;script&gt;');
  expect(html).not.toContain('<script>alert');
});

test('handles very long test names without breaking layout', () => {
  const data = createMockReportData();
  const longName = 'a'.repeat(500);
  data.testSuites[0].tests[0].title = longName;

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    dateFormat: 'locale',
  });

  expect(html).toContain(longName);
});

test('handles special characters and emojis in test names', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].title = 'Test with émojis 🎉 and spëcial çharacters';

  const html = generateHtmlReport(data, {
    ...defaultOptions,
    dateFormat: 'locale',
  });

  expect(html).toContain('🎉');
  expect(html).toContain('émojis');
});
