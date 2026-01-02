import type { Locator, Page } from '@playwright/test';
import { Report } from './Report';

export class EnvironmentInfo extends Report {
  readonly environmentInfo: Locator;
  readonly environmentHeader: Locator;
  readonly environmentGrid: Locator;

  constructor(page: Page) {
    super(page);

    this.environmentInfo = this.page.getByTestId('environment-info');
    this.environmentHeader = this.page.getByTestId('environment-header');
    this.environmentGrid = this.page.getByTestId('environment-grid');
  }
}
