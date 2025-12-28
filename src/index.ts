import * as fs from 'fs';
import * as path from 'path';
import type { Config, AggregatedResult, TestResult } from '@jest/reporters';
import type { AssertionResult } from '@jest/test-result';
import { generateHtmlReport } from './template';
import type {
  ReporterOptions,
  ReportData,
  TestSummary,
  ProcessedTestSuite,
  ProcessedTest,
  TemplateOptions,
} from './types';

class JestHtmlReporter {
  private globalConfig: Config.GlobalConfig;
  private options: ReporterOptions;

  constructor(globalConfig: Config.GlobalConfig, options: ReporterOptions = {}) {
    this.globalConfig = globalConfig;
    this.options = options;
  }

  onRunComplete(_contexts: Set<unknown>, results: AggregatedResult): void {
    const {
      outputPath = 'jest-report.html',
      outputJson = false,
      openOnFailure = false,
      pageTitle = 'Jest Test Report',
      subtitle,
      logo,
      logoHeight = 32,
      showPassed = true,
      showFailed = true,
      showPending = true,
      showDuration = true,
      showFilePath = 'filename',
      showProgressBar = true,
      includeEnvironment = false,
      additionalInfo,
      minify = true,
      sort = 'default',
      collapsePassed = false,
      collapseAll = false,
      expandLevel = -1,
      dateFormat = 'locale',
      theme = 'dark',
      customColors,
      enableThemeToggle = false,
      customCssPath,
      customJsPath,
      embedAssets = true,
      fonts = { sans: 'Google Sans', mono: 'Google Sans Code' },
    } = this.options;

    let customCss: string | undefined;
    if (customCssPath) {
      const cssPath = path.isAbsolute(customCssPath)
        ? customCssPath
        : path.resolve(process.cwd(), customCssPath);
      if (fs.existsSync(cssPath)) {
        customCss = fs.readFileSync(cssPath, 'utf8');
      } else {
        console.warn(`⚠️ Custom CSS file not found: ${cssPath}`);
      }
    }

    let customJs: string | undefined;
    if (customJsPath) {
      const jsPath = path.isAbsolute(customJsPath)
        ? customJsPath
        : path.resolve(process.cwd(), customJsPath);
      if (fs.existsSync(jsPath)) {
        customJs = fs.readFileSync(jsPath, 'utf8');
      } else {
        console.warn(`⚠️ Custom JavaScript file not found: ${jsPath}`);
      }
    }

    const reportData = this.processResults(results);

    if (sort !== 'default') {
      this.sortResults(reportData, sort);
    }

    let resolvedLogo = logo;
    if (logo && embedAssets && !logo.startsWith('http') && !logo.startsWith('data:')) {
      let logoPath = path.isAbsolute(logo) ? logo : path.resolve(process.cwd(), logo);

      if (!fs.existsSync(logoPath) && path.isAbsolute(logo)) {
        const relativeLogoPath = path.resolve(
          process.cwd(),
          logo.startsWith('/') ? logo.slice(1) : logo,
        );
        if (fs.existsSync(relativeLogoPath)) {
          logoPath = relativeLogoPath;
        }
      }

      if (fs.existsSync(logoPath)) {
        const buffer = fs.readFileSync(logoPath);
        const ext = path.extname(logoPath).slice(1).toLowerCase();
        const MIME_OVERRIDES: Record<string, string> = {
          svg: 'image/svg+xml',
          jpg: 'image/jpeg',
          ico: 'image/x-icon',
        };
        const mimeType = MIME_OVERRIDES[ext] ?? `image/${ext}`;
        resolvedLogo = `data:${mimeType};base64,${buffer.toString('base64')}`;
      } else {
        console.warn(`⚠️ Logo file not found: ${logoPath}`);
      }
    }

    const DEFAULT_SANS = 'Google Sans';
    const DEFAULT_MONO = 'Google Sans Code';

    const resolvedFonts =
      fonts === false
        ? false
        : {
            sans: fonts.sans || DEFAULT_SANS,
            mono: fonts.mono || DEFAULT_MONO,
            url: this.buildGoogleFontsUrl(fonts.sans || DEFAULT_SANS, fonts.mono || DEFAULT_MONO),
          };

    const templateOptions: TemplateOptions = {
      pageTitle,
      subtitle,
      logo: resolvedLogo,
      logoHeight,
      showPassed,
      showFailed,
      showPending,
      showDuration,
      showFilePath,
      showProgressBar,
      theme,
      customColors,
      enableThemeToggle,
      customCss,
      customJs,
      sort,
      collapsePassed,
      collapseAll,
      expandLevel,
      includeEnvironment,
      additionalInfo,
      minify,
      dateFormat,
      embedAssets,
      fonts: resolvedFonts,
    };

    const html = generateHtmlReport(reportData, templateOptions);

    const absolutePath = path.isAbsolute(outputPath)
      ? outputPath
      : path.resolve(process.cwd(), outputPath);

    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(absolutePath, html, 'utf8');
    console.log(`\n📊 Jest HTML Report generated: ${absolutePath}\n`);

    if (outputJson) {
      const jsonPath = absolutePath.replace(/\.html$/, '.json');
      fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2), 'utf8');
      console.log(`📄 Jest JSON data saved: ${jsonPath}\n`);
    }

    if (openOnFailure && !results.success) {
      this.openInBrowser(absolutePath);
    }
  }

  private openInBrowser(filePath: string): void {
    const { exec } = require('child_process');
    const { platform } = process;

    let command: string;
    if (platform === 'darwin') {
      command = `open "${filePath}"`;
    } else if (platform === 'win32') {
      command = `start "" "${filePath}"`;
    } else {
      command = `xdg-open "${filePath}"`;
    }

    exec(command, (error: Error | null) => {
      if (error) {
        console.warn(`⚠️ Could not open browser: ${error.message}`);
      }
    });
  }

  private sortResults(data: ReportData, sort: 'status' | 'duration' | 'name'): void {
    const statusOrder = { failed: 0, pending: 1, passed: 2 };

    data.testSuites.sort((a, b) => {
      switch (sort) {
        case 'status':
          return statusOrder[a.status] - statusOrder[b.status];
        case 'duration':
          return b.duration - a.duration;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    for (const suite of data.testSuites) {
      suite.tests.sort((a, b) => {
        switch (sort) {
          case 'status':
            return (
              (statusOrder[a.status as keyof typeof statusOrder] ?? 1) -
              (statusOrder[b.status as keyof typeof statusOrder] ?? 1)
            );
          case 'duration':
            return b.duration - a.duration;
          case 'name':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }
  }

  private processResults(results: AggregatedResult): ReportData {
    const { startTime } = results;
    const endTime = Date.now();

    const testSuites = results.testResults.map((suite: TestResult) => this.processSuite(suite));

    const flakyTests = testSuites.reduce(
      (count: number, suite: ProcessedTestSuite): number =>
        count + suite.tests.filter((t: ProcessedTest): boolean => t.isFlaky).length,
      0,
    );

    const summary: TestSummary = {
      totalSuites: results.numTotalTestSuites,
      passedSuites: results.numPassedTestSuites,
      failedSuites: results.numFailedTestSuites,
      pendingSuites: results.numPendingTestSuites,
      totalTests: results.numTotalTests,
      passedTests: results.numPassedTests,
      failedTests: results.numFailedTests,
      pendingTests: results.numPendingTests,
      todoTests: results.numTodoTests,
      flakyTests,
      duration: endTime - startTime,
      success: results.success,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    };

    return { summary, testSuites };
  }

  private processSuite(suite: TestResult): ProcessedTestSuite {
    const suitePath = suite.testFilePath;
    const relativePath = path.relative(process.cwd(), suitePath);

    const errorSections = this.parseFailureMessageByTest(suite.failureMessage, suite.testResults);

    return {
      name: relativePath,
      path: suitePath,
      status: this.getSuiteStatus(suite),
      duration: suite.perfStats ? suite.perfStats.end - suite.perfStats.start : 0,
      tests: suite.testResults.map(test => this.processTest(test, errorSections)),
      failureMessage: suite.failureMessage || null,
    };
  }

  private parseFailureMessageByTest(
    failureMessage: string | null | undefined,
    testResults: AssertionResult[],
  ): Map<string, string> {
    const errorMap = new Map<string, string>();
    if (!failureMessage) return errorMap;

    const failedTests = testResults.filter(t => t.status === 'failed');

    for (const test of failedTests) {
      const testPattern = new RegExp(`●[^●]*${this.escapeRegex(test.title)}[\\s\\S]*?(?=●|$)`, 'g');
      const match = failureMessage.match(testPattern);
      if (match && match[0]) {
        errorMap.set(test.fullName, match[0].trim());
      }
    }

    return errorMap;
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private buildGoogleFontsUrl(sans: string, mono: string): string {
    const encodeSans = sans.replace(/ /g, '+');
    const encodeMono = mono.replace(/ /g, '+');
    return `https://fonts.googleapis.com/css2?family=${encodeMono}:wght@400;500&family=${encodeSans}:wght@400;500;600&display=swap`;
  }

  private getSuiteStatus(suite: TestResult): 'passed' | 'failed' | 'pending' {
    if (suite.numFailingTests > 0) return 'failed';
    if (suite.numPendingTests === suite.testResults.length) return 'pending';
    return 'passed';
  }

  private processTest(test: AssertionResult, errorSections: Map<string, string>): ProcessedTest {
    const invocations = ((test as unknown as { invocations?: number })?.invocations ?? 1) as number;
    const isFlaky = test.status === 'passed' && ((invocations > 1) as boolean);

    const detailedError = errorSections.get(test.fullName);
    const failureMessages = detailedError ? [detailedError] : test.failureMessages || [];

    return {
      title: test.title,
      fullName: test.fullName,
      ancestorTitles: test.ancestorTitles,
      status: test.status as ProcessedTest['status'],
      duration: test.duration || 0,
      failureMessages,
      failureDetails: test.failureDetails || [],
      invocations,
      isFlaky,
    };
  }
}

export = JestHtmlReporter;
