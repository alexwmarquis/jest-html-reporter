/**
 * Report Factory - generates sample reports on demand for E2E testing.
 * This replaces the need for extensive global-setup logic.
 */

import * as path from 'path';
import * as fs from 'fs';
// @ts-ignore - importing compiled output
import JestHtmlReporter = require('../../../dist/index');
import { testDataFactories, type TestDataVariant } from './test-data';
import { reportConfigs, type ReportConfigPreset } from './report-configs';
import type { ReporterOptions } from '../../../src/types';

/**
 * Options for generating a report
 */
export interface GenerateReportOptions {
  /** Test data variant to use */
  data?: TestDataVariant;
  /** Report configuration preset to use */
  config?: ReportConfigPreset;
  /** Custom overrides for the report configuration */
  configOverrides?: Partial<ReporterOptions>;
  /** Custom test data (overrides data variant if provided) */
  customData?: ReturnType<typeof testDataFactories.mixed>;
}

/**
 * Result of generating a report
 */
export interface GeneratedReport {
  /** Absolute path to the generated HTML file */
  htmlPath: string;
  /** Absolute path to the generated JSON file (if outputJson is true) */
  jsonPath?: string;
  /** File URL for loading in browser */
  fileUrl: string;
  /** The configuration used to generate the report */
  config: Partial<ReporterOptions>;
  /** The test data used to generate the report */
  data: ReturnType<typeof testDataFactories.mixed>;
}

/**
 * Cache for generated reports to avoid regenerating identical reports
 */
const reportCache = new Map<string, GeneratedReport>();

/**
 * Get the output directory for generated reports
 */
function getOutputDir(): string {
  const dir = path.resolve(__dirname, '../generated-reports');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Generate a unique filename based on the options
 */
function generateFilename(options: GenerateReportOptions): string {
  const dataName = options.customData ? 'custom' : (options.data ?? 'mixed');
  const configName = options.config ?? 'standard';
  const hasOverrides = options.configOverrides && Object.keys(options.configOverrides).length > 0;
  const suffix = hasOverrides ? `-${hashObject(options.configOverrides!)}` : '';
  return `report-${dataName}-${configName}${suffix}`;
}

/**
 * Simple hash function for creating unique filenames
 */
function hashObject(obj: object): string {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).slice(0, 8);
}

/**
 * Generate a cache key for the report options
 */
function getCacheKey(options: GenerateReportOptions): string {
  return JSON.stringify({
    data: options.data ?? 'mixed',
    config: options.config ?? 'standard',
    overrides: options.configOverrides ?? {},
    customData: options.customData ? 'custom' : null,
  });
}

/**
 * Generate a sample report with the specified options
 */
export function generateReport(options: GenerateReportOptions = {}): GeneratedReport {
  const cacheKey = getCacheKey(options);

  // Check cache first
  const cached = reportCache.get(cacheKey);
  if (cached && fs.existsSync(cached.htmlPath)) {
    return cached;
  }

  const outputDir = getOutputDir();
  const filename = generateFilename(options);
  const htmlPath = path.join(outputDir, `${filename}.html`);
  const jsonPath = path.join(outputDir, `${filename}.json`);

  // Get test data
  const dataVariant = options.data ?? 'mixed';
  const data = options.customData ?? testDataFactories[dataVariant]();

  // Build configuration
  const configPreset = options.config ?? 'standard';
  const baseConfig = { ...reportConfigs[configPreset] };
  const config: Partial<ReporterOptions> = {
    ...baseConfig,
    ...options.configOverrides,
    outputPath: htmlPath,
  };

  // Generate the report
  const reporter = new JestHtmlReporter({ rootDir: process.cwd() }, config);

  // @ts-ignore - accessing internal method
  reporter.onRunComplete(new Set(), data);

  // Verify the report was created
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Failed to generate report at ${htmlPath}`);
  }

  const result: GeneratedReport = {
    htmlPath,
    jsonPath: config.outputJson && fs.existsSync(jsonPath) ? jsonPath : undefined,
    fileUrl: `file://${htmlPath}`,
    config,
    data,
  };

  // Cache the result
  reportCache.set(cacheKey, result);

  return result;
}

/**
 * Generate multiple reports in batch
 */
export function generateReports(optionsList: GenerateReportOptions[]): GeneratedReport[] {
  return optionsList.map(options => generateReport(options));
}

/**
 * Clear the report cache
 */
export function clearReportCache(): void {
  reportCache.clear();
}

/**
 * Clean up generated report files
 */
export function cleanupGeneratedReports(): void {
  const outputDir = getOutputDir();
  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    for (const file of files) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  }
  clearReportCache();
}

/**
 * Pre-defined report variants for common test scenarios
 */
export const reportVariants = {
  /** Standard report with mixed results */
  standard: () => generateReport({ data: 'mixed', config: 'standard' }),

  /** All tests passing */
  allPassing: () => generateReport({ data: 'allPassing', config: 'standard' }),

  /** All tests failing */
  allFailing: () => generateReport({ data: 'allFailing', config: 'standard' }),

  /** Empty report */
  empty: () => generateReport({ data: 'empty', config: 'minimal' }),

  /** Large report for performance testing */
  large: () => generateReport({ data: 'large', config: 'standard' }),

  /** Minimal configuration */
  minimal: () => generateReport({ data: 'mixed', config: 'minimal' }),

  /** Light theme */
  lightTheme: () => generateReport({ data: 'mixed', config: 'lightTheme' }),

  /** Dark theme */
  darkTheme: () => generateReport({ data: 'mixed', config: 'darkTheme' }),

  /** With theme toggle */
  themeToggle: () => generateReport({ data: 'mixed', config: 'themeToggle' }),

  /** Collapsed passed tests */
  collapsedPassed: () => generateReport({ data: 'mixed', config: 'collapsedPassed' }),

  /** All collapsed */
  collapsedAll: () => generateReport({ data: 'mixed', config: 'collapsedAll' }),

  /** With environment info */
  withEnvironment: () => generateReport({ data: 'mixed', config: 'withEnvironment' }),

  /** Sorted by status */
  sortedByStatus: () => generateReport({ data: 'mixed', config: 'sortByStatus' }),

  /** Full file paths */
  fullPaths: () => generateReport({ data: 'mixed', config: 'fullPaths' }),

  /** Kitchen sink - all features */
  kitchenSink: () => generateReport({ data: 'large', config: 'kitchenSink' }),

  /** Verbose error messages */
  verboseErrors: () => generateReport({ data: 'verboseErrors', config: 'standard' }),

  /** Deeply nested suites */
  deeplyNested: () => generateReport({ data: 'deeplyNested', config: 'standard' }),
} as const;
