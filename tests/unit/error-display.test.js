const { createMockReportData, renderReport } = require('./test-utils');

const createFailedTest = failureMessages => ({
  title: 'failing test',
  fullName: 'Suite failing test',
  ancestorTitles: ['Suite'],
  status: 'failed',
  duration: 10,
  failureMessages,
  failureDetails: [],
  invocations: 1,
  isFlaky: false,
});

const createMockDataWithFailure = failureMessages => {
  const data = createMockReportData({
    summary: {
      failedTests: 1,
      passedTests: 0,
    },
  });
  data.testSuites[0].status = 'failed';
  data.testSuites[0].tests = [createFailedTest(failureMessages)];
  return data;
};

test('renders error container with enhanced error block', () => {
  const data = createMockDataWithFailure(['Error: Test failed']);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-container"');
  expect(html).toContain('data-testid="error-block-enhanced"');
});

test('renders copy error button', () => {
  const data = createMockDataWithFailure(['Error: Test failed']);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="copy-error-btn"');
  expect(html).toContain('data-error=');
  expect(html).toContain('bi-clipboard');
});

test('renders main error message', () => {
  const data = createMockDataWithFailure(['Error: Something went wrong']);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-message"');
  expect(html).toContain('Something went wrong');
});

test('renders expected and received values when present', () => {
  const errorMessage = `expect(received).toBe(expected)

Expected: "hello"
Received: "world"`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-diff-container"');
  expect(html).toContain('data-testid="error-diff-row-expected"');
  expect(html).toContain('data-testid="error-diff-row-received"');
  expect(html).toContain('data-testid="error-diff-label-expected"');
  expect(html).toContain('data-testid="error-diff-value-expected"');
});

test('renders expected label', () => {
  const errorMessage = `expect(received).toBe(expected)

Expected: true
Received: false`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-diff-label-expected"');
  expect(html).toContain('data-testid="error-diff-label-received"');
});

test('handles expected/received with complex values', () => {
  const errorMessage = `expect(received).toEqual(expected)

Expected: {"name": "test", "value": 42}
Received: {"name": "test", "value": 100}`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-diff-container"');
  expect(html).toContain('42');
  expect(html).toContain('100');
});

test('renders diff section when differences are present', () => {
  const errorMessage = `expect(received).toEqual(expected)

- Expected
+ Received

  Object {
-   "value": 1,
+   "value": 2,
  }`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-diff-full"');
  expect(html).toContain('data-testid="error-diff-title"');
  expect(html).toContain('Difference');
  expect(html).toContain('data-testid="error-diff-content"');
});

test('adds diff-removed class for removed lines', () => {
  const errorMessage = `Difference:

- removed line`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="diff-removed"');
});

test('adds diff-added class for added lines', () => {
  const errorMessage = `Difference:

+ added line`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="diff-added"');
});

test('renders stack trace section when stack frames are present', () => {
  const errorMessage = `Error: Test failed
    at Object.<anonymous> (/path/to/test.js:10:15)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-stack"');
  expect(html).toContain('data-testid="error-stack-title"');
  expect(html).toContain('Stack Trace');
  expect(html).toContain('data-testid="error-stack-frames"');
});

test('renders individual stack frames', () => {
  const errorMessage = `Error: Test failed
    at myFunction (/path/to/file.js:25:10)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-stack-frame"');
  expect(html).toContain('data-testid="stack-at"');
});

test('renders VS Code links for stack frames with file paths', () => {
  const errorMessage = `Error: Test failed
    at myFunction (/path/to/file.js:25:10)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('vscode://file/');
  expect(html).toContain('data-testid="stack-location"');
  expect(html).toContain('data-testid="stack-file"');
  expect(html).toContain('data-testid="stack-line"');
});

test('renders function name when present in stack frame', () => {
  const errorMessage = `Error: Test failed
    at mySpecialFunction (/path/to/file.js:25:10)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="stack-function"');
  expect(html).toContain('mySpecialFunction');
});

test('marks node_modules frames with special class', () => {
  const errorMessage = `Error: Test failed
    at Object.<anonymous> (/project/node_modules/jest/build/index.js:10:15)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-is-node-module="true"');
});

test('does not mark non-node_modules frames with node module class', () => {
  const errorMessage = `Error: Test failed
    at Object.<anonymous> (/project/src/test.js:10:15)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-is-node-module="false"');
});

test('shows only first 3 stack frames by default', () => {
  const errorMessage = `Error: Test failed
    at frame1 (/path/to/file1.js:1:1)
    at frame2 (/path/to/file2.js:2:2)
    at frame3 (/path/to/file3.js:3:3)
    at frame4 (/path/to/file4.js:4:4)
    at frame5 (/path/to/file5.js:5:5)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-stack-hidden"');
  expect(html).toContain('style="display: none;"');
});

test('renders toggle button for hidden frames', () => {
  const errorMessage = `Error: Test failed
    at frame1 (/path/to/file1.js:1:1)
    at frame2 (/path/to/file2.js:2:2)
    at frame3 (/path/to/file3.js:3:3)
    at frame4 (/path/to/file4.js:4:4)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-stack-toggle"');
  expect(html).toContain('Show 1 more frame');
});

test('pluralizes frame count correctly for multiple hidden frames', () => {
  const errorMessage = `Error: Test failed
    at frame1 (/path/to/file1.js:1:1)
    at frame2 (/path/to/file2.js:2:2)
    at frame3 (/path/to/file3.js:3:3)
    at frame4 (/path/to/file4.js:4:4)
    at frame5 (/path/to/file5.js:5:5)
    at frame6 (/path/to/file6.js:6:6)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('Show 3 more frames');
});

test('does not render toggle button when 3 or fewer frames', () => {
  const errorMessage = `Error: Test failed
    at frame1 (/path/to/file1.js:1:1)
    at frame2 (/path/to/file2.js:2:2)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).not.toContain('data-testid="error-stack-toggle"');
  expect(html).not.toContain('data-testid="error-stack-hidden"');
});

test('renders multiple error blocks for multiple failure messages', () => {
  const data = createMockDataWithFailure(['Error: First failure', 'Error: Second failure']);
  const html = renderReport(data, { showFailed: true });

  const errorBlockCount = (html.match(/data-testid="error-block-enhanced"/g) ?? []).length;
  expect(errorBlockCount).toBe(2);
});

test('concatenates all messages for copy button', () => {
  const data = createMockDataWithFailure(['Error: First failure', 'Error: Second failure']);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('First failure');
  expect(html).toContain('Second failure');
});

test('strips ANSI codes from error messages', () => {
  const errorMessage = '\x1b[31mError: Red text\x1b[0m';

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).not.toContain('\x1b[');
  expect(html).toContain('Red text');
});

test('escapes HTML in error messages', () => {
  const errorMessage = 'Error: Expected <div> to equal </div>';

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('&lt;div&gt;');
  expect(html).toContain('&lt;/div&gt;');
});

test('escapes HTML in expected/received values', () => {
  const errorMessage = `Expected: "<script>alert('xss')</script>"
Received: "<img src=x onerror=alert(1)>"`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('&lt;script&gt;');
  expect(html).toContain('&lt;/script&gt;');
  expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
});

test('handles stack frame with function and file path', () => {
  const errorMessage = `Error: Test failed
    at describeFn (/path/to/test.spec.js:15:20)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('describeFn');
  expect(html).toContain('test.spec.js');
  expect(html).toContain(':15');
});

test('handles stack frame with only file path (no function name)', () => {
  const errorMessage = `Error: Test failed
    at /path/to/test.js:10:5`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('test.js');
  expect(html).toContain(':10');
});

test('handles stack frame with only function name (no file path)', () => {
  const errorMessage = `Error: Test failed
    at processTicksAndRejections`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="stack-raw"');
});

test('handles empty failure message', () => {
  const data = createMockDataWithFailure(['']);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-container"');
});

test('handles error message with only whitespace', () => {
  const data = createMockDataWithFailure(['   \n\n   ']);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('data-testid="error-container"');
});

test('handles very long file paths in stack traces', () => {
  const longPath = '/very/long/path/'.repeat(10) + 'file.js';
  const errorMessage = `Error: Test failed
    at fn (${longPath}:10:15)`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('file.js');
  expect(html).toContain('vscode://file/');
});

test('skips bullet point lines in Jest output', () => {
  const errorMessage = `● Suite › failing test

Error: Assertion failed`;

  const data = createMockDataWithFailure([errorMessage]);
  const html = renderReport(data, { showFailed: true });

  expect(html).toContain('Assertion failed');
});
