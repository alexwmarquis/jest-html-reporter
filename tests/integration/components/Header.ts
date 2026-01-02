import type { Locator, Page } from '@playwright/test';
import { Report } from './Report';

export class Header extends Report {
  readonly header: Locator;
  readonly headerLogo: Locator;
  readonly reportHeader: Locator;
  readonly reportTitle: Locator;
  readonly reportSubtitle: Locator;
  readonly reportTitleRow: Locator;
  readonly subnav: Locator;
  readonly subnavContainer: Locator;
  readonly metaInfo: Locator;

  constructor(page: Page) {
    super(page);

    this.header = this.page.getByTestId('header');
    this.headerLogo = this.page.getByTestId('header-logo');
    this.reportHeader = this.page.getByTestId('report-header');
    this.reportTitle = this.page.getByTestId('report-title');
    this.reportSubtitle = this.page.getByTestId('report-subtitle');
    this.reportTitleRow = this.page.getByTestId('report-title-row');
    this.subnav = this.page.getByTestId('subnav');
    this.subnavContainer = this.page.getByTestId('subnav-container');
    this.metaInfo = this.page.getByTestId('meta-info');
  }
}
