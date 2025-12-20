/**
 * Reusable report configuration presets for E2E testing.
 * Each preset represents a specific combination of reporter options.
 */

import type { ReporterOptions } from '../../../src/types';

export type ReportConfigPreset = keyof typeof reportConfigs;

/**
 * Base configuration with common defaults
 */
const baseConfig: Partial<ReporterOptions> = {
  pageTitle: 'Test Report',
  embedAssets: true,
};

/**
 * Named configuration presets
 */
export const reportConfigs = {
  /**
   * Standard configuration with all features enabled
   */
  standard: {
    ...baseConfig,
    pageTitle: 'E2E Test Report',
    subtitle: 'Generated for Playwright E2E testing',
    includeEnvironment: true,
    enableThemeToggle: true,
    outputJson: true,
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: true,
    showFilePath: 'filename' as const,
    showProgressBar: true,
    theme: 'dark' as const,
  },

  /**
   * Minimal configuration - bare bones report
   */
  minimal: {
    ...baseConfig,
    pageTitle: 'Minimal Report',
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: false,
    showProgressBar: false,
    includeEnvironment: false,
    enableThemeToggle: false,
    theme: 'light' as const,
  },

  /**
   * Light theme configuration
   */
  lightTheme: {
    ...baseConfig,
    pageTitle: 'Light Theme Report',
    theme: 'light' as const,
    enableThemeToggle: false,
    includeEnvironment: true,
  },

  /**
   * Dark theme configuration
   */
  darkTheme: {
    ...baseConfig,
    pageTitle: 'Dark Theme Report',
    theme: 'dark' as const,
    enableThemeToggle: false,
    includeEnvironment: true,
  },

  /**
   * GitHub theme configuration
   */
  githubTheme: {
    ...baseConfig,
    pageTitle: 'GitHub Theme Report',
    theme: 'github' as const,
    enableThemeToggle: false,
  },

  /**
   * Monokai theme configuration
   */
  monokaiTheme: {
    ...baseConfig,
    pageTitle: 'Monokai Theme Report',
    theme: 'monokai' as const,
    enableThemeToggle: false,
  },

  /**
   * Dracula theme configuration
   */
  draculaTheme: {
    ...baseConfig,
    pageTitle: 'Dracula Theme Report',
    theme: 'dracula' as const,
    enableThemeToggle: false,
  },

  /**
   * Nord theme configuration
   */
  nordTheme: {
    ...baseConfig,
    pageTitle: 'Nord Theme Report',
    theme: 'nord' as const,
    enableThemeToggle: false,
  },

  /**
   * All themes available via toggle
   */
  themeToggle: {
    ...baseConfig,
    pageTitle: 'Theme Toggle Report',
    enableThemeToggle: true,
    theme: 'dark' as const,
  },

  /**
   * Collapsed passed tests
   */
  collapsedPassed: {
    ...baseConfig,
    pageTitle: 'Collapsed Passed Report',
    collapsePassed: true,
    collapseAll: false,
  },

  /**
   * All suites collapsed
   */
  collapsedAll: {
    ...baseConfig,
    pageTitle: 'Collapsed All Report',
    collapseAll: true,
  },

  /**
   * Expanded to specific level
   */
  expandLevel2: {
    ...baseConfig,
    pageTitle: 'Expand Level 2 Report',
    expandLevel: 2,
    collapseAll: false,
    collapsePassed: false,
  },

  /**
   * Full file paths shown
   */
  fullPaths: {
    ...baseConfig,
    pageTitle: 'Full Paths Report',
    showFilePath: 'full' as const,
  },

  /**
   * Filename only paths
   */
  filenamePaths: {
    ...baseConfig,
    pageTitle: 'Filename Paths Report',
    showFilePath: 'filename' as const,
  },

  /**
   * No progress bar
   */
  noProgressBar: {
    ...baseConfig,
    pageTitle: 'No Progress Bar Report',
    showProgressBar: false,
  },

  /**
   * No duration display
   */
  noDuration: {
    ...baseConfig,
    pageTitle: 'No Duration Report',
    showDuration: false,
  },

  /**
   * Sorted by status
   */
  sortByStatus: {
    ...baseConfig,
    pageTitle: 'Sort by Status Report',
    sort: 'status' as const,
  },

  /**
   * Sorted by duration
   */
  sortByDuration: {
    ...baseConfig,
    pageTitle: 'Sort by Duration Report',
    sort: 'duration' as const,
  },

  /**
   * Sorted by name
   */
  sortByName: {
    ...baseConfig,
    pageTitle: 'Sort by Name Report',
    sort: 'name' as const,
  },

  /**
   * ISO date format
   */
  isoDate: {
    ...baseConfig,
    pageTitle: 'ISO Date Report',
    dateFormat: 'iso' as const,
  },

  /**
   * Relative date format
   */
  relativeDate: {
    ...baseConfig,
    pageTitle: 'Relative Date Report',
    dateFormat: 'relative' as const,
  },

  /**
   * Locale date format
   */
  localeDate: {
    ...baseConfig,
    pageTitle: 'Locale Date Report',
    dateFormat: 'locale' as const,
  },

  /**
   * With logo
   */
  withLogo: {
    ...baseConfig,
    pageTitle: 'Report with Logo',
    logo: 'https://jestjs.io/img/jest.png',
    logoHeight: 48,
  },

  /**
   * With subtitle
   */
  withSubtitle: {
    ...baseConfig,
    pageTitle: 'Report with Subtitle',
    subtitle: 'Custom subtitle for testing',
  },

  /**
   * Environment info enabled
   */
  withEnvironment: {
    ...baseConfig,
    pageTitle: 'Environment Info Report',
    includeEnvironment: true,
  },

  /**
   * Environment info disabled
   */
  noEnvironment: {
    ...baseConfig,
    pageTitle: 'No Environment Report',
    includeEnvironment: false,
  },

  /**
   * JSON output enabled
   */
  withJson: {
    ...baseConfig,
    pageTitle: 'JSON Output Report',
    outputJson: true,
  },

  /**
   * Only show failed tests
   */
  failedOnly: {
    ...baseConfig,
    pageTitle: 'Failed Only Report',
    showPassed: false,
    showFailed: true,
    showPending: false,
  },

  /**
   * Only show passed tests
   */
  passedOnly: {
    ...baseConfig,
    pageTitle: 'Passed Only Report',
    showPassed: true,
    showFailed: false,
    showPending: false,
  },

  /**
   * Kitchen sink - all features enabled
   */
  kitchenSink: {
    ...baseConfig,
    pageTitle: 'Kitchen Sink Report',
    subtitle: 'All features enabled for comprehensive testing',
    includeEnvironment: true,
    enableThemeToggle: true,
    outputJson: true,
    showPassed: true,
    showFailed: true,
    showPending: true,
    showDuration: true,
    showFilePath: 'full' as const,
    showProgressBar: true,
    theme: 'dark' as const,
    sort: 'status' as const,
    dateFormat: 'locale' as const,
  },
} satisfies Record<string, Partial<ReporterOptions>>;

/**
 * Get a report configuration by preset name
 */
export function getReportConfig(preset: ReportConfigPreset): Partial<ReporterOptions> {
  return { ...reportConfigs[preset] };
}

/**
 * Create a custom configuration by extending a preset
 */
export function extendReportConfig(
  preset: ReportConfigPreset,
  overrides: Partial<ReporterOptions>,
): Partial<ReporterOptions> {
  return { ...reportConfigs[preset], ...overrides };
}
