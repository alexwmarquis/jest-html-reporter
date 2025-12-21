const path = require('path');
const fs = require('fs');
const JestHtmlReporter = require('../../dist/index');

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
          title: 'passing test',
          fullName: 'passing test',
          ancestorTitles: [],
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

let tempDir;
let execSpy;

beforeAll(() => {
  tempDir = path.join(__dirname, '../.test-output');
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
