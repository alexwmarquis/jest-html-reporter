const path = require('path');
const fs = require('fs');

const JestHtmlReporter = require('../dist/index');
const { generateHtmlReport } = require('../dist/template');

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
      testFilePath: '/mock/project/__tests__/passing.test.js',
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
      testFilePath: '/mock/project/__tests__/failing.test.js',
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
      name: '__tests__/example.test.js',
      path: '/mock/project/__tests__/example.test.js',
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

describe('JestHtmlReporter', () => {
  let tempDir;
  let reporter;

  beforeAll(() => {
    tempDir = path.join(__dirname, '../.test-output');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('constructor', () => {
    test('should initialize with default options', () => {
      reporter = new JestHtmlReporter(createMockGlobalConfig());
      expect(reporter).toBeDefined();
    });

    test('should accept custom options', () => {
      reporter = new JestHtmlReporter(createMockGlobalConfig(), {
        outputPath: 'custom-report.html',
        pageTitle: 'Custom Title',
        theme: 'light',
      });
      expect(reporter).toBeDefined();
    });
  });

  describe('onRunComplete', () => {
    test('should generate HTML report file', () => {
      const outputPath = path.join(tempDir, 'test-report.html');
      reporter = new JestHtmlReporter(createMockGlobalConfig(), {
        outputPath,
        pageTitle: 'Test Report',
      });

      reporter.onRunComplete(new Set(), createMockResults());

      expect(fs.existsSync(outputPath)).toBe(true);
      const content = fs.readFileSync(outputPath, 'utf8');
      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('Test Report');
    });

    test('should generate JSON file when outputJson is true', () => {
      const outputPath = path.join(tempDir, 'test-with-json.html');
      const jsonPath = path.join(tempDir, 'test-with-json.json');

      reporter = new JestHtmlReporter(createMockGlobalConfig(), {
        outputPath,
        outputJson: true,
      });

      reporter.onRunComplete(new Set(), createMockResults());

      expect(fs.existsSync(jsonPath)).toBe(true);
      const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      expect(jsonContent.summary).toBeDefined();
      expect(jsonContent.testSuites).toBeDefined();
    });

    test('should create output directory if it does not exist', () => {
      const nestedPath = path.join(tempDir, 'nested/deep/dir/report.html');
      reporter = new JestHtmlReporter(createMockGlobalConfig(), {
        outputPath: nestedPath,
      });

      reporter.onRunComplete(new Set(), createMockResults());

      expect(fs.existsSync(nestedPath)).toBe(true);
    });

    test('should apply sorting when sort option is set', () => {
      const outputPath = path.join(tempDir, 'sorted-report.html');
      reporter = new JestHtmlReporter(createMockGlobalConfig(), {
        outputPath,
        sort: 'status',
      });

      reporter.onRunComplete(new Set(), createMockResults());

      expect(fs.existsSync(outputPath)).toBe(true);
    });
  });
});

describe('generateHtmlReport', () => {
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

  describe('basic HTML structure', () => {
    test('should generate valid HTML document', () => {
      const html = generateHtmlReport(createMockReportData(), defaultOptions);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en"');
      expect(html).toContain('</html>');
      expect(html).toContain('<head>');
      expect(html).toContain('</head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</body>');
    });

    test('should include page title in head and body', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        pageTitle: 'My Custom Title',
      });

      expect(html).toContain('<title>My Custom Title</title>');
    });

    test('should include Bootstrap Icons CDN link', () => {
      const html = generateHtmlReport(createMockReportData(), defaultOptions);

      expect(html).toContain('bootstrap-icons');
    });
  });

  describe('theme support', () => {
    test('should apply dark theme class by default', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        theme: 'dark',
      });

      expect(html).toContain('class="theme-dark"');
    });

    test('should apply light theme class', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        theme: 'light',
      });

      expect(html).toContain('class="theme-light"');
    });

    test('should apply github theme class', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        theme: 'github',
      });

      expect(html).toContain('class="theme-github"');
    });

    test('should apply monokai theme class', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        theme: 'monokai',
      });

      expect(html).toContain('class="theme-monokai"');
    });

    test('should apply dracula theme class', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        theme: 'dracula',
      });

      expect(html).toContain('class="theme-dracula"');
    });

    test('should apply nord theme class', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        theme: 'nord',
      });

      expect(html).toContain('class="theme-nord"');
    });

    test('should include theme toggle when enabled', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        enableThemeToggle: true,
      });

      expect(html).toContain('theme-toggle');
      expect(html).toContain('theme-menu');
      expect(html).toContain('bi-palette');
    });

    test('should not include theme toggle when disabled', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        enableThemeToggle: false,
      });

      expect(html).not.toContain('id="theme-toggle"');
    });
  });

  describe('custom colors', () => {
    test('should include custom color overrides', () => {
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
  });

  describe('progress bar', () => {
    test('should include progress bar when enabled', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        showProgressBar: true,
      });

      expect(html).toContain('<div class="progress-bar-container">');
      expect(html).toContain('progress-bar-stats');
    });

    test('should not include progress bar when disabled', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        showProgressBar: false,
      });

      expect(html).not.toContain('<div class="progress-bar-container">');
    });
  });

  describe('environment info', () => {
    test('should include environment info when enabled', () => {
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

    test('should not include environment info when disabled', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        includeEnvironment: false,
      });

      expect(html).not.toContain('<div class="environment-info"');
    });
  });

  describe('branding options', () => {
    test('should include subtitle when provided', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        subtitle: 'My Subtitle',
      });

      expect(html).toContain('My Subtitle');
      expect(html).toContain('report-subtitle');
    });

    test('should include logo when provided', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        subtitle: 'Subtitle',
        logo: 'https://example.com/logo.png',
        logoHeight: 48,
      });

      expect(html).toContain('https://example.com/logo.png');
      expect(html).toContain('height: 48px');
    });
  });

  describe('test filtering', () => {
    test('should include filter chips', () => {
      const html = generateHtmlReport(createMockReportData(), defaultOptions);

      expect(html).toContain('filter-chip');
      expect(html).toContain('data-filter="all"');
      expect(html).toContain('data-filter="passed"');
      expect(html).toContain('data-filter="failed"');
      expect(html).toContain('data-filter="pending"');
    });

    test('should include search box', () => {
      const html = generateHtmlReport(createMockReportData(), defaultOptions);

      expect(html).toContain('search-input');
      expect(html).toContain('Filter tests');
    });
  });

  describe('test display', () => {
    test('should include test suites', () => {
      const html = generateHtmlReport(createMockReportData(), defaultOptions);

      expect(html).toContain('suite');
      expect(html).toContain('suite-header');
      expect(html).toContain('suite-body');
    });

    test('should include test items', () => {
      const html = generateHtmlReport(createMockReportData(), defaultOptions);

      expect(html).toContain('test-item');
      expect(html).toContain('test-title');
    });

    test('should show duration when enabled', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        showDuration: true,
      });

      expect(html).toContain('test-duration');
    });

    test('should hide passed tests when showPassed is false', () => {
      const data = createMockReportData();
      data.testSuites[0].tests[0].status = 'passed';

      const html = generateHtmlReport(data, {
        ...defaultOptions,
        showPassed: false,
      });

      expect(html).not.toContain('test one');
    });
  });

  describe('custom CSS and JS', () => {
    test('should include custom CSS when provided', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        customCss: '.custom-class { color: red; }',
      });

      expect(html).toContain('.custom-class { color: red; }');
    });

    test('should include custom JS when provided', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        customJs: 'console.log("Hello");',
      });

      expect(html).toContain('console.log("Hello");');
    });
  });

  describe('collapse behavior', () => {
    test('should collapse all suites when collapseAll is true', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        collapseAll: true,
      });

      expect(html).toContain('class="suite collapsed"');
    });

    test('should not collapse suites by default', () => {
      const html = generateHtmlReport(createMockReportData(), {
        ...defaultOptions,
        collapseAll: false,
        collapsePassed: false,
      });

      expect(html).toContain('<div class="suite"');
      expect(html).not.toContain('class="suite collapsed"');
    });
  });
});

describe('Utility Functions', () => {
  describe('HTML escaping', () => {
    test('should escape special characters in titles', () => {
      const data = createMockReportData();
      data.testSuites[0].tests[0].title = 'Test <script>alert("xss")</script>';

      const html = generateHtmlReport(data, {
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
        dateFormat: 'locale',
        embedAssets: true,
        logoHeight: 32,
      });

      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>alert');
    });
  });

  describe('duration formatting', () => {
    test('should format milliseconds correctly', () => {
      const data = createMockReportData();
      data.testSuites[0].tests[0].duration = 50;

      const html = generateHtmlReport(data, {
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
        dateFormat: 'locale',
        embedAssets: true,
        logoHeight: 32,
      });

      expect(html).toContain('50ms');
    });

    test('should format seconds correctly', () => {
      const data = createMockReportData();
      data.testSuites[0].tests[0].duration = 1500;

      const html = generateHtmlReport(data, {
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
        dateFormat: 'locale',
        embedAssets: true,
        logoHeight: 32,
      });

      expect(html).toContain('1.5s');
    });
  });

  describe('date formatting', () => {
    test('should format date in locale format', () => {
      const html = generateHtmlReport(createMockReportData(), {
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
        dateFormat: 'locale',
        embedAssets: true,
        logoHeight: 32,
      });

      expect(html).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    test('should format date in ISO format', () => {
      const html = generateHtmlReport(createMockReportData(), {
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
        dateFormat: 'iso',
        embedAssets: true,
        logoHeight: 32,
      });

      expect(html).toContain('2024-01-01T12:00:01.000Z');
    });
  });
});

describe('Edge Cases', () => {
  test('should handle empty test suites', () => {
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
      pageTitle: 'Empty Report',
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

    expect(html).toContain('empty-state');
    expect(html).toContain('No test results found');
  });

  test('should handle tests with no ancestor titles', () => {
    const data = createMockReportData();
    data.testSuites[0].tests[0].ancestorTitles = [];

    const html = generateHtmlReport(data, {
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
      dateFormat: 'locale',
      embedAssets: true,
      logoHeight: 32,
    });

    expect(html).toContain('test one');
  });

  test('should handle very long test names', () => {
    const data = createMockReportData();
    const longName = 'a'.repeat(500);
    data.testSuites[0].tests[0].title = longName;

    const html = generateHtmlReport(data, {
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
      dateFormat: 'locale',
      embedAssets: true,
      logoHeight: 32,
    });

    expect(html).toContain(longName);
  });

  test('should handle special characters in test names', () => {
    const data = createMockReportData();
    data.testSuites[0].tests[0].title = 'Test with émojis 🎉 and spëcial çharacters';

    const html = generateHtmlReport(data, {
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
      dateFormat: 'locale',
      embedAssets: true,
      logoHeight: 32,
    });

    expect(html).toContain('🎉');
    expect(html).toContain('émojis');
  });
});

describe('Integration', () => {
  test('should generate valid HTML that can be parsed', () => {
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
});
