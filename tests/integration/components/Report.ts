import type { Page } from '@playwright/test';

export class Report {
  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('');
  }
}
