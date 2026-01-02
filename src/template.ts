import * as os from 'os';
import type { ReportData, TemplateOptions, EnvironmentInfo } from './types';
import {
  generateReportHeader,
  generateInterruptedBanner,
  generateProgressBar,
} from './template/header';
import { generateAdditionalInfoHtml, generateEnvironmentHtml } from './template/sections';
import { generateScript } from './template/script/report-script';
import { generateCustomColorsCss, generateThemeToggle, generateJumpToTop } from './template/styles';
import { generateSuiteHtml } from './template/suites/suite';
import { escapeHtml, formatDuration, formatDate, minifyHtml } from './template/utils';

/* eslint-disable-next-line @stylistic/quotes */
const COMPILED_CSS = `/* __INJECT_CSS__ */`;

export function generateHtmlReport(data: ReportData, options: TemplateOptions): string {
  const {
    pageTitle,
    subtitle,
    logo,
    logoHeight,
    showPassed,
    showFailed,
    showPending,
    showDuration,
    showFilePath,
    showProgressBar,
    theme,
    customColors,
    enableThemeToggle,
    customCss,
    customJs,
    collapsePassed,
    collapseAll,
    expandLevel,
    includeEnvironment,
    additionalInfo,
    minify,
    dateFormat,
    fonts,
  } = options;

  const { summary, testSuites } = data;
  const skippedTests = (summary.pendingTests || 0) + (summary.todoTests || 0);

  const envInfo: EnvironmentInfo | null = includeEnvironment
    ? {
        nodeVersion: process.version,
        platform: `${os.platform()} ${os.release()}`,
        cwd: process.cwd(),
        cpuCores: os.cpus().length,
        totalMemory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
      }
    : null;

  const renderOptions = {
    showPassed,
    showFailed,
    showPending,
    showDuration,
    showFilePath,
    collapsePassed,
    collapseAll,
    expandLevel,
  };

  const customColorsCss = customColors ? generateCustomColorsCss(customColors) : '';

  const fontLinks = fonts
    ? `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${escapeHtml(fonts.url)}" rel="stylesheet">`
    : '';

  const faviconLink = logo ? `\n  <link rel="icon" href="${escapeHtml(logo)}">` : '';

  const fontOverrideCss = fonts
    ? `:root { --font-sans: '${fonts.sans}'; --font-mono: '${fonts.mono}'; }`
    : '';

  const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    (function() {
      try {
        const savedTheme = localStorage.getItem('jest-reporter-theme');
        const theme = savedTheme || '${theme}';
        document.documentElement.className = 'theme-' + theme;
      } catch (e) {}
    })();
  </script>
  <title>${escapeHtml(pageTitle)}</title>${faviconLink}${fontLinks}
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <style>
${COMPILED_CSS}
${fontOverrideCss ? `\n${fontOverrideCss}` : ''}
${customColorsCss ? `\n${customColorsCss}` : ''}
${customCss ? `\n${customCss}` : ''}
  </style>
</head>
<body>
  <div class="container">
    ${generateReportHeader(pageTitle, `${formatDate(summary.endTime, dateFormat)}&nbsp;&nbsp;&nbsp;Total time: ${formatDuration(summary.duration)}`, subtitle, logo, logoHeight)}
    
    <div class="header" data-testid="header">
      <div class="search-box" data-testid="search-box">
        <i class="bi bi-search"></i>
        <input type="text" id="search-input" data-testid="search-input" placeholder="Filter tests">
      </div>
      <div class="subnav-container" data-testid="subnav-container">
        <nav class="subnav" data-testid="subnav">
          <a class="subnav-item active" data-filter="all" data-testid="filter-chip-all" href="#" role="button">
            <span class="subnav-item-label">All</span>
            <span class="counter">${summary.totalTests}</span>
          </a>
          <a class="subnav-item" data-filter="passed" data-testid="filter-chip-passed" href="#" role="button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="subnav-icon passed">
              <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
            </svg>
            <span class="subnav-item-label">Passed</span>
            <span class="counter">${summary.passedTests}</span>
          </a>
          <a class="subnav-item" data-filter="failed" data-testid="filter-chip-failed" href="#" role="button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="subnav-icon failed">
              <path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
            </svg>
            <span class="subnav-item-label">Failed</span>
            <span class="counter">${summary.failedTests}</span>
          </a>
          <a class="subnav-item" data-filter="flaky" data-testid="filter-chip-flaky" href="#" role="button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="subnav-icon flaky">
              <path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.75 4a.75.75 0 00-1.5 0v3.5a.75.75 0 00.22.53l2.25 2.25a.75.75 0 001.06-1.06L8.75 7.19V4z"></path>
            </svg>
            <span class="subnav-item-label">Flaky</span>
            <span class="counter">${summary.flakyTests}</span>
          </a>
          <a class="subnav-item" data-filter="pending" data-testid="filter-chip-skipped" href="#" role="button">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="subnav-icon skipped">
              <path d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm3.28 5.78a.75.75 0 00-1.06-1.06l-5.5 5.5a.75.75 0 101.06 1.06l5.5-5.5z"></path>
            </svg>
            <span class="subnav-item-label">Skipped</span>
            <span class="counter">${skippedTests}</span>
          </a>
        </nav>
      </div>
    </div>

    ${summary.wasInterrupted ? generateInterruptedBanner() : ''}
    ${showProgressBar ? generateProgressBar(summary) : ''}
    ${envInfo ? generateEnvironmentHtml(envInfo) : ''}
    ${additionalInfo ? generateAdditionalInfoHtml(additionalInfo) : ''}

    <div id="test-suites">
      ${testSuites.map((suite, idx) => generateSuiteHtml(suite, idx, renderOptions)).join('')}
    </div>

    ${
      testSuites.length === 0
        ? `
      <div class="empty-state" data-testid="empty-state">
        <i class="bi bi-inbox"></i>
        <p>No test results found</p>
      </div>
    `
        : ''
    }
  </div>

  ${enableThemeToggle ? generateThemeToggle(theme) : ''}
  ${generateJumpToTop(enableThemeToggle)}

  <script>
${generateScript({ collapsePassed, collapseAll, expandLevel, enableThemeToggle, currentTheme: theme })}
${customJs ? `\n${customJs}` : ''}
  </script>
</body>
</html>`;

  return minify ? minifyHtml(reportHtml) : reportHtml;
}
