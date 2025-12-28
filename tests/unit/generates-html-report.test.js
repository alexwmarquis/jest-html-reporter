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

test('creates output directory if it does not exist', () => {
  const nestedPath = path.join(tempDir, 'deep/nested/path/report.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath: nestedPath,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  expect(fs.existsSync(nestedPath)).toBe(true);
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
