# @awmarquis/jest-html-reporter

A beautiful, modern Jest HTML reporter with Bootstrap styling and customizable themes. Generate clean, interactive test reports with zero configuration.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)

## Features

- 🎨 **6 Built-in Themes** - Dark, Light, GitHub, Monokai, Dracula, and Nord
- 🎛️ **Theme Toggle** - Switch themes directly in the report
- 📊 **Visual Progress Bar** - See test results at a glance
- 🔍 **Interactive Filters** - Filter by passed, failed, or skipped tests
- 📁 **Collapsible Suites** - Expand/collapse test suites for easy navigation
- ❌ **Detailed Error Messages** - Full stack traces for failed tests
- ⏱️ **Duration Tracking** - See how long each test and suite takes
- 🖼️ **Custom Branding** - Add your logo and customize colors
- 📄 **JSON Export** - Export test data as JSON alongside HTML
- 🌍 **Environment Info** - Display Node.js, platform, and system info
- ⚙️ **Highly Configurable** - 25+ configuration options
- 📦 **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install --save-dev @awmarquis/jest-html-reporter
```

## Quick Start

Add to your `jest.config.js`:

```javascript
module.exports = {
  reporters: [
    'default',
    [
      '@awmarquis/jest-html-reporter',
      {
        outputPath: 'reports/test-report.html',
        pageTitle: 'My Test Report',
        theme: 'dark',
      },
    ],
  ],
};
```

## Configuration Options

### Output Options

| Option          | Type      | Default              | Description                              |
| --------------- | --------- | -------------------- | ---------------------------------------- |
| `outputPath`    | `string`  | `'jest-report.html'` | Path where the HTML report will be saved |
| `outputJson`    | `boolean` | `false`              | Also output a JSON file with test data   |
| `openOnFailure` | `boolean` | `false`              | Open report in browser when tests fail   |

### Branding & Display

| Option       | Type     | Default              | Description                                |
| ------------ | -------- | -------------------- | ------------------------------------------ |
| `pageTitle`  | `string` | `'Jest Test Report'` | Title in the report header and browser tab |
| `subtitle`   | `string` | -                    | Subtitle shown below the main title        |
| `logo`       | `string` | -                    | URL or base64 data URI for header logo     |
| `logoHeight` | `number` | `32`                 | Logo height in pixels                      |

### Visibility Options

| Option               | Type                   | Default      | Description                        |
| -------------------- | ---------------------- | ------------ | ---------------------------------- |
| `showPassed`         | `boolean`              | `true`       | Show passed tests                  |
| `showFailed`         | `boolean`              | `true`       | Show failed tests                  |
| `showPending`        | `boolean`              | `true`       | Show pending/skipped tests         |
| `showDuration`       | `boolean`              | `true`       | Show duration times                |
| `showFilePath`       | `'full' \| 'filename'` | `'filename'` | Display full path or just filename |
| `showProgressBar`    | `boolean`              | `true`       | Show the progress bar section      |
| `includeEnvironment` | `boolean`              | `false`      | Show environment info section      |

### Behavior Options

| Option           | Type                                            | Default     | Description                           |
| ---------------- | ----------------------------------------------- | ----------- | ------------------------------------- |
| `sort`           | `'default' \| 'status' \| 'duration' \| 'name'` | `'default'` | Sort order for test suites and tests  |
| `collapsePassed` | `boolean`                                       | `false`     | Auto-collapse passing test suites     |
| `collapseAll`    | `boolean`                                       | `false`     | Collapse all suites by default        |
| `expandLevel`    | `number`                                        | `-1`        | Number of suites to expand (-1 = all) |
| `dateFormat`     | `'locale' \| 'iso' \| 'relative'`               | `'locale'`  | Timestamp format                      |

### Theming Options

| Option              | Type              | Default                                             | Description                    |
| ------------------- | ----------------- | --------------------------------------------------- | ------------------------------ |
| `theme`             | `ThemePreset`     | `'dark'`                                            | Built-in theme preset          |
| `customColors`      | `CustomColors`    | -                                                   | Custom color overrides         |
| `enableThemeToggle` | `boolean`         | `false`                                             | Show theme toggle button       |
| `customCssPath`     | `string`          | -                                                   | Path to custom CSS file        |
| `customJsPath`      | `string`          | -                                                   | Path to custom JavaScript file |
| `fonts`             | `object \| false` | `{ sans: 'Google Sans', mono: 'Google Sans Code' }` | Font configuration (see below) |

#### Available Themes

- `dark` - VS Code dark (default)
- `light` - Clean light theme
- `github` - GitHub-inspired dark
- `monokai` - Monokai color scheme
- `dracula` - Dracula theme
- `nord` - Nord color scheme

#### Custom Colors

Override any theme color:

```javascript
{
  customColors: {
    bgPrimary: '#1a1a2e',
    bgSecondary: '#16213e',
    colorPassed: '#00ff88',
    colorFailed: '#ff0055',
    colorAccent: '#00adb5',
  }
}
```

Available color keys:

- `bgPrimary`, `bgSecondary`, `bgHover`
- `textPrimary`, `textSecondary`
- `borderColor`
- `colorPassed`, `colorFailed`, `colorSkipped`
- `colorAccent`

#### Custom Fonts

Load custom fonts from Google Fonts by specifying font names:

```javascript
{
  fonts: {
    sans: 'Inter',
    mono: 'Fira Code',
  }
}
```

For air-gapped environments (no external network), disable font loading entirely:

```javascript
{
  fonts: false;
}
```

Popular font combinations:

| Sans Font     | Mono Font        | Style                   |
| ------------- | ---------------- | ----------------------- |
| Google Sans   | Google Sans Code | Clean, modern           |
| Inter         | JetBrains Mono   | Developer favorite      |
| Roboto        | Fira Code        | Material-inspired       |
| IBM Plex Sans | IBM Plex Mono    | Technical, professional |

## Full Example

```javascript
module.exports = {
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      '@awmarquis/jest-html-reporter',
      {
        outputPath: './reports/test-report.html',
        outputJson: true,
        openOnFailure: true,

        pageTitle: 'My Awesome Project',
        subtitle: 'Test Results',
        logo: 'https://example.com/logo.png',
        logoHeight: 40,

        showPassed: true,
        showFailed: true,
        showPending: true,
        showDuration: true,
        showProgressBar: true,
        includeEnvironment: true,
        showFilePath: 'filename',

        sort: 'status',
        collapsePassed: true,
        dateFormat: 'relative',

        theme: 'github',
        enableThemeToggle: true,
        customColors: {
          colorAccent: '#58a6ff',
        },
      },
    ],
  ],
};
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type { ReporterOptions, ThemePreset, CustomColors } from '@awmarquis/jest-html-reporter';

const options: ReporterOptions = {
  theme: 'dracula',
  customColors: {
    colorAccent: '#bd93f9',
  },
};
```

## Report Features

### Progress Bar

Visual indicator showing the ratio of passed/failed/skipped tests with a percentage.

### Interactive Filters

Click filter buttons to show only:

- All tests
- Passed tests
- Failed tests
- Skipped/pending tests

### Search

Type to filter tests by name in real-time.

### Theme Toggle

When `enableThemeToggle: true`, a palette button appears in the bottom-right corner allowing users to switch themes and save their preference.

### Collapsible Suites

- Click any suite header to expand/collapse
- Failed suites are automatically expanded
- Use `collapsePassed: true` to auto-collapse passing suites

### Environment Info

When `includeEnvironment: true`, displays:

- Node.js version
- Platform/OS
- CPU cores
- Available memory

## Development

```bash
git clone https://github.com/awmarquis/jest-html-reporter.git
cd jest-html-reporter

npm install

npm run build

npm test

npm run dev
```

## License

MIT
