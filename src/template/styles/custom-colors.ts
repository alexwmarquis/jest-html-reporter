import type { CustomColors } from '../../types';

export function generateCustomColorsCss(colors: CustomColors): string {
  const mappings: Record<keyof CustomColors, string> = {
    bgPrimary: '--bg-primary',
    bgSecondary: '--bg-secondary',
    bgHover: '--bg-hover',
    textPrimary: '--text-primary',
    textSecondary: '--text-secondary',
    borderColor: '--border-color',
    colorPassed: '--color-passed',
    colorFailed: '--color-failed',
    colorSkipped: '--color-skipped',
    colorAccent: '--color-accent',
  };

  const rules: string[] = [];
  for (const [key, cssVar] of Object.entries(mappings)) {
    const value = colors[key as keyof CustomColors];
    if (value) {
      rules.push(`  ${cssVar}: ${value};`);
    }
  }

  if (rules.length === 0) {
    return '';
  }

  return `:root {\n${rules.join('\n')}\n}`;
}
