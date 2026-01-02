const { renderReport } = require('./test-utils');

test('applies dark theme by default', () => {
  const html = renderReport(undefined, { theme: 'dark' });

  expect(html).toContain("const theme = savedTheme || 'dark'");
});

test('applies light theme when selected', () => {
  const html = renderReport(undefined, { theme: 'light' });

  expect(html).toContain("const theme = savedTheme || 'light'");
});

test('applies github theme when selected', () => {
  const html = renderReport(undefined, { theme: 'github' });

  expect(html).toContain("const theme = savedTheme || 'github'");
});

test('applies monokai theme when selected', () => {
  const html = renderReport(undefined, { theme: 'monokai' });

  expect(html).toContain("const theme = savedTheme || 'monokai'");
});

test('applies dracula theme when selected', () => {
  const html = renderReport(undefined, { theme: 'dracula' });

  expect(html).toContain("const theme = savedTheme || 'dracula'");
});

test('applies nord theme when selected', () => {
  const html = renderReport(undefined, { theme: 'nord' });

  expect(html).toContain("const theme = savedTheme || 'nord'");
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

test('should not include custom color overrides in the css when none are specified', () => {
  const html = renderReport(undefined, {
    customColors: {},
  });

  expect(html).not.toContain(':root {\n  --bg-primary:');
});
