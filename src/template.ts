import * as os from 'os';
import type {
  ReportData,
  TemplateOptions,
  ProcessedTestSuite,
  ProcessedTest,
  EnvironmentInfo,
  CustomColors,
  ThemePreset,
} from './types';

const COMPILED_CSS = `/* __INJECT_CSS__ */`;

const THEME_PREVIEWS: Record<ThemePreset, string> = {
  dark: '#1e1e1e',
  light: '#ffffff',
  github: '#0d1117',
  monokai: '#272822',
  dracula: '#282a36',
  nord: '#2e3440',
};

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
    dateFormat,
  } = options;

  const { summary, testSuites } = data;
  const skippedTests = (summary.pendingTests || 0) + (summary.todoTests || 0);
  const themeClass = `theme-${theme}`;

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

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <style>
${COMPILED_CSS}
${customColorsCss ? `\n${customColorsCss}` : ''}
${customCss ? `\n${customCss}` : ''}
  </style>
</head>
<body>
  <div class="container">
    ${generateReportHeader(pageTitle, subtitle, logo, logoHeight)}
    
    <div class="header">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input type="text" id="search-input" placeholder="Filter tests">
      </div>
      <div class="filter-chips">
        <button class="filter-chip all active" data-filter="all">
          <span class="label">All</span>
          <span class="count">${summary.totalTests}</span>
        </button>
        <button class="filter-chip passed" data-filter="passed">
          <span class="label">Passed</span>
          <span class="count">${summary.passedTests}</span>
        </button>
        <button class="filter-chip failed" data-filter="failed">
          <span class="label">Failed</span>
          <span class="count">${summary.failedTests}</span>
        </button>
        <button class="filter-chip skipped" data-filter="pending">
          <span class="label">Skipped</span>
          <span class="count">${skippedTests}</span>
        </button>
      </div>
      <div class="meta-info">
        ${formatDate(summary.endTime, dateFormat)}&nbsp;&nbsp;&nbsp;Total time: ${formatDuration(summary.duration)}
      </div>
    </div>

    ${showProgressBar ? generateProgressBar(summary) : ''}
    ${envInfo ? generateEnvironmentHtml(envInfo) : ''}

    <div id="test-suites">
      ${testSuites.map((suite, idx) => generateSuiteHtml(suite, idx, renderOptions)).join('')}
    </div>

    ${
      testSuites.length === 0
        ? `
      <div class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>No test results found</p>
      </div>
    `
        : ''
    }
  </div>

  ${enableThemeToggle ? generateThemeToggle(theme) : ''}

  <script>
${generateScript({ collapsePassed, collapseAll, expandLevel, enableThemeToggle, currentTheme: theme })}
${customJs ? `\n${customJs}` : ''}
  </script>
</body>
</html>`;
}

function generateReportHeader(
  title: string,
  subtitle?: string,
  logo?: string,
  logoHeight = 32,
): string {
  if (!subtitle && !logo) {
    return '';
  }

  return `
    <div class="report-header">
      <div class="report-title-row">
        ${logo ? `<img src="${escapeHtml(logo)}" alt="Logo" class="header-logo" style="height: ${logoHeight}px">` : ''}
        <h1 class="report-title">${escapeHtml(title)}</h1>
      </div>
      ${subtitle ? `<p class="report-subtitle">${escapeHtml(subtitle)}</p>` : ''}
    </div>
  `;
}

function generateProgressBar(summary: {
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
    <div class="progress-bar-container">
      <div class="progress-bar-header">
        <div class="progress-bar-stats">
          <span class="stat"><span class="dot passed"></span> ${summary.passedTests} passed</span>
          <span class="stat"><span class="dot failed"></span> ${summary.failedTests} failed</span>
          <span class="stat"><span class="dot skipped"></span> ${summary.pendingTests + summary.todoTests} skipped</span>
        </div>
        <span>${Math.round((summary.passedTests / total) * 100)}% passing</span>
      </div>
      <div class="progress-bar">
        <div class="segment passed" style="width: ${passedPct}%"></div>
        <div class="segment failed" style="width: ${failedPct}%"></div>
        <div class="segment skipped" style="width: ${skippedPct}%"></div>
      </div>
    </div>
  `;
}

function generateCustomColorsCss(colors: CustomColors): string {
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

  if (rules.length === 0) return '';

  return `:root {\n${rules.join('\n')}\n}`;
}

function generateThemeToggle(currentTheme: ThemePreset): string {
  const themes: ThemePreset[] = ['dark', 'light', 'github', 'monokai', 'dracula', 'nord'];

  return `
    <button class="theme-toggle" id="theme-toggle" title="Change theme">
      <i class="bi bi-palette"></i>
    </button>
    <div class="theme-menu" id="theme-menu">
      ${themes
        .map(
          t => `
        <div class="theme-option${t === currentTheme ? ' active' : ''}" data-theme="${t}">
          <span class="color-preview" style="background: ${THEME_PREVIEWS[t]}"></span>
          ${t.charAt(0).toUpperCase() + t.slice(1)}
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

function generateEnvironmentHtml(env: EnvironmentInfo): string {
  return `
    <div class="environment-info" id="env-info">
      <div class="env-header" onclick="this.parentElement.classList.toggle('collapsed')">
        <i class="bi bi-chevron-down"></i>
        <span>Environment</span>
      </div>
      <div class="env-grid">
        <div class="env-item">
          <span class="env-label">Node.js</span>
          <span class="env-value">${escapeHtml(env.nodeVersion)}</span>
        </div>
        <div class="env-item">
          <span class="env-label">Platform</span>
          <span class="env-value">${escapeHtml(env.platform)}</span>
        </div>
        <div class="env-item">
          <span class="env-label">CPU Cores</span>
          <span class="env-value">${env.cpuCores}</span>
        </div>
        <div class="env-item">
          <span class="env-label">Memory</span>
          <span class="env-value">${escapeHtml(env.totalMemory)}</span>
        </div>
      </div>
    </div>
  `;
}

function generateSuiteHtml(
  suite: ProcessedTestSuite,
  index: number,
  options: {
    showPassed: boolean;
    showFailed: boolean;
    showPending: boolean;
    showDuration: boolean;
    showFilePath: 'full' | 'filename';
    collapsePassed: boolean;
    collapseAll: boolean;
    expandLevel: number;
  },
): string {
  const hasFailed = suite.tests.some(t => t.status === 'failed');

  let shouldCollapse = false;

  if (options.collapseAll) {
    shouldCollapse = true;
  }

  if (options.collapsePassed && suite.status === 'passed') {
    shouldCollapse = true;
  }

  if (!options.collapseAll && options.expandLevel >= 0 && index >= options.expandLevel) {
    shouldCollapse = true;
  }

  if (hasFailed) {
    shouldCollapse = false;
  }

  const displayName = options.showFilePath === 'full' ? suite.name : getFileName(suite.name);

  return `
    <div class="suite${shouldCollapse ? ' collapsed' : ''}" data-status="${suite.status}" data-has-failed="${hasFailed}" data-name="${escapeHtml(suite.name)}">
      <div class="suite-header">
        <i class="bi bi-chevron-down suite-chevron"></i>
        <span class="suite-name">${escapeHtml(displayName)}</span>
        ${options.showDuration ? `<span class="test-duration" style="margin-left: auto">${formatDuration(suite.duration)}</span>` : ''}
      </div>
      <div class="suite-body">
        ${
          suite.failureMessage
            ? `
          <div class="test-item">
            <div class="test-content">
              <div class="error-block">${escapeHtml(suite.failureMessage)}</div>
            </div>
          </div>
        `
            : ''
        }
        ${suite.tests.map(test => generateTestHtml(test, suite, options)).join('')}
      </div>
    </div>
  `;
}

function generateTestHtml(
  test: ProcessedTest,
  suite: ProcessedTestSuite,
  options: {
    showPassed: boolean;
    showFailed: boolean;
    showPending: boolean;
    showDuration: boolean;
    showFilePath: 'full' | 'filename';
  },
): string {
  if (test.status === 'passed' && !options.showPassed) return '';
  if (test.status === 'failed' && !options.showFailed) return '';
  if (
    (test.status === 'pending' || test.status === 'skipped' || test.status === 'todo') &&
    !options.showPending
  )
    return '';

  const statusIcon: Record<string, string> = {
    passed: 'bi-check-lg',
    failed: 'bi-x-lg',
    pending: 'bi-skip-forward-fill',
    skipped: 'bi-skip-forward-fill',
    todo: 'bi-skip-forward-fill',
  };

  const fileName = options.showFilePath === 'full' ? suite.name : getFileName(suite.name);

  const ancestorTags = test.ancestorTitles
    .map(title => {
      const colorIndex = hashString(title) % 8;
      return `<span class="test-tag test-tag-${colorIndex}">${escapeHtml(title)}</span>`;
    })
    .join('');

  return `
    <div class="test-item" data-status="${test.status}">
      <i class="bi ${statusIcon[test.status] || 'bi-circle'} test-status-icon ${test.status}"></i>
      <div class="test-content">
        <div class="test-title-row">
          <span class="test-title">${escapeHtml(test.title)}</span>
          ${ancestorTags}
        </div>
        <div class="test-location">${escapeHtml(fileName)}</div>
        ${
          test.failureMessages.length > 0
            ? `
          <div class="error-block">${test.failureMessages.map(msg => escapeHtml(msg)).join('\n\n')}</div>
        `
            : ''
        }
      </div>
      ${options.showDuration ? `<span class="test-duration">${formatDuration(test.duration)}</span>` : ''}
    </div>
  `;
}

function generateScript(options: {
  collapsePassed: boolean;
  collapseAll: boolean;
  expandLevel: number;
  enableThemeToggle: boolean;
  currentTheme: ThemePreset;
}): string {
  return `
    document.querySelectorAll('.suite-header').forEach(header => {
      header.addEventListener('click', () => {
        const suite = header.closest('.suite');
        suite.classList.toggle('collapsed');
      });
    });

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;
        
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        document.querySelectorAll('.test-item').forEach(item => {
          if (filter === 'all') {
            item.style.display = 'flex';
          } else {
            const status = item.dataset.status;
            const match = filter === 'pending' 
              ? ['pending', 'skipped', 'todo'].includes(status)
              : status === filter;
            item.style.display = match ? 'flex' : 'none';
          }
        });

        document.querySelectorAll('.suite').forEach(suite => {
          const hasVisible = Array.from(suite.querySelectorAll('.test-item')).some(t => t.style.display !== 'none');
          suite.style.display = hasVisible ? 'block' : 'none';
        });
      });
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      
      document.querySelectorAll('.test-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) || !query ? 'flex' : 'none';
      });

      document.querySelectorAll('.suite').forEach(suite => {
        const hasVisible = Array.from(suite.querySelectorAll('.test-item')).some(t => t.style.display !== 'none');
        suite.style.display = hasVisible ? 'block' : 'none';
        if (hasVisible && query) suite.classList.remove('collapsed');
      });
    });

    ${
      options.enableThemeToggle
        ? `
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    let currentTheme = '${options.currentTheme}';
    
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('visible');
    });
    
    document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', () => {
        const newTheme = option.dataset.theme;
        document.documentElement.className = 'theme-' + newTheme;
        
        document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        try {
          localStorage.setItem('jest-reporter-theme', newTheme);
        } catch (e) {}
        
        themeMenu.classList.remove('visible');
      });
    });
    
    document.addEventListener('click', () => {
      themeMenu.classList.remove('visible');
    });
    
    try {
      const savedTheme = localStorage.getItem('jest-reporter-theme');
      if (savedTheme) {
        document.documentElement.className = 'theme-' + savedTheme;
        document.querySelectorAll('.theme-option').forEach(o => {
          o.classList.toggle('active', o.dataset.theme === savedTheme);
        });
      }
    } catch (e) {}
    `
        : ''
    }
  `;
}

function getFileName(filePath: string): string {
  return filePath.split('/').pop() || filePath;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(text).replace(/[&<>"']/g, char => htmlEntities[char]);
}

function formatDuration(ms: number | null | undefined): string {
  if (ms == null || ms < 0) return '0ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(1);
  return `${minutes}m ${seconds}s`;
}

function formatDate(isoString: string, format: 'locale' | 'iso' | 'relative'): string {
  const date = new Date(isoString);

  switch (format) {
    case 'iso':
      return isoString;
    case 'relative':
      return getRelativeTime(date);
    case 'locale':
    default:
      return date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString('en-US');
}
