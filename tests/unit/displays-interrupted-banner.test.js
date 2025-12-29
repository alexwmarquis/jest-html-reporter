const { createMockReportData, renderReport } = require('./test-utils');

test('displays interrupted banner when test run was stopped early', () => {
  const data = createMockReportData({
    summary: { wasInterrupted: true },
  });

  const html = renderReport(data);

  expect(html).toContain('data-testid="interrupted-banner"');
});

test('does not display interrupted banner when test run completed normally', () => {
  const data = createMockReportData({
    summary: { wasInterrupted: false },
  });

  const html = renderReport(data);

  expect(html).not.toContain('data-testid="interrupted-banner"');
});
