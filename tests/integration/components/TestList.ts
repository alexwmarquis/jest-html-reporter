import type { Locator, Page } from '@playwright/test';
import { Report } from './Report';

export class TestList extends Report {
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

  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);

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

    this.emptyState = this.page.getByTestId('empty-state');
  }
}
