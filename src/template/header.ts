import { escapeHtml } from './utils/escape';

export function generateReportHeader(
  title: string,
  metaInfo: string,
  subtitle?: string,
  logo?: string,
  logoHeight = 32,
): string {
  const hasBranding = Boolean(subtitle ?? logo);

  return `
    <div class="report-header" data-testid="report-header">
      ${
        hasBranding
          ? `
      <div class="report-branding">
        <div class="report-title-row" data-testid="report-title-row">
          ${logo ? `<img src="${escapeHtml(logo)}" alt="Logo" class="header-logo" data-testid="header-logo" style="height: ${logoHeight}px">` : ''}
          <h1 class="report-title" data-testid="report-title">${escapeHtml(title)}</h1>
        </div>
        ${subtitle ? `<p class="report-subtitle" data-testid="report-subtitle">${escapeHtml(subtitle)}</p>` : ''}
      </div>
      `
          : `<h1 class="report-title" data-testid="report-title">${escapeHtml(title)}</h1>`
      }
      <div class="meta-info" data-testid="meta-info">${metaInfo}</div>
    </div>
  `;
}

export function generateInterruptedBanner(): string {
  return `
    <div class="interrupted-banner" data-testid="interrupted-banner">
      <i class="bi bi-exclamation-triangle-fill"></i>
      <span>Test run stopped early. Not all tests were executed.</span>
    </div>
  `;
}

export function generateProgressBar(summary: {
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  todoTests: number;
  totalTests: number;
}): string {
  const total = summary.totalTests || 1;
  const passedPct = (summary.passedTests / total) * 100;
  const failedPct = (summary.failedTests / total) * 100;
  const skippedPct = ((summary.pendingTests + summary.todoTests) / total) * 100;

  return `
    <div class="progress-bar-container" data-testid="progress-bar">
      <div class="progress-bar-header" data-testid="progress-bar-header">
        <div class="progress-bar-stats" data-testid="progress-bar-stats">
          <span class="stat"><span class="dot passed"></span> ${summary.passedTests} passed</span>
          <span class="stat"><span class="dot failed"></span> ${summary.failedTests} failed</span>
          <span class="stat"><span class="dot skipped"></span> ${summary.pendingTests + summary.todoTests} skipped</span>
        </div>
        <span data-testid="progress-bar-passed-percentage">${Math.round((summary.passedTests / total) * 100)}% passed</span>
      </div>
      <div class="progress-bar" data-testid="progress-bar-track">
        <div class="segment passed" style="width: ${passedPct}%"></div>
        <div class="segment failed" style="width: ${failedPct}%"></div>
        <div class="segment skipped" style="width: ${skippedPct}%"></div>
      </div>
    </div>
  `;
}
