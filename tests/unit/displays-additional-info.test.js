const { renderReport } = require('./test-utils');

beforeEach(() => {
  jest.clearAllMocks();
});

test('does not render section when additional information is undefined', () => {
  const html = renderReport(undefined, { additionalInfo: undefined });

  expect(html).not.toContain('data-testid="additional-info"');
});

test('does not render section when additional information has no valid entries', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      title: 'Build Info',
    },
  });

  expect(html).not.toContain('data-testid="additional-info"');
});

test('does not render information with undefined values', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '123',
      Branch: undefined,
    },
  });

  expect(html).toContain('data-testid="additional-info"');
  expect(html).toContain('Build');
  expect(html).not.toContain('Branch');
});

test('does not render entries with null values', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '123',
      Branch: null,
    },
  });

  expect(html).toContain('Build');
  expect(html).not.toContain('>Branch<');
});

test('does not render entries with empty string values', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '123',
      Branch: '',
    },
  });

  expect(html).toContain('Build');
  expect(html).not.toContain('>Branch<');
});

test('renders with default title when title not provided', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '123',
    },
  });

  expect(html).toContain('Additional Information');
});

test('renders with custom title when provided', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      title: 'Build Context',
      Build: '123',
    },
  });

  expect(html).toContain('Build Context');
  expect(html).not.toContain('Additional Information');
});

test('renders key-value pairs correctly', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '4821',
      Branch: 'main',
      Commit: 'a3f8c21',
    },
  });

  expect(html).toContain('data-testid="additional-info"');
  expect(html).toContain('Build');
  expect(html).toContain('4821');
  expect(html).toContain('Branch');
  expect(html).toContain('main');
  expect(html).toContain('Commit');
  expect(html).toContain('a3f8c21');
});

test('renders URLs as clickable links', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Pipeline: 'https://github.com/org/repo/actions/runs/12345',
    },
  });

  expect(html).toContain('<a href="https://github.com/org/repo/actions/runs/12345"');
  expect(html).toContain('target="_blank"');
  expect(html).toContain('rel="noopener noreferrer"');
});

test('renders http URLs as links', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Docs: 'http://example.com/docs',
    },
  });

  expect(html).toContain('<a href="http://example.com/docs"');
});

test('does not render non-URL strings as links', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Branch: 'feature/new-feature',
    },
  });

  expect(html).toContain('feature/new-feature');
  expect(html).not.toContain('<a href="feature/new-feature"');
});

test('escapes HTML in values', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Script: '<script>alert("xss")</script>',
    },
  });

  expect(html).not.toContain('<script>alert');
  expect(html).toContain('&lt;script&gt;');
});

test('escapes HTML in keys', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      '<script>': 'value',
    },
  });

  expect(html).toContain('&lt;script&gt;');
});

test('escapes HTML in custom title', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      title: '<script>alert("xss")</script>',
      Build: '123',
    },
  });

  expect(html).toContain('&lt;script&gt;');
});

test('renders collapsible header with chevron icon', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '123',
    },
  });

  expect(html).toContain('bi-chevron-down');
  expect(html).toContain('onclick="this.parentElement.classList.toggle(\'collapsed\')"');
});

test('uses environment-info class for consistent styling', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '123',
    },
  });

  expect(html).toContain('class="environment-info"');
  expect(html).toContain('id="additional-info"');
});

test('renders grid layout with env-grid class', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '123',
    },
  });

  expect(html).toContain('class="env-grid"');
  expect(html).toContain('data-testid="additional-info-grid"');
});

test('renders multiple entries in grid', () => {
  const html = renderReport(undefined, {
    additionalInfo: {
      Build: '123',
      Branch: 'main',
      Commit: 'abc123',
      Author: 'developer',
    },
  });

  const envItemMatches = html.match(/class="env-item"/g);
  expect(envItemMatches).toHaveLength(4);
});
