# E2E Test Fixtures

This directory contains a modular fixture system for generating and testing different report configurations.

## Architecture

```
fixtures/
├── test-data.ts      # Mock test result datasets
├── report-configs.ts # Report configuration presets
├── report-factory.ts # Report generation utilities
├── test-fixtures.ts  # Playwright test fixtures
└── index.ts          # Barrel export
```

## Quick Start

### Using Playwright Fixtures (Recommended)

Import the custom test fixture instead of the default Playwright test:

```typescript
import { test, expect } from './fixtures/test-fixtures';

test('my test', async ({ useReportVariant, page }) => {
  // Generate and navigate to a pre-defined report variant
  await useReportVariant('standard');

  // Test the report...
  await expect(page.getByTestId('filter-chip-all')).toBeVisible();
});
```

### Available Fixture Functions

#### `useReportVariant(variant)`

Use a pre-defined report variant:

```typescript
await useReportVariant('standard'); // Mixed results, all features
await useReportVariant('allPassing'); // All tests pass
await useReportVariant('allFailing'); // All tests fail
await useReportVariant('empty'); // No tests
await useReportVariant('large'); // 200 tests for performance testing
await useReportVariant('lightTheme'); // Light theme enabled
await useReportVariant('darkTheme'); // Dark theme enabled
await useReportVariant('themeToggle'); // Theme switcher enabled
// ... and more
```

#### `useReportWith(data, config, overrides?)`

Combine a test data variant with a config preset:

```typescript
// Use "allFailing" data with "lightTheme" config
await useReportWith('allFailing', 'lightTheme');

// Add custom overrides
await useReportWith('mixed', 'standard', {
  pageTitle: 'Custom Title',
  showProgressBar: false,
});
```

#### `useReport(options)`

Full control over report generation:

```typescript
await useReport({
  data: 'mixed',
  config: 'standard',
  configOverrides: {
    theme: 'monokai',
    enableThemeToggle: true,
  },
});
```

## Test Data Variants

Defined in `test-data.ts`:

| Variant         | Description                                  |
| --------------- | -------------------------------------------- |
| `mixed`         | Standard mix of pass/fail/pending/todo tests |
| `allPassing`    | 5 tests, all passing                         |
| `allFailing`    | 4 tests, all failing with error messages     |
| `empty`         | No test results                              |
| `single`        | Single passing test                          |
| `large`         | 200 tests across 10 suites                   |
| `deeplyNested`  | Tests with deep ancestor hierarchies         |
| `verboseErrors` | Tests with long stack traces                 |

### Adding Custom Test Data

```typescript
// In test-data.ts, add to testDataFactories:
myCustomData: () => ({
  numTotalTestSuites: 1,
  numPassedTestSuites: 1,
  // ... etc
  testResults: [
    createSuiteResult({
      testFilePath: 'tests/custom.test.js',
      testResults: [
        createTestResult({ title: 'my test', status: 'passed' }),
      ],
    }),
  ],
}),
```

## Report Configuration Presets

Defined in `report-configs.ts`:

| Preset            | Description                      |
| ----------------- | -------------------------------- |
| `standard`        | All features enabled, dark theme |
| `minimal`         | Bare minimum configuration       |
| `lightTheme`      | Light theme, no toggle           |
| `darkTheme`       | Dark theme, no toggle            |
| `githubTheme`     | GitHub theme                     |
| `monokaiTheme`    | Monokai theme                    |
| `draculaTheme`    | Dracula theme                    |
| `nordTheme`       | Nord theme                       |
| `themeToggle`     | Theme switcher enabled           |
| `collapsedPassed` | Passed tests collapsed           |
| `collapsedAll`    | All suites collapsed             |
| `fullPaths`       | Full file paths shown            |
| `filenamePaths`   | Filename only paths              |
| `noProgressBar`   | Progress bar hidden              |
| `noDuration`      | Duration hidden                  |
| `sortByStatus`    | Tests sorted by status           |
| `sortByDuration`  | Tests sorted by duration         |
| `sortByName`      | Tests sorted alphabetically      |
| `withEnvironment` | Environment info shown           |
| `withJson`        | JSON output enabled              |
| `failedOnly`      | Only show failed tests           |
| `passedOnly`      | Only show passed tests           |
| `kitchenSink`     | All features enabled             |

### Adding Custom Presets

```typescript
// In report-configs.ts, add to reportConfigs:
myPreset: {
  ...baseConfig,
  pageTitle: 'My Custom Report',
  theme: 'dracula' as const,
  collapsePassed: true,
  showDuration: false,
},
```

## How It Works

1. **Lazy Generation**: Reports are generated on first use and cached
2. **Unique Filenames**: Each config+data combination gets a unique filename
3. **Cleanup**: Generated reports are cleaned up in `global-teardown.ts`

## Examples

### Testing Theme Switching

```typescript
test('should switch themes', async ({ useReportVariant, page }) => {
  await useReportVariant('themeToggle');

  await page.getByTestId('theme-toggle').click();
  await page.getByTestId('theme-option-light').click();
  await expect(page.locator('html')).toHaveClass(/theme-light/);
});
```

### Testing Collapse Behavior

```typescript
test('passed suites should be collapsed', async ({ useReportWith, page }) => {
  await useReportWith('mixed', 'collapsedPassed');

  const passedSuite = page.getByTestId('test-suite').first();
  await expect(passedSuite).toHaveClass(/collapsed/);
});
```

### Testing Edge Cases

```typescript
test('empty report shows zero count', async ({ useReport, page }) => {
  await useReport({ data: 'empty', config: 'minimal' });

  const count = page.getByTestId('filter-chip-all').locator('.count');
  await expect(count).toHaveText('0');
});
```

### Parameterized Tests

```typescript
import { testAcrossVariants } from './fixtures/test-fixtures';

// Run the same test across multiple report variants
testAcrossVariants(
  'should display filter chips',
  ['standard', 'minimal', 'lightTheme'],
  async (variant, report) => {
    await expect(page.getByTestId('filter-chip-all')).toBeVisible();
  },
);
```

## Migration from Legacy Setup

If you have tests using the old pattern:

```typescript
// Old pattern
const reportPath = 'file://' + path.resolve(__dirname, 'test-report.html');
test.beforeEach(async ({ page }) => {
  await page.goto(reportPath);
});
```

Migrate to:

```typescript
// New pattern
import { test, expect } from './fixtures/test-fixtures';

test('my test', async ({ useReportVariant, page }) => {
  await useReportVariant('standard');
  // ...
});
```

The legacy `test-report.html` is still generated for backward compatibility, but new tests should use the fixture system.
