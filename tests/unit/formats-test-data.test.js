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

test('should format test duration in minutes correctly', () => {
  const data = createMockReportData();
  data.testSuites[0].tests[0].duration = 65000;

  const html = renderReport(data);

  expect(html).toContain('1m 5.0s');
});

test('should display relative date as "just now" when appropriate', () => {
  const now = new Date('2024-01-01T12:00:00.000Z');
  const past = new Date('2024-01-01T11:59:50.000Z');
  jest.useFakeTimers().setSystemTime(now);

  const data = createMockReportData({
    summary: { endTime: past.toISOString() },
  });

  const html = renderReport(data, { dateFormat: 'relative' });

  expect(html).toContain('just now');
  jest.useRealTimers();
});

test('should display relative date as "minutes ago" when appropriate', () => {
  const now = new Date('2024-01-01T12:00:00.000Z');
  const past1 = new Date('2024-01-01T11:59:00.000Z');
  const past5 = new Date('2024-01-01T11:55:00.000Z');
  jest.useFakeTimers().setSystemTime(now);

  const html1 = renderReport(
    createMockReportData({
      summary: { endTime: past1.toISOString() },
    }),
    { dateFormat: 'relative' },
  );

  const html5 = renderReport(
    createMockReportData({
      summary: { endTime: past5.toISOString() },
    }),
    { dateFormat: 'relative' },
  );

  expect(html1).toContain('1 minute ago');
  expect(html5).toContain('5 minutes ago');
  jest.useRealTimers();
});

test('should display relative date as "hours ago" when appropriate', () => {
  const now = new Date('2024-01-01T12:00:00.000Z');
  const past1 = new Date('2024-01-01T11:00:00.000Z');
  const past5 = new Date('2024-01-01T07:00:00.000Z');
  jest.useFakeTimers().setSystemTime(now);

  const html1 = renderReport(
    createMockReportData({
      summary: { endTime: past1.toISOString() },
    }),
    { dateFormat: 'relative' },
  );

  const html5 = renderReport(
    createMockReportData({
      summary: { endTime: past5.toISOString() },
    }),
    { dateFormat: 'relative' },
  );

  expect(html1).toContain('1 hour ago');
  expect(html5).toContain('5 hours ago');
  jest.useRealTimers();
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
