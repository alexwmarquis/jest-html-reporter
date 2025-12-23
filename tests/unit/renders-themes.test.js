const { renderReport } = require('./test-utils');

test('applies dark theme class by default', () => {
  const html = renderReport(undefined, { theme: 'dark' });

  expect(html).toContain('class="theme-dark"');
});

test('applies light theme class when selected', () => {
  const html = renderReport(undefined, { theme: 'light' });

  expect(html).toContain('class="theme-light"');
});

test('applies github theme class when selected', () => {
  const html = renderReport(undefined, { theme: 'github' });

  expect(html).toContain('class="theme-github"');
});

test('applies monokai theme class when selected', () => {
  const html = renderReport(undefined, { theme: 'monokai' });

  expect(html).toContain('class="theme-monokai"');
});

test('applies dracula theme class when selected', () => {
  const html = renderReport(undefined, { theme: 'dracula' });

  expect(html).toContain('class="theme-dracula"');
});

test('applies nord theme class when selected', () => {
  const html = renderReport(undefined, { theme: 'nord' });

  expect(html).toContain('class="theme-nord"');
});

test('includes theme toggle when enabled', () => {
  const html = renderReport(undefined, { enableThemeToggle: true });

  expect(html).toContain('data-testid="theme-toggle"');
  expect(html).toContain('data-testid="theme-menu"');
});

test('does not include theme toggle when disabled', () => {
  const html = renderReport(undefined, { enableThemeToggle: false });

  expect(html).not.toContain('data-testid="theme-toggle"');
});

test('includes custom color overrides in css', () => {
  const html = renderReport(undefined, {
    customColors: {
      bgPrimary: '#123456',
      colorPassed: '#00ff00',
    },
  });

  expect(html).toContain('--bg-primary: #123456');
  expect(html).toContain('--color-passed: #00ff00');
});
