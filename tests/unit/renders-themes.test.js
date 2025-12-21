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
    endTime: '2024-01-01T12:00:00.100Z',
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

test('applies dark theme class by default', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    theme: 'dark',
  });

  expect(html).toContain('class="theme-dark"');
});

test('applies light theme class when selected', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    theme: 'light',
  });

  expect(html).toContain('class="theme-light"');
});

test('applies github theme class when selected', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    theme: 'github',
  });

  expect(html).toContain('class="theme-github"');
});

test('applies monokai theme class when selected', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    theme: 'monokai',
  });

  expect(html).toContain('class="theme-monokai"');
});

test('applies dracula theme class when selected', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    theme: 'dracula',
  });

  expect(html).toContain('class="theme-dracula"');
});

test('applies nord theme class when selected', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    theme: 'nord',
  });

  expect(html).toContain('class="theme-nord"');
});

test('includes theme toggle when enabled', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    enableThemeToggle: true,
  });

  expect(html).toContain('theme-toggle');
  expect(html).toContain('theme-menu');
  expect(html).toContain('bi-palette');
});

test('does not include theme toggle when disabled', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    enableThemeToggle: false,
  });

  expect(html).not.toContain('id="theme-toggle"');
});

test('includes custom color overrides in css', () => {
  const html = generateHtmlReport(createMockReportData(), {
    ...defaultOptions,
    customColors: {
      bgPrimary: '#123456',
      colorPassed: '#00ff00',
    },
  });

  expect(html).toContain('--bg-primary: #123456');
  expect(html).toContain('--color-passed: #00ff00');
});
