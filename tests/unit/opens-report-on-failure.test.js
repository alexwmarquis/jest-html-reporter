const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../src/index');
const { createMockGlobalConfig, createMockResults } = require('./test-utils');

let tempDir;
let execSpy;

beforeAll(() => {
  tempDir = path.join(__dirname, '/output');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
});

beforeEach(() => {
  execSpy = jest.spyOn(require('child_process'), 'exec');
});

afterEach(() => {
  if (execSpy) {
    execSpy.mockRestore();
  }
});

test('does not open browser when tests pass', () => {
  const outputPath = path.join(tempDir, 'passing-tests.html');
  const passingResults = createMockResults({
    success: true,
    numFailedTests: 0,
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    openOnFailure: true,
  });

  reporter.onRunComplete(new Set(), passingResults);

  expect(execSpy).not.toHaveBeenCalled();
});

test('opens browser when tests fail and open on failure is enabled', () => {
  execSpy.mockImplementation((cmd, callback) => {
    callback(null);
  });

  const outputPath = path.join(tempDir, 'failed-tests.html');
  const failingResults = createMockResults({
    success: false,
    numFailedTests: 1,
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    openOnFailure: true,
  });

  reporter.onRunComplete(new Set(), failingResults);

  expect(execSpy).toHaveBeenCalled();
  const command = execSpy.mock.calls[0][0];
  expect(command).toContain(outputPath);
});

test('handles browser open errors gracefully without crashing', () => {
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  execSpy.mockImplementation((cmd, callback) => {
    callback(new Error('Browser not found'));
  });

  const outputPath = path.join(tempDir, 'browser-fail.html');
  const failingResults = createMockResults({
    success: false,
    numFailedTests: 1,
  });

  const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
    outputPath,
    openOnFailure: true,
  });

  reporter.onRunComplete(new Set(), failingResults);

  expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not open browser'));

  consoleWarnSpy.mockRestore();
});

test('should use the correct system command to open the report on different platforms', () => {
  const originalPlatform = process.platform;
  const platforms = [
    { name: 'win32', command: 'start ""' },
    { name: 'linux', command: 'xdg-open' },
  ];

  for (const { name, command } of platforms) {
    Object.defineProperty(process, 'platform', { value: name, configurable: true });
    execSpy.mockImplementation((cmd, callback) => callback(null));

    const outputPath = path.join(tempDir, `test-${name}.html`);
    const reporter = new JestHtmlReporter(createMockGlobalConfig(), {
      outputPath,
      openOnFailure: true,
    });

    reporter.onRunComplete(new Set(), createMockResults({ success: false, numFailedTests: 1 }));

    expect(execSpy).toHaveBeenCalledWith(expect.stringContaining(command), expect.any(Function));
    execSpy.mockClear();
  }

  Object.defineProperty(process, 'platform', { value: originalPlatform });
});
