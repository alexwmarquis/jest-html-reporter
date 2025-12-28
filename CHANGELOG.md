# Changelog

All notable changes to this project will be documented in this file.
This project adheres to semantic versioning.

## Unreleased

### Added

- **Enhanced Error Display**: Completely redesigned failure message presentation
  - Beautiful Expected vs. Received diff view with color-coded labels
  - Syntax-highlighted code snippets showing the failing line in context
  - Full diff section with red/green highlighting for removed/added lines
  - Collapsible stack traces with "Show more frames" for long traces
  - Clickable file paths that open directly in VS Code (`vscode://file/` links)
  - "Copy error" button for easy clipboard copying of failure messages
- Added support for the **`disabled`** test status.

### Fixed

- **Synchronized Filters**: Fixed issue where search queries and status filters (Passed/Failed/etc.) operated independently; they are now correctly synchronized.
- **Theme Flash (FOUC)**: Prevented the "flash of unstyled content" by moving theme initialization to a blocking script in the document `<head>`.
- **Failure Message Mapping**: Fixed incorrect failure message association for tests sharing the same title in different suites by switching to full test names.
- **Logo Resolution**: Improved the reliability of logo path resolution for both absolute and relative file paths.

### Changed

- **Build Integrity**: Refactored the build process to inject compiled CSS into distribution files instead of modifying source code in-place.
- **Source-Level Testing**: Updated unit tests and coverage reporting to run directly against TypeScript source files for better accuracy and performance.
- **Code Quality**: Removed inline event handlers in favor of modern event listeners and replaced deprecated `substr()` calls with `slice()`.

## v1.0.6

### Added

- Improved unit test coverage and added code coverage reporting.

### Changed

- Made spacing more consistent throughout the reporter.

## v1.0.5

### Added

- Added configurable `fonts` option for custom Google Fonts. Specify `{ sans, mono }` font names or set to `false` for air-gapped environments.

### Changed

- Improved styling of test status filter menu.

## v1.0.4

### Fixed

- Fixed inconsistent filter chip behavior where clicking between status filters (All, Passed, Failed, etc.) sometimes required multiple clicks to show correct results. The issue was caused by nested describe-groups being evaluated in the wrong order.

## v1.0.3

### Added

- Added support for tracking and displaying flaky tests with retry attempt counts.

## v1.0.2

### Changed

- Improved grouping of test results by describe block.

## v1.0.1

### Changed

- Added Prettier for consistent code formatting.

## v1.0.0

### Added

- Configurable HTML reporter for Jest tests.
