const { createMockReportData, renderReport } = require('./test-utils');

test('formats milliseconds correctly in test duration', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].duration = 50;

  const html = renderReport(data);

  expect(html).toContain('50ms');
});

test('formats seconds correctly in test duration', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].duration = 1500;

  const html = renderReport(data);

  expect(html).toContain('1.5s');
});

test('formats date in locale format by default', () => {
  const html = renderReport(undefined, { dateFormat: 'locale' });

  expect(html).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
});

test('formats date in iso format when specified', () => {
  const data = createMockReportData({
    summary: {
      endTime: '2024-01-01T12:00:01.000Z',
    },
  });

  const html = renderReport(data, { dateFormat: 'iso' });

  expect(html).toContain('2024-01-01T12:00:01.000Z');
});

test('formats date in relative format when specified', () => {
  const html = renderReport(undefined, { dateFormat: 'relative' });

  expect(html).toContain('<!DOCTYPE html>');
});

test('escapes special characters in test titles', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].title = 'Test <script>alert("xss")</script>';

  const html = renderReport(data);

  expect(html).toContain('&lt;script&gt;');
  expect(html).not.toContain('<script>alert');
});

test('handles very long test names without breaking layout', () => {
  const data = createMockReportData();
  const longName = 'a'.repeat(500);
  data.testSuites[0].tests[0].title = longName;

  const html = renderReport(data);

  expect(html).toContain(longName);
});

test('handles special characters and emojis in test names', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].title = 'Test with émojis 🎉 and spëcial çharacters';

  const html = renderReport(data);

  expect(html).toContain('🎉');
  expect(html).toContain('émojis');
});
