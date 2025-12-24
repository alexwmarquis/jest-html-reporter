import { Page, Locator } from '@playwright/test';

export class ReportPage {
  // Header & Navigation
  readonly header: Locator;
  readonly headerLogo: Locator;
  readonly reportHeader: Locator;
  readonly reportTitle: Locator;
  readonly reportSubtitle: Locator;
  readonly reportTitleRow: Locator;
  readonly subnav: Locator;
  readonly subnavContainer: Locator;
  readonly metaInfo: Locator;

  // Search & Filters
  readonly searchBox: Locator;
  readonly searchInput: Locator;
  readonly filterChipAll: Locator;
  readonly filterChipPassed: Locator;
  readonly filterChipFailed: Locator;
  readonly filterChipFlaky: Locator;
  readonly filterChipSkipped: Locator;

  // Progress Bar
  readonly progressBar: Locator;
  readonly progressBarHeader: Locator;
  readonly progressBarStats: Locator;
  readonly progressBarTrack: Locator;

  // Theme
  readonly themeToggle: Locator;
  readonly themeMenu: Locator;
  readonly themeOption: (theme: string) => Locator;

  // Environment Info
  readonly environmentInfo: Locator;
  readonly environmentHeader: Locator;
  readonly environmentGrid: Locator;

  // Test Results (Suites, Describes, Items)
  readonly testSuite: Locator;
  readonly suiteHeader: Locator;
  readonly suiteName: Locator;
  readonly suiteDuration: Locator;
  readonly suiteBody: Locator;

  readonly describeGroup: Locator;
  readonly describeHeader: Locator;
  readonly describeName: Locator;
  readonly describeCount: Locator;
  readonly describeBody: Locator;

  readonly testItem: Locator;
  readonly testTitle: Locator;
  readonly testDuration: Locator;
  readonly flakyBadge: Locator;

  // Errors
  readonly errorContainer: Locator;
  readonly errorActions: Locator;
  readonly copyErrorBtn: Locator;
  readonly errorBlockEnhanced: Locator;
  readonly errorMessage: Locator;
  readonly errorDiffContainer: Locator;
  readonly errorDiffContent: Locator;
  readonly errorDiffFull: Locator;
  readonly errorDiffTitle: Locator;
  readonly errorDiffRowExpected: Locator;
  readonly errorDiffRowReceived: Locator;
  readonly errorDiffLabelExpected: Locator;
  readonly errorDiffLabelReceived: Locator;
  readonly errorDiffValueExpected: Locator;
  readonly errorDiffValueReceived: Locator;
  readonly diffAdded: Locator;
  readonly diffRemoved: Locator;

  // Stack Trace
  readonly errorStack: Locator;
  readonly errorStackTitle: Locator;
  readonly errorStackFrames: Locator;
  readonly errorStackFrame: Locator;
  readonly errorStackHidden: Locator;
  readonly errorStackToggle: Locator;
  readonly stackAt: Locator;
  readonly stackFile: Locator;
  readonly stackFunction: Locator;
  readonly stackLine: Locator;
  readonly stackLocation: Locator;
  readonly stackRaw: Locator;

  // Other
  readonly emptyState: Locator;

  constructor(protected readonly page: Page) {
    // Header & Navigation
    this.header = this.page.getByTestId('header');
    this.headerLogo = this.page.getByTestId('header-logo');
    this.reportHeader = this.page.getByTestId('report-header');
    this.reportTitle = this.page.getByTestId('report-title');
    this.reportSubtitle = this.page.getByTestId('report-subtitle');
    this.reportTitleRow = this.page.getByTestId('report-title-row');
    this.subnav = this.page.getByTestId('subnav');
    this.subnavContainer = this.page.getByTestId('subnav-container');
    this.metaInfo = this.page.getByTestId('meta-info');

    // Search & Filters
    this.searchBox = this.page.getByTestId('search-box');
    this.searchInput = this.page.getByTestId('search-input');
    this.filterChipAll = this.page.getByTestId('filter-chip-all');
    this.filterChipPassed = this.page.getByTestId('filter-chip-passed');
    this.filterChipFailed = this.page.getByTestId('filter-chip-failed');
    this.filterChipFlaky = this.page.getByTestId('filter-chip-flaky');
    this.filterChipSkipped = this.page.getByTestId('filter-chip-skipped');

    // Progress Bar
    this.progressBar = this.page.getByTestId('progress-bar');
    this.progressBarHeader = this.page.getByTestId('progress-bar-header');
    this.progressBarStats = this.page.getByTestId('progress-bar-stats');
    this.progressBarTrack = this.page.getByTestId('progress-bar-track');

    // Theme
    this.themeToggle = this.page.getByTestId('theme-toggle');
    this.themeMenu = this.page.getByTestId('theme-menu');
    this.themeOption = (theme: string) => this.page.getByTestId(`theme-option-${theme}`);

    // Environment Info
    this.environmentInfo = this.page.getByTestId('environment-info');
    this.environmentHeader = this.page.getByTestId('environment-header');
    this.environmentGrid = this.page.getByTestId('environment-grid');

    // Test Results (Suites, Describes, Items)
    this.testSuite = this.page.getByTestId('test-suite');
    this.suiteHeader = this.page.getByTestId('suite-header');
    this.suiteName = this.page.getByTestId('suite-name');
    this.suiteDuration = this.page.getByTestId('suite-duration');
    this.suiteBody = this.page.getByTestId('suite-body');

    this.describeGroup = this.page.getByTestId('describe-group');
    this.describeHeader = this.page.getByTestId('describe-header');
    this.describeName = this.page.getByTestId('describe-name');
    this.describeCount = this.page.getByTestId('describe-count');
    this.describeBody = this.page.getByTestId('describe-body');

    this.testItem = this.page.getByTestId('test-item');
    this.testTitle = this.page.getByTestId('test-title');
    this.testDuration = this.page.getByTestId('test-duration');
    this.flakyBadge = this.page.getByTestId('flaky-badge');

    // Errors
    this.errorContainer = this.page.getByTestId('error-container');
    this.errorActions = this.page.getByTestId('error-actions');
    this.copyErrorBtn = this.page.getByTestId('copy-error-btn');
    this.errorBlockEnhanced = this.page.getByTestId('error-block-enhanced');
    this.errorMessage = this.page.getByTestId('error-message');
    this.errorDiffContainer = this.page.getByTestId('error-diff-container');
    this.errorDiffContent = this.page.getByTestId('error-diff-content');
    this.errorDiffFull = this.page.getByTestId('error-diff-full');
    this.errorDiffTitle = this.page.getByTestId('error-diff-title');
    this.errorDiffRowExpected = this.page.getByTestId('error-diff-row-expected');
    this.errorDiffRowReceived = this.page.getByTestId('error-diff-row-received');
    this.errorDiffLabelExpected = this.page.getByTestId('error-diff-label-expected');
    this.errorDiffLabelReceived = this.page.getByTestId('error-diff-label-received');
    this.errorDiffValueExpected = this.page.getByTestId('error-diff-value-expected');
    this.errorDiffValueReceived = this.page.getByTestId('error-diff-value-received');
    this.diffAdded = this.page.getByTestId('diff-added');
    this.diffRemoved = this.page.getByTestId('diff-removed');

    // Stack Trace
    this.errorStack = this.page.getByTestId('error-stack');
    this.errorStackTitle = this.page.getByTestId('error-stack-title');
    this.errorStackFrames = this.page.getByTestId('error-stack-frames');
    this.errorStackFrame = this.page.getByTestId('error-stack-frame');
    this.errorStackHidden = this.page.getByTestId('error-stack-hidden');
    this.errorStackToggle = this.page.getByTestId('error-stack-toggle');
    this.stackAt = this.page.getByTestId('stack-at');
    this.stackFile = this.page.getByTestId('stack-file');
    this.stackFunction = this.page.getByTestId('stack-function');
    this.stackLine = this.page.getByTestId('stack-line');
    this.stackLocation = this.page.getByTestId('stack-location');
    this.stackRaw = this.page.getByTestId('stack-raw');

    // Other
    this.emptyState = this.page.getByTestId('empty-state');
  }

  async open() {
    await this.page.goto('');
  }
}
