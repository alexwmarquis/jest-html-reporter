import type { ThemePreset } from '../../types';

export const THEME_PREVIEWS: Record<ThemePreset, string> = {
  dark: '#1e1e1e',
  light: '#ffffff',
  github: '#0d1117',
  monokai: '#272822',
  dracula: '#282a36',
  nord: '#2e3440',
};

export function generateThemeToggle(currentTheme: ThemePreset): string {
  const themes: ThemePreset[] = ['dark', 'light', 'github', 'monokai', 'dracula', 'nord'];

  return `
    <button class="theme-toggle" id="theme-toggle" data-testid="theme-toggle" title="Change theme">
      <i class="bi bi-palette"></i>
    </button>
    <div class="theme-menu" id="theme-menu" data-testid="theme-menu">
      ${themes
        .map(
          t => `
        <div class="theme-option${t === currentTheme ? ' active' : ''}" data-theme="${t}" data-testid="theme-option-${t}">
          <span class="color-preview" style="background: ${THEME_PREVIEWS[t]}"></span>
          ${t.charAt(0).toUpperCase() + t.slice(1)}
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

export function generateJumpToTop(hasThemeToggle: boolean): string {
  return `
    <button class="jump-to-top${hasThemeToggle ? ' with-theme-toggle' : ''}" id="jump-to-top" data-testid="jump-to-top" title="Jump to top" aria-label="Jump to top">
      <i class="bi bi-chevron-up"></i>
    </button>
  `;
}
