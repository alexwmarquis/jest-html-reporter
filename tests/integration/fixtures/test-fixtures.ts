/**
 * Custom Playwright test fixtures for report testing.
 * Extends the base Playwright test with report generation capabilities.
 */

import { test as base, expect } from '@playwright/test';
import {
  generateReport,
  reportVariants,
  type GenerateReportOptions,
  type GeneratedReport,
} from './report-factory';
import type { TestDataVariant } from './test-data';
import type { ReportConfigPreset } from './report-configs';
import type { ReporterOptions } from '../../../src/types';

/**
 * Custom fixture types
 */
type ReportFixtures = {
  /**
   * Generate a report with custom options and navigate to it.
   * Returns the generated report info.
   */
  useReport: (options?: GenerateReportOptions) => Promise<GeneratedReport>;

  /**
   * Quick access to pre-defined report variants.
   * Generates the report and navigates to it.
   */
  useReportVariant: (variant: keyof typeof reportVariants) => Promise<GeneratedReport>;

  /**
   * Generate a report with a specific data variant and config preset.
   * Shorthand for common use cases.
   */
  useReportWith: (
    data: TestDataVariant,
    config: ReportConfigPreset,
    overrides?: Partial<ReporterOptions>,
  ) => Promise<GeneratedReport>;

  /**
   * The currently loaded report (if any)
   */
  currentReport: GeneratedReport | null;
};

/**
 * Extended test with report fixtures
 */
export const test = base.extend<ReportFixtures>({
  // Store the current report
  currentReport: [null, { option: true }],

  // Generate and navigate to a custom report
  useReport: async ({ page }, use) => {
    let loadedReport: GeneratedReport | null = null;

    const reportLoader = async (options: GenerateReportOptions = {}) => {
      const report = generateReport(options);
      await page.goto(report.fileUrl);
      loadedReport = report;
      return report;
    };

    await use(reportLoader);
  },

  // Quick access to pre-defined variants
  useReportVariant: async ({ page }, use) => {
    const variantLoader = async (variant: keyof typeof reportVariants) => {
      const report = reportVariants[variant]();
      await page.goto(report.fileUrl);
      return report;
    };

    await use(variantLoader);
  },

  // Shorthand for data + config combination
  useReportWith: async ({ page }, use) => {
    const reportLoader = async (
      data: TestDataVariant,
      config: ReportConfigPreset,
      overrides?: Partial<ReporterOptions>,
    ) => {
      const report = generateReport({
        data,
        config,
        configOverrides: overrides,
      });
      await page.goto(report.fileUrl);
      return report;
    };

    await use(reportLoader);
  },
});

// Re-export expect for convenience
export { expect };

/**
 * Helper function to create a describe block for a specific report variant.
 * Useful for organizing tests around specific configurations.
 */
export function describeReportVariant(
  variant: keyof typeof reportVariants,
  fn: (getReport: () => GeneratedReport) => void,
) {
  let report: GeneratedReport;

  test.describe(variant, () => {
    test.beforeAll(() => {
      report = reportVariants[variant]();
    });

    fn(() => report);
  });
}

/**
 * Helper to create parameterized tests across multiple report variants
 */
export function testAcrossVariants(
  testName: string,
  variants: (keyof typeof reportVariants)[],
  testFn: (variant: keyof typeof reportVariants, report: GeneratedReport) => Promise<void>,
) {
  for (const variant of variants) {
    test(`${testName} [${variant}]`, async ({ useReportVariant }) => {
      const report = await useReportVariant(variant);
      await testFn(variant, report);
    });
  }
}
