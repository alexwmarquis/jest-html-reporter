import type { AdditionalInfo } from '../../types';
import { escapeHtml } from '../utils';

export function generateAdditionalInfoHtml(info: AdditionalInfo): string {
  const title = info.title || 'Additional Information';
  const entries = Object.entries(info)
    .filter(
      ([key, value]) => key !== 'title' && value !== undefined && value !== null && value !== '',
    )
    .map(([key, value]) => ({ label: key, value: String(value) }));

  if (entries.length === 0) {
    return '';
  }

  const URL_PATTERN = /^https?:\/\/\S+$/i;

  const renderValue = (value: string): string => {
    if (URL_PATTERN.test(value)) {
      return `<a href="${escapeHtml(value)}" target="_blank" rel="noopener noreferrer">${escapeHtml(value)}</a>`;
    }
    return escapeHtml(value);
  };

  return `
    <div class="environment-info" id="additional-info" data-testid="additional-info">
      <div class="env-header clickable" data-testid="additional-info-header">
        <i class="bi bi-chevron-down"></i>
        <span>${escapeHtml(title)}</span>
      </div>
      <div class="env-grid" data-testid="additional-info-grid">
        ${entries
          .map(
            ({ label, value }) => `
        <div class="env-item">
          <span class="env-label">${escapeHtml(label)}</span>
          <span class="env-value">${renderValue(value)}</span>
        </div>
          `,
          )
          .join('')}
      </div>
    </div>
  `;
}
