import type { Locator, Page } from '@playwright/test';
import { Report } from './Report';

export class Summary extends Report {
  readonly progressBar: Locator;
  readonly progressBarHeader: Locator;
  readonly progressBarStats: Locator;
  readonly progressBarTrack: Locator;
  readonly progressBarPassedPercentage: Locator;

  constructor(page: Page) {
    super(page);

    this.progressBar = this.page.getByTestId('progress-bar');
    this.progressBarHeader = this.page.getByTestId('progress-bar-header');
    this.progressBarStats = this.page.getByTestId('progress-bar-stats');
    this.progressBarTrack = this.page.getByTestId('progress-bar-track');
    this.progressBarPassedPercentage = this.page.getByTestId('progress-bar-passed-percentage');
  }
}
