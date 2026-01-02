import type { Locator, Page } from '@playwright/test';
import { Report } from './Report';

export class Filters extends Report {
  readonly searchBox: Locator;
  readonly searchInput: Locator;
  readonly filterChipAll: Locator;
  readonly filterChipPassed: Locator;
  readonly filterChipFailed: Locator;
  readonly filterChipFlaky: Locator;
  readonly filterChipSkipped: Locator;

  constructor(page: Page) {
    super(page);

    this.searchBox = this.page.getByTestId('search-box');
    this.searchInput = this.page.getByTestId('search-input');
    this.filterChipAll = this.page.getByTestId('filter-chip-all');
    this.filterChipPassed = this.page.getByTestId('filter-chip-passed');
    this.filterChipFailed = this.page.getByTestId('filter-chip-failed');
    this.filterChipFlaky = this.page.getByTestId('filter-chip-flaky');
    this.filterChipSkipped = this.page.getByTestId('filter-chip-skipped');
  }
}
