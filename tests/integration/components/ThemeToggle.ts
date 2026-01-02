import type { Locator, Page } from '@playwright/test';
import { Report } from './Report';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  NORD = 'nord',
  GITHUB = 'github',
  MONOKAI = 'monokai',
  DRACULA = 'dracula',
}

export class ThemeToggle extends Report {
  readonly themeToggle: Locator;
  readonly themeMenu: Locator;

  constructor(page: Page) {
    super(page);

    this.themeToggle = this.page.getByTestId('theme-toggle');
    this.themeMenu = this.page.getByTestId('theme-menu');
  }

  themeOption(theme: string): Locator {
    return this.page.getByTestId(`theme-option-${theme}`);
  }

  async selectTheme(theme: Theme) {
    await this.themeToggle.click();
    await this.themeOption(theme).click();
  }

  async getActiveTheme(): Promise<string> {
    const htmlClass = await this.page.locator('html').getAttribute('class');
    return htmlClass?.replace('theme-', '') ?? 'unknown';
  }
}
