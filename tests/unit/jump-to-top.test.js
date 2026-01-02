const { renderReport } = require('./test-utils');

describe('Jump to Top Feature', () => {
  test('renders jump to top button', () => {
    const html = renderReport();
    expect(html).toContain('data-testid="jump-to-top"');
    expect(html).toContain('title="Jump to top"');
    expect(html).toContain('aria-label="Jump to top"');
  });

  test('adds "with-theme-toggle" class when theme toggle is enabled', () => {
    const html = renderReport(undefined, { enableThemeToggle: true });
    expect(html).toContain('class="jump-to-top with-theme-toggle"');
  });

  test('does not add "with-theme-toggle" class when theme toggle is disabled', () => {
    const html = renderReport(undefined, { enableThemeToggle: false });
    expect(html).toContain('class="jump-to-top"');
    expect(html).not.toContain('with-theme-toggle');
  });
});
