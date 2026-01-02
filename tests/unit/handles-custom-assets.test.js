const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../src/index');
const { createMockGlobalConfig, createMockResults, renderReport } = require('./test-utils');

let tempDir;
let consoleWarnSpy;

beforeAll(() => {
  tempDir = path.join(__dirname, '/output');
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
  const html = renderReport(undefined, {
    customCss: '.custom-class { color: red; }',
  });

  expect(html).toContain('.custom-class { color: red; }');
});

test('includes custom javascript in generated html', () => {
  const html = renderReport(undefined, {
    customJs: 'console.log("Hello");',
  });

  expect(html).toContain('console.log("Hello");');
});

test('embeds logo as base 64 when file exists and embed assets option is true', () => {
  const logoPath = path.join(tempDir, 'test-logo.png');
  fs.writeFileSync(logoPath, 'fake-image-content');

  const outputPath = path.join(tempDir, 'with-embedded-logo.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    logo: logoPath,
    embedAssets: true,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  const content = fs.readFileSync(outputPath, 'utf8');
  expect(content).toContain('data:image/png;base64,');
  expect(content).toContain(Buffer.from('fake-image-content').toString('base64'));
});

test('handles logo as absolute path even if it does not exist at that exact path but exists relative to cwd', () => {
  const logoPath = 'test-logo-relative.png';
  const absoluteButWrongPath = '/test-logo-relative.png';
  const fullLogoPath = path.join(process.cwd(), logoPath);
  fs.writeFileSync(fullLogoPath, 'fake-image-content');

  const outputPath = path.join(tempDir, 'with-absolute-logo.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    logo: absoluteButWrongPath,
    embedAssets: true,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  const content = fs.readFileSync(outputPath, 'utf8');
  expect(content).toContain('data:image/png;base64,');

  if (fs.existsSync(fullLogoPath)) {
    fs.unlinkSync(fullLogoPath);
  }
});

test('warns when logo file does not exist', () => {
  const outputPath = path.join(tempDir, 'missing-logo.html');
  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    logo: '/nonexistent/logo.png',
    embedAssets: true,
  });

  reporter.onRunComplete(new Set(), createMockResults());

  expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Logo file not found:'));
});
