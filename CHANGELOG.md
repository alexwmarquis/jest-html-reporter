# Changelog

All notable changes to this project will be documented in this file.
This project adheres to semantic versioning.

## Unreleased

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
