const { renderReport, createMockReportData } = require('./test-utils');

test('should render subnav icons as vector icons with status classes', () => {
  const data = createMockReportData({
    summary: {
      totalTests: 4,
      passedTests: 1,
      failedTests: 1,
      flakyTests: 1,
      pendingTests: 1,
      todoTests: 0,
    },
  });

  const html = renderReport(data);

  expect(html).toContain('class="subnav-icon passed"');
  expect(html).toContain('class="subnav-icon failed"');
  expect(html).toContain('class="subnav-icon flaky"');
  expect(html).toContain('class="subnav-icon skipped"');
  expect(html).toContain('<svg');
});
