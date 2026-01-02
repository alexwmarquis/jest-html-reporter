import { escapeHtml } from '../utils';

export function formatDiffHtml(diff: string): string {
  return diff
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') && !trimmed.startsWith('---')) {
        return `<span class="diff-removed" data-testid="diff-removed">${escapeHtml(line)}</span>`;
      }
      if (trimmed.startsWith('+') && !trimmed.startsWith('+++')) {
        return `<span class="diff-added" data-testid="diff-added">${escapeHtml(line)}</span>`;
      }
      return escapeHtml(line);
    })
    .join('\n');
}
