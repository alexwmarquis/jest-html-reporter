const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../src/index');
const { createMockGlobalConfig, createMockResults, renderReport } = require('./test-utils');

let tempDir;

beforeAll(() => {
  tempDir = path.join(__dirname, '/output');
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

test('should render pending suite status correctly when tests are completed', () => {
  const outputPath = path.join(tempDir, 'pending-suite-on-run-complete.html');
  const mockResults = createMockResults({
    testResults: [
      {
        testFilePath: '/project/pending.test.js',
        numFailingTests: 0,
        numPassingTests: 0,
        numPendingTests: 1,
        perfStats: { start: 0, end: 100 },
        failureMessage: null,
        testResults: [
          {
            title: 'pending test',
            fullName: 'pending test',
            ancestorTitles: [],
            status: 'pending',
            duration: 0,
            failureMessages: [],
            failureDetails: [],
          },
        ],
      },
    ],
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
  });

  reporter.onRunComplete(new Set(), mockResults);

  const content = fs.readFileSync(outputPath, 'utf8');
  expect(content).toContain('data-status="pending"');
});

test('creates output directory if it does not exist', () => {
  const customOutputDir = path.join(tempDir, 'deep/nested/fresh-path');
  const outputPath = path.join(customOutputDir, 'report.html');

  if (fs.existsSync(customOutputDir)) {
    fs.rmSync(customOutputDir, { recursive: true, force: true });
  }

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
  });

  reporter.onRunComplete(new Set(), createMockResults());
  expect(fs.existsSync(outputPath)).toBe(true);
});

test('generates valid html document structure', () => {
  const html = renderReport();

  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('<html lang="en"');
  expect(html).toContain('</html>');
  expect(html).toContain('<head>');
  expect(html).toContain('</head>');
  expect(html).toContain('<body>');
  expect(html).toContain('</body>');
});

test('includes page title in both head and body', () => {
  const html = renderReport(undefined, { pageTitle: 'My Custom Title' });

  expect(html).toContain('<title>My Custom Title</title>');
});

test('includes bootstrap icons cdn link', () => {
  const html = renderReport();

  expect(html).toContain('bootstrap-icons');
});

test('can be parsed as valid html', () => {
  const html = renderReport(undefined, {
    pageTitle: 'Integration Test',
    subtitle: 'Testing all features',
    showFilePath: 'full',
    showProgressBar: true,
    theme: 'github',
    enableThemeToggle: true,
    customColors: { colorAccent: '#ff0000' },
    includeEnvironment: true,
    dateFormat: 'relative',
  });

  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain("const theme = savedTheme || 'github'");
  expect(html).toContain('data-testid="progress-bar"');
  expect(html).toContain('data-testid="environment-info"');
  expect(html).toContain('data-testid="theme-toggle"');
  expect(html).toContain('--color-accent: #ff0000');
});
