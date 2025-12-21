const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../dist/index');
const { generateHtmlReport } = require('../../dist/template');

const createMockGlobalConfig = () => ({
  rootDir: '/mock/project',
  testPathPattern: '',
});

const createMockResults = () => ({
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
  startTime: Date.now() - 1000,
  testResults: [
    {
      testFilePath: '/project/test.js',
      numFailingTests: 0,
      numPassingTests: 1,
      numPendingTests: 0,
      perfStats: { start: 0, end: 100 },
      failureMessage: null,
      testResults: [
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
    },
  ],
});

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

let tempDir;
let consoleWarnSpy;

beforeAll(() => {
  tempDir = path.join(__dirname, '../.test-output');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
});

beforeEach(() => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  consoleWarnSpy.mockRestore();
});

test('warns when custom css file does not exist', () => {
  const outputPath = path.join(tempDir, 'missing-css.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    customCssPath: '/nonexistent/custom.css',
  });

  reporter.onRunComplete(new Set(), createMockResults());

  expect(consoleWarnSpy).toHaveBeenCalledWith(
    expect.stringContaining('Custom CSS file not found:'),
  );
});

test('warns when custom javascript file does not exist', () => {
  const outputPath = path.join(tempDir, 'missing-js.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    customJsPath: '/nonexistent/custom.js',
  });

  reporter.onRunComplete(new Set(), createMockResults());

  expect(consoleWarnSpy).toHaveBeenCalledWith(
    expect.stringContaining('Custom JavaScript file not found:'),
  );
});

test('loads custom css when file exists', () => {
  const cssPath = path.join(tempDir, 'custom-styles.css');
  fs.writeFileSync(cssPath, '.custom { color: blue; }', 'utf8');

  const outputPath = path.join(tempDir, 'with-css.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    customCssPath: cssPath,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  const content = fs.readFileSync(outputPath, 'utf8');
  expect(content).toContain('.custom { color: blue; }');
  expect(consoleWarnSpy).not.toHaveBeenCalled();
});

test('loads custom javascript when file exists', () => {
  const jsPath = path.join(tempDir, 'custom-script.js');
  fs.writeFileSync(jsPath, 'console.log("custom");', 'utf8');

  const outputPath = path.join(tempDir, 'with-js.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    customJsPath: jsPath,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  const content = fs.readFileSync(outputPath, 'utf8');
  expect(content).toContain('console.log("custom");');
  expect(consoleWarnSpy).not.toHaveBeenCalled();
});

test('handles relative paths for custom css files', () => {
  const cssPath = path.join(tempDir, 'relative-styles.css');
  fs.writeFileSync(cssPath, '.relative { color: red; }', 'utf8');

  const outputPath = path.join(tempDir, 'relative-css.html');
  const relativeCssPath = path.relative(process.cwd(), cssPath);

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    customCssPath: relativeCssPath,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  const content = fs.readFileSync(outputPath, 'utf8');
  expect(content).toContain('.relative { color: red; }');
});

test('includes custom css in generated html', () => {
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
    customCss: '.custom-class { color: red; }',
  });

  expect(html).toContain('.custom-class { color: red; }');
});

test('includes custom javascript in generated html', () => {
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
    customJs: 'console.log("Hello");',
  });

  expect(html).toContain('console.log("Hello");');
});
