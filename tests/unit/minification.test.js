const { renderReport, createMockReportData } = require('./test-utils');

test('should minify HTML by default', () => {
  const html = renderReport();

  expect(html).not.toMatch(/>\s+</);
  expect(html).toContain('<!DOCTYPE html><html');
});

test('should minify HTML when minify option is true', () => {
  const html = renderReport(undefined, { minify: true });

  expect(html).not.toMatch(/>\s+</);
  expect(html).toContain('<!DOCTYPE html><html');
});

test('should not minify HTML when minify option is false', () => {
  const html = renderReport(undefined, { minify: false });

  expect(html).toMatch(/>\s+</);
  expect(html).toContain('<!DOCTYPE html>\n<html');
});

test('should preserve content inside <pre> tags during minification', () => {
  const mockData = createMockReportData({
    testSuites: [
      {
        name: 'tests/unit/example.test.js',
        status: 'failed',
        tests: [
          {
            title: 'failed test',
            fullName: 'failed test',
            ancestorTitles: [],
            status: 'failed',
            duration: 10,
            failureMessages: [
              'Error: Expected true but received false\n    at Object.<anonymous> (test.js:1:1)\n\nDifference:\n- Expected\n+ Received\n\n- true\n+ false',
            ],
          },
        ],
      },
    ],
  });

  const html = renderReport(mockData, { minify: true });

  expect(html).toMatch(/<pre[^>]*>[\s\S]*?\n[\s\S]*?<\/pre>/);
  expect(html).toContain('diff-removed');
  expect(html).toContain('- Expected');
  expect(html).toContain('+ Received');
});

test('should remove HTML comments during minification', () => {
  const html = renderReport(undefined, { minify: true });

  expect(html).not.toMatch(/<!--[\s\S]*?-->/);
});
